type ValidationMessageProps = {
  id: string;
  children: string;
};

export function ValidationMessage({ id, children }: ValidationMessageProps) {
  return (
    <p id={id} role="alert" className="mt-4 text-sm font-medium text-[var(--danger)]">
      {children}
    </p>
  );
}
