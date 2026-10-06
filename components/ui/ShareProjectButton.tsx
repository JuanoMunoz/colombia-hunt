"use client";

import { useState } from "react";
import { ShareIcon } from "./icons";

type ShareProjectButtonProps = {
  href: string;
  title: string;
  accessibleLabel: string;
  label: string;
  copiedMessage: string;
  sharedMessage: string;
  errorMessage: string;
  className: string;
  showLabel?: boolean;
};

export default function ShareProjectButton({
  href,
  title,
  accessibleLabel,
  label,
  copiedMessage,
  sharedMessage,
  errorMessage,
  className,
  showLabel = false,
}: ShareProjectButtonProps) {
  const [feedback, setFeedback] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  async function handleShare() {
    setFeedback("");
    setIsSharing(true);

    try {
      const url = new URL(href, window.location.origin).toString();

      if (typeof navigator.share === "function") {
        try {
          await navigator.share({ title, url });
          setFeedback(sharedMessage);
          return;
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") return;
        }
      }

      if (typeof navigator.clipboard?.writeText !== "function") {
        setFeedback(errorMessage);
        return;
      }

      try {
        await navigator.clipboard.writeText(url);
        setFeedback(copiedMessage);
      } catch {
        setFeedback(errorMessage);
      }
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        aria-label={accessibleLabel}
        title={accessibleLabel}
        disabled={isSharing}
        className={className}
      >
        <ShareIcon className="h-4 w-4 shrink-0" />
        {showLabel ? <span>{label}</span> : null}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {feedback}
      </span>
    </>
  );
}
