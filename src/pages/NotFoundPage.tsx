import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-20 text-center">
      <h1 className="mb-2 text-xl font-semibold text-[var(--color-text)]">Page not found</h1>
      <p className="mb-6 text-sm text-[var(--color-text-muted)]">
        That lesson or page doesn't exist.
      </p>
      <Link to="/" className="text-sm font-medium text-[var(--color-accent)]">
        Back to home
      </Link>
    </div>
  );
}
