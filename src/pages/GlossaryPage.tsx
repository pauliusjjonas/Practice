import { GLOSSARY } from "../content/glossary";

export function GlossaryPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-2 text-2xl font-semibold text-[var(--color-text)]">Glossary</h1>
      <p className="mb-8 text-sm text-[var(--color-text-muted)]">
        Every term used across the lessons, defined in plain language. Come back here any time
        something reads like jargon.
      </p>
      <dl className="space-y-6">
        {GLOSSARY.map((entry) => (
          <div key={entry.term} className="border-b border-[var(--color-border)] pb-4">
            <dt className="mb-1 font-mono text-sm font-semibold text-[var(--color-accent)]">
              {entry.term}
            </dt>
            <dd className="m-0 text-sm leading-relaxed text-[var(--color-text)]">
              {entry.definition}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
