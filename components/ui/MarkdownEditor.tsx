"use client";

import {
  useState,
  useRef,
  useCallback,
  type TextareaHTMLAttributes,
} from "react";
import { marked } from "marked";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "write" | "preview";

type ToolbarAction = {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: (value: string, selStart: number, selEnd: number) => ActionResult;
};

type ActionResult = {
  value: string;
  selStart: number;
  selEnd: number;
};

// ─── Markdown renderer ────────────────────────────────────────────────────────

function renderMarkdown(raw: string): string {
  return marked.parse(raw, { async: false }) as string;
}

// ─── Toolbar SVG icons ────────────────────────────────────────────────────────

function IconBold() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
    </svg>
  );
}
function IconItalic() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
    </svg>
  );
}
function IconHeading() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M5 4v3h5.5v12h3V7H19V4z" />
    </svg>
  );
}
function IconLink() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
function IconCode() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
function IconCodeBlock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <polyline points="8 9 4 12 8 15" />
      <polyline points="16 9 20 12 16 15" />
      <line x1="11" y1="6" x2="13" y2="18" />
    </svg>
  );
}
function IconQuote() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    </svg>
  );
}
function IconListBullet() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
    </svg>
  );
}
function IconListOrdered() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-8v2h14V3H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" />
    </svg>
  );
}
function IconHR() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M19 13H5v-2h14v2z" />
    </svg>
  );
}

// ─── Text manipulation helpers ────────────────────────────────────────────────

function wrapSelection(
  value: string,
  start: number,
  end: number,
  prefix: string,
  suffix: string,
  placeholder: string,
): ActionResult {
  const selected = value.slice(start, end) || placeholder;
  const before = value.slice(0, start);
  const after = value.slice(end);
  const newValue = `${before}${prefix}${selected}${suffix}${after}`;
  return {
    value: newValue,
    selStart: start + prefix.length,
    selEnd: start + prefix.length + selected.length,
  };
}

function prependLine(
  value: string,
  start: number,
  end: number,
  prefix: string,
  placeholder: string,
): ActionResult {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const lineEnd = value.indexOf("\n", end);
  const actualEnd = lineEnd === -1 ? value.length : lineEnd;
  const line = value.slice(lineStart, actualEnd) || placeholder;
  const before = value.slice(0, lineStart);
  const after = value.slice(actualEnd);
  const newLine = line.startsWith(prefix) ? line.slice(prefix.length) : `${prefix}${line}`;
  return {
    value: `${before}${newLine}${after}`,
    selStart: lineStart + (line.startsWith(prefix) ? 0 : prefix.length),
    selEnd: lineStart + newLine.length,
  };
}

// ─── Build toolbar actions per language ───────────────────────────────────────

function buildActions(lang: "es" | "en"): ToolbarAction[] {
  const isEs = lang === "es";
  return [
    {
      id: "bold",
      label: isEs ? "Negrita" : "Bold",
      icon: <IconBold />,
      action: (v, s, e) =>
        wrapSelection(v, s, e, "**", "**", isEs ? "negrita" : "bold"),
    },
    {
      id: "italic",
      label: isEs ? "Cursiva" : "Italic",
      icon: <IconItalic />,
      action: (v, s, e) =>
        wrapSelection(v, s, e, "_", "_", isEs ? "cursiva" : "italic"),
    },
    {
      id: "heading",
      label: isEs ? "Encabezado" : "Heading",
      icon: <IconHeading />,
      action: (v, s, e) =>
        prependLine(v, s, e, "## ", isEs ? "Título" : "Heading"),
    },
    {
      id: "link",
      label: isEs ? "Enlace" : "Link",
      icon: <IconLink />,
      action: (v, s, e) => {
        const text = v.slice(s, e) || (isEs ? "texto del enlace" : "link text");
        const inserted = `[${text}](url)`;
        return {
          value: `${v.slice(0, s)}${inserted}${v.slice(e)}`,
          selStart: s + text.length + 3,
          selEnd: s + text.length + 6,
        };
      },
    },
    {
      id: "code",
      label: isEs ? "Código inline" : "Inline code",
      icon: <IconCode />,
      action: (v, s, e) => wrapSelection(v, s, e, "`", "`", "code"),
    },
    {
      id: "codeBlock",
      label: isEs ? "Bloque de código" : "Code block",
      icon: <IconCodeBlock />,
      action: (v, s, e) => {
        const sel = v.slice(s, e) || (isEs ? "tu código aquí" : "your code here");
        const block = `\`\`\`\n${sel}\n\`\`\``;
        return {
          value: `${v.slice(0, s)}${block}${v.slice(e)}`,
          selStart: s + 4,
          selEnd: s + 4 + sel.length,
        };
      },
    },
    {
      id: "quote",
      label: isEs ? "Cita" : "Quote",
      icon: <IconQuote />,
      action: (v, s, e) =>
        prependLine(v, s, e, "> ", isEs ? "cita" : "quote"),
    },
    {
      id: "ul",
      label: isEs ? "Lista sin orden" : "Bullet list",
      icon: <IconListBullet />,
      action: (v, s, e) =>
        prependLine(v, s, e, "- ", isEs ? "elemento" : "item"),
    },
    {
      id: "ol",
      label: isEs ? "Lista numerada" : "Ordered list",
      icon: <IconListOrdered />,
      action: (v, s, e) =>
        prependLine(v, s, e, "1. ", isEs ? "elemento" : "item"),
    },
    {
      id: "hr",
      label: isEs ? "Separador" : "Horizontal rule",
      icon: <IconHR />,
      action: (v, s) => {
        const hr = "\n\n---\n\n";
        return {
          value: `${v.slice(0, s)}${hr}${v.slice(s)}`,
          selStart: s + hr.length,
          selEnd: s + hr.length,
        };
      },
    },
  ];
}

