import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import useI18n from "../hooks/useI18n";

type AccordionHeadProps = {
  title: ComponentChildren;
  titleI18n: string;
  helpLabel?: string;
  summary?: ComponentChildren;
  children?: ComponentChildren;
};

export function AccordionHead({
  title,
  titleI18n,
  helpLabel,
  summary,
  children,
}: AccordionHeadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {t} = useI18n();

  return (
    <>
      <div
        class={isOpen ? "acc-head open" : "acc-head"}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span class="row-label" data-i18n={titleI18n}>
          {t(titleI18n)}
          {helpLabel ? (
            <button class="help-btn" aria-label={helpLabel}>
              ?
            </button>
          ) : null}
        </span>
        <div class="acc-summary">{summary}</div>
        <div class="acc-chevron">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      <div class="acc-body">
        <div class="acc-body-inner">{children}</div>
      </div>
    </>
  );
}
