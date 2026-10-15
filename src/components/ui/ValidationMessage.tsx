type ValidationMessageProps = {
  id: string;
  children: string;
  role?: "alert" | "status" | null;
};

export function ValidationMessage({ id, children, role = "alert" }: ValidationMessageProps) {
  return (
    <p id={id} {...(role ? { role } : {})} className="mt-4 text-sm font-medium text-[var(--danger)]">
      {children}
    </p>
  );
}
