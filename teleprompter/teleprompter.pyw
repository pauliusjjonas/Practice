"""Teleprompter - a small always-on-top scrolling script window for online calls.

Paste your script, press Start, and a compact floating prompter appears that
stays above your call window. It can also hide itself from screen sharing.

Two scroll modes:
    Voice   listens to you (offline, via Vosk) and keeps the line you're
            saying at the orange marker; words you've said turn grey
    Auto    scrolls at a constant speed

Controls (prompter window):
    Space          play / pause (in voice mode: start / stop listening)
    V              switch between voice and auto mode
    Up / Down      faster / slower (auto mode)
    + / -          bigger / smaller text
    Mouse wheel    scroll manually (voice mode picks up from the marker)
    Home           back to the top
    Esc            back to the editor
"""

import bisect
import ctypes
import json
import queue
import re
import sys
import threading
import time
import tkinter as tk
from pathlib import Path

SETTINGS_FILE = Path.home() / ".teleprompter.json"
# when packaged with PyInstaller, bundled files live in sys._MEIPASS
RESOURCES = Path(getattr(sys, "_MEIPASS", Path(__file__).resolve().parent))
MODEL_DIR = RESOURCES / "vosk-model-small-en-us-0.15"
ICON_FILE = RESOURCES / "icon.ico"

try:
    import sounddevice as sd
    import vosk
    VOICE_AVAILABLE = MODEL_DIR.is_dir()
except Exception:
    VOICE_AVAILABLE = False

DEFAULTS = {
    "text": "",
    "speed": 40,          # pixels per second
    "font_size": 22,
    "opacity": 0.85,
    "hide_from_capture": True,
    "voice_mode": True,
    "geometry": "520x220+60+60",
}

BG = "#111111"
FG = "#f2f2f2"
DONE_FG = "#5c5c5c"
BAR_BG = "#1e1e1e"
ACCENT = "#ff8c1a"
MUTED = "#8a8a8a"
GOOD = "#4cc38a"

WDA_NONE = 0x0
WDA_EXCLUDEFROMCAPTURE = 0x11

WORD_RE = re.compile(r"[A-Za-z0-9'’]+")


def load_settings():
    try:
        data = json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
        return {**DEFAULTS, **data}
    except (OSError, ValueError):
        return dict(DEFAULTS)


def save_settings(settings):
    try:
        SETTINGS_FILE.write_text(json.dumps(settings, indent=2), encoding="utf-8")
    except OSError:
        pass


def set_capture_hidden(window, hidden):
    """Exclude a window from screen capture / screen share (Windows 10 2004+)."""
    if sys.platform != "win32":
        return False
    try:
        window.update_idletasks()
        hwnd = ctypes.windll.user32.GetParent(window.winfo_id()) or window.winfo_id()
        affinity = WDA_EXCLUDEFROMCAPTURE if hidden else WDA_NONE
        return bool(ctypes.windll.user32.SetWindowDisplayAffinity(hwnd, affinity))
    except Exception:
        return False


def tokenize(text):
    """Return (start, end, normalised_word) for every word in the script."""
    words = []
    for m in WORD_RE.finditer(text):
        w = m.group().lower().replace("’", "'").strip("'")
        if w:
            words.append((m.start(), m.end(), w))
    return words


def lcs_len(a, b):
    """Length of the longest common subsequence of two short word lists."""
    prev = [0] * (len(b) + 1)
    for x in a:
        cur = [0]
        for j, y in enumerate(b):
            cur.append(prev[j] + 1 if x == y else max(prev[j + 1], cur[j]))
        prev = cur
    return prev[-1]


