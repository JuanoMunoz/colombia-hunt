"use client";

import { marked } from "marked";

/**
 * Renders a markdown string as styled HTML.
 * Uses `.markdown-preview` CSS class for styling.
 */
export default function MarkdownRenderer({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  const html = marked.parse(content, { async: false }) as string;
  return (
    <div
      className={`markdown-preview ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
