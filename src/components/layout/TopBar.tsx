import { Menu } from "lucide-react";

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="flex items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 md:hidden">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="rounded-md p-1.5 hover:bg-black/5"
      >
        <Menu className="h-5 w-5" />
      </button>
      <span className="font-semibold text-[var(--color-text)]">Claude Code Learning Platform</span>
    </header>
  );
}