class Tracker:
    """Works out where in the script the speaker is, from recently heard words."""

    def __init__(self, words):
        self.words = words
        self.pos = 0  # index of the next word we expect to hear

    def update(self, heard):
        if not heard or not self.words:
            return False
        last, tail = heard[-1], heard[-6:]
        anchor = self.pos - 1
        best = None
        for j in range(max(0, anchor - 3), min(len(self.words), anchor + 40)):
            if self.words[j] != last:
                continue
            score = lcs_len(tail, self.words[max(0, j - 7):j + 1])
            dist = j - anchor
            # further jumps need more evidence, so common words can't drag us around
            need = 1 if -1 <= dist <= 2 else 2 if -3 <= dist <= 10 else 3
            if score < need:
                continue
            key = (score, -abs(dist) - (3 if dist < 0 else 0))
            if best is None or key > best[0]:
                best = (key, j)
        if best and best[1] + 1 != self.pos:
            self.pos = best[1] + 1
            return True
        return False


class VoiceListener:
    """Runs offline speech recognition on a background thread."""

    def __init__(self, vocab):
        self.events = queue.Queue()
        self.vocab = sorted(vocab)
        self.active = False
        self._stop = threading.Event()
        threading.Thread(target=self._run, daemon=True).start()

    def _run(self):
        try:
            self.events.put(("status", "loading voice…"))
            vosk.SetLogLevel(-1)
            model = vosk.Model(str(MODEL_DIR))
            rate = int(sd.query_devices(kind="input")["default_samplerate"])
            # limiting recognition to the script's words makes it far more accurate
            rec = vosk.KaldiRecognizer(model, rate, json.dumps(self.vocab + ["[unk]"]))
            audio = queue.Queue()

            def callback(indata, frames, t, status):
                if self.active:
                    audio.put(bytes(indata))

            with sd.RawInputStream(samplerate=rate, blocksize=rate // 10,
                                   dtype="int16", channels=1, callback=callback):
                self.events.put(("ready", None))
                committed, partial, last = [], [], None
                while not self._stop.is_set():
                    try:
                        data = audio.get(timeout=0.2)
                    except queue.Empty:
                        continue
                    if rec.AcceptWaveform(data):
                        committed = (committed + json.loads(rec.Result()).get("text", "").split())[-10:]
                        partial = []
                    else:
                        partial = json.loads(rec.PartialResult()).get("partial", "").split()
                    heard = [w for w in committed + partial if w != "[unk]"][-8:]
                    if heard != last:
                        last = heard
                        self.events.put(("heard", heard))
        except Exception as e:
            self.events.put(("error", str(e)))

    def stop(self):
        self.active = False
        self._stop.set()


class Editor:
    def __init__(self, root, settings, on_start):
        self.root = root
        self.settings = settings
        self.on_start = on_start

        root.title("Teleprompter")
        root.geometry("640x480")
        root.minsize(420, 300)
        root.configure(bg=BG)

        header = tk.Label(
            root, text="Paste your script below", bg=BG, fg=FG,
            font=("Segoe UI", 13, "bold"), anchor="w",
        )
        header.pack(fill="x", padx=16, pady=(14, 6))

        frame = tk.Frame(root, bg=BG)
        frame.pack(fill="both", expand=True, padx=16)
        scrollbar = tk.Scrollbar(frame)
        scrollbar.pack(side="right", fill="y")
        self.text = tk.Text(
            frame, wrap="word", font=("Segoe UI", 12), bg="#1a1a1a", fg=FG,
            insertbackground=FG, relief="flat", padx=10, pady=10,
            undo=True, yscrollcommand=scrollbar.set,
        )
        self.text.pack(side="left", fill="both", expand=True)
        scrollbar.config(command=self.text.yview)
        self.text.insert("1.0", settings["text"])
        self.text.focus_set()

        bottom = tk.Frame(root, bg=BG)
        bottom.pack(fill="x", padx=16, pady=12)

        checks = tk.Frame(bottom, bg=BG)
        checks.pack(side="left")
        check_style = dict(bg=BG, fg=FG, selectcolor="#1a1a1a", activebackground=BG,
                           activeforeground=FG, font=("Segoe UI", 10), anchor="w")

        self.voice_var = tk.BooleanVar(value=settings["voice_mode"] and VOICE_AVAILABLE)
        tk.Checkbutton(
            checks, variable=self.voice_var,
            text="Follow my voice" if VOICE_AVAILABLE else "Follow my voice (speech model missing)",
            state="normal" if VOICE_AVAILABLE else "disabled", **check_style,
        ).pack(fill="x")

        self.hide_var = tk.BooleanVar(value=settings["hide_from_capture"])
        tk.Checkbutton(
            checks, text="Hide prompter from screen sharing", variable=self.hide_var,
            **check_style,
        ).pack(fill="x")

        tk.Button(
            bottom, text="Clear", command=lambda: self.text.delete("1.0", "end"),
            bg="#2a2a2a", fg=FG, relief="flat", padx=14, pady=4,
            activebackground="#3a3a3a", activeforeground=FG,
        ).pack(side="right", padx=(8, 0))
        tk.Button(
            bottom, text="Start prompter  ▶", command=self.start,
            bg=ACCENT, fg="#111111", relief="flat", padx=14, pady=4,
            font=("Segoe UI", 10, "bold"), activebackground="#ffa64d",
        ).pack(side="right")

        root.bind("<Control-Return>", lambda e: self.start())

    def start(self):
        self.settings["text"] = self.text.get("1.0", "end-1c")
        self.settings["hide_from_capture"] = self.hide_var.get()
        if VOICE_AVAILABLE:
            self.settings["voice_mode"] = self.voice_var.get()
        save_settings(self.settings)
        self.on_start()


