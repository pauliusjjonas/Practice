"""Tests for the teleprompter.

Run from this folder with:
    python test_teleprompter.py

The speech test generates audio with Windows text-to-speech and runs it through
the real Vosk model, so it needs Windows and the speech model folder. The GUI
test briefly opens a prompter window in the corner of the screen - leave it
alone until it closes itself.
"""

import json
import subprocess
import sys
import tempfile
import tkinter as tk
import unittest
import wave
from importlib.machinery import SourceFileLoader
from pathlib import Path

HERE = Path(__file__).resolve().parent
tp = SourceFileLoader("teleprompter", str(HERE / "teleprompter.pyw")).load_module()
tp.save_settings = lambda settings: None   # never touch the real settings file

SCRIPT = """So, I first came across BAE through your defence work.

Honestly, it's hard not to, you're kind of everywhere in UK defence.

But when I found this role on Gradcracker and started reading up on Rochester, that's when it really clicked for me.

The Striker II helmet, the control sticks, the flight control computers...

these are things pilots are actually relying on, in the air, and they're being made right there on site.

That's pretty amazing to me.

And what I really like about this role is that it's manufacturing."""


def script_words(text=SCRIPT):
    return [w for _, _, w in tp.tokenize(text)]


def speak(tracker, words, step=2):
    """Feed words to the tracker the way the listener does: a growing tail of recent words."""
    for n in range(step, len(words) + 1, step):
        tracker.update(words[max(0, n - 8):n])


class TokenizeTests(unittest.TestCase):
    def test_lowercases_and_strips_punctuation(self):
        self.assertEqual(script_words("Hello, World! It's great."), ["hello", "world", "it's", "great"])

    def test_curly_apostrophes_become_straight(self):
        self.assertEqual(script_words("I’m here"), ["i'm", "here"])

    def test_hyphens_and_numbers_split(self):
        self.assertEqual(script_words("second-year, 88.5%"), ["second", "year", "88", "5"])

    def test_offsets_point_at_the_words(self):
        text = "  Big  engines "
        for start, end, word in tp.tokenize(text):
            self.assertEqual(text[start:end].lower(), word)


class LcsTests(unittest.TestCase):
    def test_basic(self):
        self.assertEqual(tp.lcs_len(["a", "b", "c"], ["a", "x", "c"]), 2)
        self.assertEqual(tp.lcs_len([], ["a"]), 0)
        self.assertEqual(tp.lcs_len(["a", "b"], ["b", "a"]), 1)


class TrackerTests(unittest.TestCase):
    def setUp(self):
        self.words = script_words()
        self.tracker = tp.Tracker(self.words)

    def test_follows_whole_script(self):
        speak(self.tracker, self.words)
        self.assertEqual(self.tracker.pos, len(self.words))

    def test_never_moves_backwards_while_reading(self):
        positions = []
        for n in range(1, len(self.words) + 1):
            self.tracker.update(self.words[max(0, n - 8):n])
            positions.append(self.tracker.pos)
        self.assertEqual(positions, sorted(positions))

    def test_catches_up_after_skipping_a_sentence(self):
        cut = self.words.index("but")           # skip "But when I found this role..."
        resume = self.words.index("striker")
        spoken = self.words[:cut] + self.words[resume:]
        speak(self.tracker, spoken)
        self.assertEqual(self.tracker.pos, len(self.words))

    def test_ignores_a_stray_common_word(self):
        speak(self.tracker, self.words[:10])
        before = self.tracker.pos
        self.tracker.update(["the"])            # e.g. an ad-libbed "the"
        self.assertEqual(self.tracker.pos, before)

    def test_ignores_off_script_chatter(self):
        speak(self.tracker, self.words[:10])
        before = self.tracker.pos
        self.tracker.update(["banana", "helicopter", "sandwich"])
        self.assertEqual(self.tracker.pos, before)

    def test_does_not_jump_too_far_ahead(self):
        long_words = script_words(" ".join(f"line {i} about tooling." for i in range(60)))
        tracker = tp.Tracker(long_words)
        tracker.update(long_words[150:158])     # a phrase from way down the script
        self.assertEqual(tracker.pos, 0)

    def test_empty_input(self):
        self.assertFalse(self.tracker.update([]))
        self.assertFalse(tp.Tracker([]).update(["hello"]))


