"use client";

import { useState } from "react";

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
  className?: string;
};

export default function FaqAccordion({ items, className = "" }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={`flex flex-col divide-y divide-(--brand)/10 ${className}`} role="list">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const headingId = `faq-heading-${i}`;
        const panelId = `faq-panel-${i}`;

        return (
          <div key={i} role="listitem" className="py-4">
            <button
              id={headingId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-start justify-between gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand) rounded-sm"
            >
              <span className="text-base font-semibold leading-7 text-(--brand)">
                {item.question}
              </span>
              <span
                aria-hidden="true"
                className="mt-1 shrink-0 text-(--brand)/60 transition-transform duration-200"
                style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headingId}
              hidden={!isOpen}
              className="mt-3 pr-8"
            >
              <p className="text-base leading-7 text-(--foreground)/80">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