// Indexes after which to show a toolbar divider
const DIVIDER_AFTER = new Set([2, 4, 6]);

// ─── Component ────────────────────────────────────────────────────────────────

type MarkdownEditorProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange"
> & {
  value: string;
  onChange: (value: string) => void;
  lang?: "es" | "en";
  label?: string;
  hint?: string;
};

export default function MarkdownEditor({
  id,
  name,
  value,
  onChange,
  lang = "es",
  label,
  hint,
  required,
  maxLength,
  ...rest
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<Tab>("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const actions = buildActions(lang);
  const isEs = lang === "es";

  const applyAction = useCallback(
    (action: ToolbarAction["action"]) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const { selectionStart: s, selectionEnd: e } = ta;
      const result = action(value, s, e);
      onChange(result.value);
      requestAnimationFrame(() => {
        ta.setSelectionRange(result.selStart, result.selEnd);
        ta.focus();
      });
    },
    [value, onChange],
  );

  const previewHtml = tab === "preview" ? renderMarkdown(value) : "";

  const charLabel = `${value.length}${maxLength ? `/${maxLength}` : ""} ${isEs ? "caracteres" : "chars"}`;

  const placeholder = isEs
    ? "Escribe la descripción... "
    : "Write the description... ";

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-(--foreground)">
          {label}
          {required && (
            <span className="ml-0.5 text-(--secondary)" aria-hidden="true">*</span>
          )}
        </label>
      )}
      {hint && (
        <p className="text-xs leading-5 text-(--foreground)/65">{hint}</p>
      )}

      {/* Editor card */}
      <div className="overflow-hidden rounded-lg border border-(--brand)/25 transition-colors focus-within:border-(--brand) focus-within:ring-2 focus-within:ring-(--brand)/20">

        {/* Tab bar + toolbar row */}
        <div className="flex flex-wrap items-center gap-2 border-b border-(--brand)/15 bg-(--brand)/5 px-2 py-1.5">

          {/* Tabs */}
          <div className="flex gap-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setTab("write")}
              aria-pressed={tab === "write"}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${tab === "write"
                ? "bg-(--brand) text-(--background)"
                : "text-(--foreground)/60 hover:text-(--foreground)"
                }`}
            >
              {isEs ? "Editor" : "Editor"}
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              aria-pressed={tab === "preview"}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${tab === "preview"
                ? "bg-(--brand) text-(--background)"
                : "text-(--foreground)/60 hover:text-(--foreground)"
                }`}
            >
              {isEs ? "Vista previa" : "Preview"}
            </button>
          </div>

          {/* Divider between tabs and toolbar */}
          <span className="h-4 w-px bg-(--brand)/20 shrink-0" aria-hidden="true" />

          {/* Toolbar (only in write mode) */}
          {tab === "write" && (
            <div
              className="flex flex-wrap items-center gap-0.5"
              role="toolbar"
              aria-label={isEs ? "Herramientas de formato Markdown" : "Markdown formatting tools"}
            >
              {actions.map((action, i) => (
                <span key={action.id} className="contents">
                  {DIVIDER_AFTER.has(i - 1) && (
                    <span className="mx-0.5 h-4 w-px bg-(--brand)/20" aria-hidden="true" />
                  )}
                  <button
                    type="button"
                    title={action.label}
                    aria-label={action.label}
                    onClick={() => applyAction(action.action)}
                    className="flex h-7 w-7 items-center justify-center rounded text-(--foreground)/55 transition-colors hover:bg-(--brand)/10 hover:text-(--brand) focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--brand)"
                  >
                    {action.icon}
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Write pane */}
        {tab === "write" && (
          <textarea
            ref={textareaRef}
            id={id}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            maxLength={maxLength}
            rows={12}
            placeholder={placeholder}
            spellCheck={false}
            className="w-full resize-y bg-(--background) px-4 py-3 font-mono text-sm leading-6 text-(--foreground) placeholder:text-(--foreground)/35 focus:outline-none"
            {...rest}
          />
        )}

        {/* Preview pane */}
        {tab === "preview" && (
          <div
            className="min-h-48 w-full px-4 py-3"
            aria-live="polite"
            aria-label={isEs ? "Vista previa de Markdown" : "Markdown preview"}
          >
            {value.trim() ? (
              <div
                className="markdown-preview"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <p className="text-sm italic text-(--foreground)/40">
                {isEs ? "Sin contenido aún…" : "Nothing to preview yet…"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Character count */}
      <p className="text-right text-xs text-(--foreground)/45" aria-live="polite" aria-atomic="true">
        {charLabel}
      </p>

      {/* Hidden input ensures form submission always includes value regardless of active tab */}
      {name && tab === "preview" && (
        <input type="hidden" name={name} value={value} />
      )}
    </div>
  );
}
