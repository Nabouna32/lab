type ValidationMessageProps = {
  id: string;
  children: string;
  role?: "alert" | "status" | null;
};

export function ValidationMessage({ id, children, role = "alert" }: ValidationMessageProps) {
  return (
    <p id={id} {...(role ? { role } : {})} className="m3-type-body-medium mt-4 text-[var(--danger)]">
      {children}
    </p>
  );
}
