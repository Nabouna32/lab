import type { ReactNode } from "react";
import { Panel } from "@/components/ui/Panel";

type CalculatorShellProps = {
  children: ReactNode;
  className?: string;
};

export function CalculatorShell({ children, className = "" }: CalculatorShellProps) {
  return <Panel as="section" className={className}>{children}</Panel>;
}
