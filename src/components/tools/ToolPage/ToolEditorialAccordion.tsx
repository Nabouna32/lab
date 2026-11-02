import type { ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

type ToolEditorialAccordionProps = {
  title: string;
  children: ReactNode;
};

/**
 * Loculary Web disclosure composed from the pinned Material 3 ListItem
 * visual contract and native HTML details/summary semantics.
 * AndroidX Material 3 does not expose an Accordion component.
 */
export default function ToolEditorialAccordion({
  title,
  children,
}: ToolEditorialAccordionProps) {
  return (
    <details className="border-y border-[var(--outline-variant)] bg-[var(--surface)]">
      <summary className="flex min-h-[var(--m3-size-list-item-one-line-min-height)] cursor-pointer list-none items-center justify-between gap-4 px-[var(--m3-space-4)] py-[var(--m3-space-2)] text-[var(--on-surface)] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1 break-words m3-type-body-large">{title}</span>
        <MaterialIcon
          name="keyboard_arrow_down"
          size={24}
          className="shrink-0 text-[var(--on-surface-variant)]"
        />
      </summary>
      <div className="border-t border-[var(--outline-variant)] px-[var(--m3-space-4)] py-[var(--m3-space-4)] m3-type-body-medium text-[var(--on-surface-variant)]">
        {children}
      </div>
    </details>
  );
}
