type StarIconProps = {
  filled?: boolean;
  className?: string;
};

export function StarIcon({ filled = false, className = "h-5 w-5" }: StarIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 3.75 2.55 5.17 5.7.83-4.12 4.02.97 5.68L12 16.77l-5.1 2.68.97-5.68-4.12-4.02 5.7-.83L12 3.75Z" />
    </svg>
  );
}
