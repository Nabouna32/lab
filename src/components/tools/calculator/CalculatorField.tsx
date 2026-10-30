import type { InputHTMLAttributes } from "react";
import { TextField } from "@/components/ui/TextField";

type CalculatorFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  inputId: string;
  unit?: string;
};

export function CalculatorField(props: CalculatorFieldProps) {
  return <TextField {...props} type={props.type ?? "number"} />;
}