class Prompter:
    def __init__(self, root, settings, on_close):
        self.settings = settings
        self.on_close = on_close
        self.voice = settings["voice_mode"] and VOICE_AVAILABLE
        self.playing = False
        self.offset = 0.0
        self.target = 0.0
        self.max_offset = 0.0
        self.total = 1
        self.guide_y = 0
        self.last_tick = None
        self.listener = None
        self.voice_status = ""

        self.content = settings["text"] or "(no text)"
        self.words = tokenize(self.content)
        self.starts = [s for s, _, _ in self.words]
        self.tracker = Tracker([w for _, _, w in self.words])

        win = self.win = tk.Toplevel(root)
        win.overrideredirect(True)
        win.attributes("-topmost", True)
        win.attributes("-alpha", settings["opacity"])
        win.configure(bg=BG)
        win.geometry(settings["geometry"])
        win.minsize(240, 110)

        # --- control bar (also the drag handle); packed left-to-right in priority order ---
        bar = tk.Frame(win, bg=BAR_BG, height=28)
        bar.pack(fill="x", side="top")

        def btn(text, cmd, color=FG):
            b = tk.Label(bar, text=text, bg=BAR_BG, fg=color,
                         font=("Segoe UI", 10, "bold"), padx=7, cursor="hand2")
            b.bind("<Button-1>", lambda e: (cmd(), "break")[1])
            b.bind("<Enter>", lambda e: b.configure(bg="#333333"))
            b.bind("<Leave>", lambda e: b.configure(bg=BAR_BG))
            b.pack(side="left", fill="y")
            return b

        self.play_btn = btn("▶", self.toggle_play, ACCENT)
        self.mode_btn = btn("", self.toggle_mode)
        btn("⏮", self.reset)
        self.slower_btn = btn("−", lambda: self.change_speed(-10))
        self.speed_label = tk.Label(bar, bg=BAR_BG, fg=MUTED, font=("Segoe UI", 9))
        self.speed_label.pack(side="left")
        self.faster_btn = btn("+", lambda: self.change_speed(10))
        btn("A−", lambda: self.change_font(-2))
        btn("A+", lambda: self.change_font(2))
        btn("◐", self.cycle_opacity)

        close = tk.Label(bar, text="✕", bg=BAR_BG, fg=FG, font=("Segoe UI", 10, "bold"),
                         padx=9, cursor="hand2")
        close.pack(side="right", fill="y")
        close.bind("<Button-1>", lambda e: self.close())
        close.bind("<Enter>", lambda e: close.configure(bg="#c42b1c"))
        close.bind("<Leave>", lambda e: close.configure(bg=BAR_BG))

        self.status_label = tk.Label(bar, bg=BAR_BG, fg=MUTED, font=("Segoe UI", 8), padx=6)
        self.status_label.pack(side="right")

        for w in (bar, self.speed_label, self.status_label):
            w.bind("<ButtonPress-1>", self.drag_start)
            w.bind("<B1-Motion>", self.drag_move)

        # --- script text ---
        self.text = tk.Text(
            win, wrap="word", bg=BG, fg=FG, font=("Segoe UI", settings["font_size"]),
            padx=14, pady=0, bd=0, highlightthickness=0, cursor="arrow",
            insertwidth=0, spacing3=4,
        )
        self.text.pack(fill="both", expand=True)
        self.text.insert("1.0", self.content)
        self.text.insert("end", "\n")
        self.text.insert("end", " ", "tail")    # padding line so the last words reach the marker
        self.text.tag_configure("done", foreground=DONE_FG)
        self.text.configure(state="disabled")

        # reading guide: the current line is kept level with this marker
        self.guide = tk.Frame(self.text, bg=ACCENT, width=4)

        grip = tk.Label(win, text="◢", bg=BG, fg=MUTED, cursor="size_nw_se",
                        font=("Segoe UI", 9))
        grip.place(relx=1.0, rely=1.0, anchor="se")
        grip.bind("<ButtonPress-1>", self.resize_start)
        grip.bind("<B1-Motion>", self.resize_move)

        self.text.bind("<Configure>", lambda e: self.layout())
        self.text.bind("<Button-1>", lambda e: (win.focus_force(), self.toggle_play(), "break")[2])
        for seq in ("<B1-Motion>", "<Double-Button-1>", "<Triple-Button-1>"):
            self.text.bind(seq, lambda e: "break")
        win.bind("<MouseWheel>", self.on_wheel)
        win.bind("<space>", lambda e: self.toggle_play())
        win.bind("<v>", lambda e: self.toggle_mode())
        win.bind("<Up>", lambda e: self.change_speed(10))
        win.bind("<Down>", lambda e: self.change_speed(-10))
        win.bind("<plus>", lambda e: self.change_font(2))
        win.bind("<equal>", lambda e: self.change_font(2))
        win.bind("<minus>", lambda e: self.change_font(-2))
        win.bind("<Home>", lambda e: self.reset())
        win.bind("<Escape>", lambda e: self.close())

        if self.voice:
            self.start_listener()
            self.playing = True   # in voice mode nothing moves until you speak
        self.update_labels()
        win.after(50, self.apply_capture_setting)
        win.after(60, win.focus_force)
        self.tick()

    # ---------- measuring ----------
    def ypix(self, index):
        r = self.text.count("1.0", index, "ypixels")
        if isinstance(r, tuple):
            r = r[0]
        return r or 0

    def layout(self):
        h = self.text.winfo_height()
        self.guide_y = h * 0.3
        self.guide.place(x=0, y=self.guide_y - 14, width=4, height=28)
        self.text.tag_configure("tail", spacing1=h)
        self.text.tk.call(self.text._w, "sync")
        self.total = max(self.ypix("end"), 1)
        self.max_offset = max(self.ypix("tail.first") - self.guide_y, 0)
        if self.voice:
            self.target = self.word_target()
        self.offset = min(self.offset, self.max_offset)
        self.apply_offset()

    def word_target(self):
        """Scroll offset that puts the line currently being spoken at the marker."""
        if not self.words or self.tracker.pos == 0:
            return 0.0
        start = self.starts[min(self.tracker.pos, len(self.words) - 1)]
        y = self.ypix(f"1.0 + {start} chars")
        line_h = self.text.dlineinfo("1.0")
        half = (line_h[3] / 2) if line_h else 14
        return min(max(y + half - self.guide_y, 0), self.max_offset)

    def apply_offset(self):
        self.text.yview_moveto(self.offset / self.total)

    def mark_spoken(self):
        self.text.tag_remove("done", "1.0", "end")
        if self.tracker.pos > 0:
            end = self.words[self.tracker.pos - 1][1]
            self.text.tag_add("done", "1.0", f"1.0 + {end} chars")

    # ---------- behaviour ----------
    def apply_capture_setting(self):
        self.capture_ok = set_capture_hidden(self.win, self.settings["hide_from_capture"])
        self.update_labels()

    def start_listener(self):
        if self.listener is None:
            self.voice_status = "loading voice…"
            self.listener = VoiceListener({w for _, _, w in self.words})

    def poll_listener(self):
        if not self.listener:
            return
        try:
            while True:
                kind, data = self.listener.events.get_nowait()
                if kind == "status":
                    self.voice_status = data
                elif kind == "ready":
                    self.voice_status = "ready"
                    self.listener.active = self.voice and self.playing
                elif kind == "error":
                    self.voice_status = "mic error"
                    self.listener = None
                    self.voice = False
                    self.playing = False
                elif kind == "heard" and self.voice and self.tracker.update(data):
                    self.mark_spoken()
                    self.target = self.word_target()
                self.update_labels()
        except queue.Empty:
            pass

    def tick(self):
        now = time.perf_counter()
        dt = (now - self.last_tick) if self.last_tick is not None else 0
        self.last_tick = now
        self.poll_listener()
        before = self.offset
        if self.voice:
            # ease towards the spoken line so it glides rather than jumps
            self.offset += (self.target - self.offset) * min(1.0, dt * 5)
        elif self.playing:
            self.offset += self.settings["speed"] * dt
            if self.offset >= self.max_offset:
                self.offset = self.max_offset
                self.playing = False
                self.update_labels()
        if abs(self.offset - before) > 0.1:
            self.apply_offset()
        self.after_id = self.win.after(16, self.tick)

    def toggle_play(self):
        self.playing = not self.playing
        if self.listener:
            self.listener.active = self.voice and self.playing
        self.update_labels()

    def toggle_mode(self):
        if not VOICE_AVAILABLE:
            return
        self.voice = not self.voice
        self.settings["voice_mode"] = self.voice
        if self.voice:
            self.start_listener()
            self.sync_to_marker()
            self.playing = True
        else:
            self.playing = False
        if self.listener:
            self.listener.active = self.voice and self.playing
        self.update_labels()

    def sync_to_marker(self):
        """Make voice tracking continue from whatever line is at the marker."""
        idx = self.text.index(f"@20,{int(self.guide_y)}")
        chars = self.text.count("1.0", idx, "chars")
        chars = (chars[0] if isinstance(chars, tuple) else chars) or 0
        self.tracker.pos = bisect.bisect_left(self.starts, chars)
        self.mark_spoken()
        self.target = self.offset

    def reset(self):
        self.offset = self.target = 0
        self.tracker.pos = 0
        self.mark_spoken()
        if not self.voice:
            self.playing = False
        self.apply_offset()
        self.update_labels()

    def change_speed(self, delta):
        if self.voice:
            return
        self.settings["speed"] = min(max(self.settings["speed"] + delta, 10), 300)
        self.update_labels()

    def change_font(self, delta):
        size = min(max(self.settings["font_size"] + delta, 10), 72)
        self.settings["font_size"] = size
        self.text.configure(font=("Segoe UI", size))
        self.layout()
        if self.voice:
            self.offset = self.target

    def cycle_opacity(self):
        levels = [1.0, 0.85, 0.7, 0.55]
        cur = self.settings["opacity"]
        nxt = levels[(min(range(len(levels)), key=lambda i: abs(levels[i] - cur)) + 1) % len(levels)]
        self.settings["opacity"] = nxt
        self.win.attributes("-alpha", nxt)

    def on_wheel(self, event):
        self.offset = min(max(self.offset - event.delta / 120 * 40, 0), self.max_offset)
        self.apply_offset()
        if self.voice:
            self.sync_to_marker()

    def update_labels(self):
        self.play_btn.configure(text="⏸" if self.playing else "▶")
        self.mode_btn.configure(text="Voice" if self.voice else "Auto",
                                fg=GOOD if self.voice else FG)
        auto_state = MUTED if self.voice else FG
        self.slower_btn.configure(fg=auto_state)
        self.faster_btn.configure(fg=auto_state)
        self.speed_label.configure(text="" if self.voice else f"{self.settings['speed']}")

        parts = []
        if self.voice:
            if self.voice_status == "ready":
                parts.append("● listening" if self.playing else "mic paused")
            else:
                parts.append(self.voice_status)
        elif self.voice_status == "mic error":
            parts.append("mic error")
        if self.settings["hide_from_capture"] and hasattr(self, "capture_ok"):
            parts.append("hidden" if self.capture_ok else "share-hide failed")
        listening = self.voice and self.playing and self.voice_status == "ready"
        self.status_label.configure(text="  ·  ".join(parts), fg=GOOD if listening else MUTED)

    # ---------- window move / resize ----------
    def drag_start(self, event):
        self._drag = (event.x_root - self.win.winfo_x(), event.y_root - self.win.winfo_y())

    def drag_move(self, event):
        dx, dy = self._drag
        self.win.geometry(f"+{event.x_root - dx}+{event.y_root - dy}")

    def resize_start(self, event):
        self._resize = (event.x_root, event.y_root, self.win.winfo_width(), self.win.winfo_height())

    def resize_move(self, event):
        x0, y0, w0, h0 = self._resize
        w = max(w0 + event.x_root - x0, 240)
        h = max(h0 + event.y_root - y0, 110)
        self.win.geometry(f"{w}x{h}")

    def close(self):
        if self.listener:
            self.listener.stop()
        self.settings["geometry"] = self.win.geometry()
        save_settings(self.settings)
        self.win.after_cancel(self.after_id)
        self.win.destroy()
        self.on_close()


