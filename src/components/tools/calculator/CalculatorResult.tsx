import type { ReactNode } from "react";
import { ResultPanel } from "@/components/ui/ResultPanel";

type CalculatorResultProps = {
  label: string;
  value: ReactNode;
  emptyMessage?: string;
  tone?: "accent" | "neutral";
};

export function CalculatorResult(props: CalculatorResultProps) {
  return <ResultPanel {...props} />;
}
