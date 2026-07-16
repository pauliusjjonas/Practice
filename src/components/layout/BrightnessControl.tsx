import { useEffect, useState } from "react";
import { SunMedium } from "lucide-react";

const STORAGE_KEY = "claude-course:brightness:v1";
const MIN = 60;
const MAX = 140;
const DEFAULT = 100;

function getInitialBrightness(): number {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? Number(stored) : NaN;
    if (!Number.isNaN(parsed) && parsed >= MIN && parsed <= MAX) return parsed;
  } catch {
    // localStorage unavailable — use default
  }
  return DEFAULT;
}

export function BrightnessControl() {
  const [brightness, setBrightness] = useState<number>(getInitialBrightness);

  useEffect(() => {
    document.documentElement.style.filter = brightness === DEFAULT ? "" : `brightness(${brightness}%)`;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(brightness));
    } catch {
      // brightness just won't persist across reloads
    }
  }, [brightness]);

  return (
    <label
      className="flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5"
      aria-label="Brightness"
      title="Brightness"
    >
      <SunMedium className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
      <input
        type="range"
        min={MIN}
        max={MAX}
        value={brightness}
        onChange={(e) => setBrightness(Number(e.target.value))}
        className="w-16 accent-[var(--color-accent)]"
      />
    </label>
  );
}
