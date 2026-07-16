import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html as htmlLang } from "@codemirror/lang-html";
import { css as cssLang } from "@codemirror/lang-css";
import { javascript as jsLang } from "@codemirror/lang-javascript";
import { buildSrcDoc } from "./buildSrcDoc";
import { PRESETS } from "./presets";

type Tab = "html" | "css" | "js";

const TAB_EXTENSIONS = {
  html: [htmlLang()],
  css: [cssLang()],
  js: [jsLang()],
};

interface PlaygroundProps {
  preset: keyof typeof PRESETS;
  height?: string;
}

export function Playground({ preset, height = "220px" }: PlaygroundProps) {
  const initial = PRESETS[preset];
  const [tab, setTab] = useState<Tab>("css");
  const [html, setHtml] = useState(initial.html);
  const [css, setCss] = useState(initial.css);
  const [js, setJs] = useState(initial.js);
  const [srcDoc, setSrcDoc] = useState(() => buildSrcDoc(initial.html, initial.css, initial.js));

  useEffect(() => {
    const timeout = setTimeout(() => setSrcDoc(buildSrcDoc(html, css, js)), 300);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  const code = tab === "html" ? html : tab === "css" ? css : js;
  const setCode = tab === "html" ? setHtml : tab === "css" ? setCss : setJs;

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-[var(--color-border)]">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-b border-[var(--color-border)] md:border-b-0 md:border-r">
          <div className="flex border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            {(["html", "css", "js"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wide ${
                  tab === t
                    ? "border-b-2 border-[var(--color-accent)] text-[var(--color-accent)]"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <CodeMirror
            value={code}
            height={height}
            theme="dark"
            extensions={TAB_EXTENSIONS[tab]}
            onChange={setCode}
          />
        </div>
        <div className="bg-white">
          <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-4 py-2 text-xs font-mono uppercase tracking-wide text-[var(--color-text-muted)]">
            Preview
          </div>
          <iframe
            title="Playground preview"
            srcDoc={srcDoc}
            sandbox="allow-scripts"
            style={{ height, width: "100%", border: "none", display: "block" }}
          />
        </div>
      </div>
    </div>
  );
}