class App:
    def __init__(self):
        if sys.platform == "win32":
            try:
                ctypes.windll.shcore.SetProcessDpiAwareness(1)
            except Exception:
                pass
        self.root = tk.Tk()
        if ICON_FILE.exists():
            self.root.iconbitmap(default=str(ICON_FILE))
        self.settings = load_settings()
        self.editor = Editor(self.root, self.settings, self.show_prompter)
        self.prompter = None
        self.root.protocol("WM_DELETE_WINDOW", self.quit)

    def show_prompter(self):
        self.root.withdraw()
        self.prompter = Prompter(self.root, self.settings, self.show_editor)

    def show_editor(self):
        self.prompter = None
        self.root.deiconify()
        self.root.lift()
        self.editor.text.focus_set()

    def quit(self):
        if self.prompter:
            self.prompter.close()
        self.settings["text"] = self.editor.text.get("1.0", "end-1c")
        save_settings(self.settings)
        self.root.destroy()

    def run(self):
        self.root.mainloop()


def self_test(report_path):
    """Checks the speech model and microphone load (used to verify packaged builds)."""
    result = {"voice_available": VOICE_AVAILABLE, "icon": ICON_FILE.exists()}
    try:
        vosk.SetLogLevel(-1)
        vosk.KaldiRecognizer(vosk.Model(str(MODEL_DIR)), 16000)
        result["model"] = "ok"
        result["mic"] = sd.query_devices(kind="input")["name"]
    except Exception as e:
        result["error"] = repr(e)
    Path(report_path).write_text(json.dumps(result), encoding="utf-8")


if __name__ == "__main__":
    if len(sys.argv) == 3 and sys.argv[1] == "--selftest":
        self_test(sys.argv[2])
    else:
        App().run()