@unittest.skipUnless(tp.VOICE_AVAILABLE and sys.platform == "win32", "needs Windows and the Vosk model")
class SpeechRecognitionTests(unittest.TestCase):
    """End to end: synthesised speech -> Vosk -> tracker."""

    def recognise(self, sentence):
        with tempfile.TemporaryDirectory() as tmp:
            wav = Path(tmp) / "speech.wav"
            ps = (
                "Add-Type -AssemblyName System.Speech;"
                "$s = New-Object System.Speech.Synthesis.SpeechSynthesizer;"
                "$f = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(16000,"
                "[System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen,"
                "[System.Speech.AudioFormat.AudioChannel]::Mono);"
                f"$s.SetOutputToWaveFile('{wav}', $f); $s.Speak('{sentence}'); $s.Dispose()"
            )
            subprocess.run(["powershell", "-NoProfile", "-Command", ps], check=True)

            words = script_words()
            tracker = tp.Tracker(words)
            tp.vosk.SetLogLevel(-1)
            model = tp.vosk.Model(str(tp.MODEL_DIR))
            rec = tp.vosk.KaldiRecognizer(model, 16000, json.dumps(sorted(set(words)) + ["[unk]"]))
            positions, committed = [], []
            with wave.open(str(wav), "rb") as wf:
                while data := wf.readframes(1600):
                    if rec.AcceptWaveform(data):
                        committed = (committed + json.loads(rec.Result())["text"].split())[-10:]
                        partial = []
                    else:
                        partial = json.loads(rec.PartialResult())["partial"].split()
                    tracker.update([w for w in committed + partial if w != "[unk]"][-8:])
                    positions.append(tracker.pos)
            committed = (committed + json.loads(rec.FinalResult())["text"].split())[-10:]
            tracker.update([w for w in committed if w != "[unk]"])
            positions.append(tracker.pos)
            return words, positions

    def test_follows_real_speech_including_a_skip(self):
        words, positions = self.recognise(
            "So, I first came across BAE through your defence work. "
            "Honestly, it is hard not to, you are kind of everywhere in UK defence. "
            "The Striker two helmet, the control sticks, the flight control computers. "
            "That is pretty amazing to me. "
            "And what I really like about this role is that it is manufacturing."
        )
        self.assertEqual(positions, sorted(positions), "tracker moved backwards")
        self.assertGreaterEqual(positions[-1], len(words) - 2, "didn't reach the end of the script")


class PrompterWindowTests(unittest.TestCase):
    """Opens a real prompter (voice mode off, so the mic isn't used) and checks the scrolling."""

    def setUp(self):
        self.app = tp.App()
        self.app.root.withdraw()
        sw, sh = self.app.root.winfo_screenwidth(), self.app.root.winfo_screenheight()
        self.app.settings.update(
            text=SCRIPT, voice_mode=False, hide_from_capture=False, opacity=1.0,
            font_size=20, speed=200, geometry=f"420x200+{sw - 460}+{sh - 300}",
        )
        self.p = tp.Prompter(self.app.root, self.app.settings, lambda: None)
        self.pump(0.3)

    def tearDown(self):
        self.p.close()
        self.app.root.destroy()

    def pump(self, seconds):
        end = tp.time.perf_counter() + seconds
        while tp.time.perf_counter() < end:
            self.app.root.update()

    def line_at_marker(self):
        g = int(self.p.guide_y)
        return self.p.text.get(f"@20,{g} linestart", f"@20,{g} lineend")

    def test_script_is_scrollable(self):
        self.assertGreater(self.p.max_offset, 0)

    def test_auto_mode_scrolls_and_pauses(self):
        self.p.toggle_play()
        self.pump(0.5)
        moved = self.p.offset
        self.assertGreater(moved, 50)
        self.p.toggle_play()
        self.pump(0.3)
        self.assertEqual(self.p.offset, moved)

    def test_voice_tracking_keeps_current_line_at_marker(self):
        self.p.voice = True
        words = [w for _, _, w in self.p.words]
        for stop in (30, 60, len(words) - 5):
            speak(self.p.tracker, words[:stop])
            self.p.mark_spoken()
            self.p.target = self.p.word_target()
            self.pump(1.2)
            current = self.p.words[self.p.tracker.pos - 1]
            self.assertIn(self.p.content[current[0]:current[1]], self.line_at_marker())

    def test_spoken_words_turn_grey(self):
        speak(self.p.tracker, [w for _, _, w in self.p.words][:12])
        self.p.mark_spoken()
        greyed = self.p.text.get(*self.p.text.tag_ranges("done")[:2])
        self.assertTrue(greyed.startswith("So, I first came across BAE"))

    def test_home_resets(self):
        self.p.toggle_play()
        self.pump(0.3)
        self.p.reset()
        self.assertEqual((self.p.offset, self.p.tracker.pos, self.p.playing), (0, 0, False))

    def test_font_size_limits(self):
        for _ in range(40):
            self.p.change_font(2)
        self.assertEqual(self.app.settings["font_size"], 72)
        for _ in range(40):
            self.p.change_font(-2)
        self.assertEqual(self.app.settings["font_size"], 10)


if __name__ == "__main__":
    unittest.main(verbosity=2)
