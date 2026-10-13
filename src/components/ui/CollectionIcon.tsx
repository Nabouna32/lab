type CollectionIconProps = {
  className?: string;
};

export function CollectionIcon({ className = "h-5 w-5" }: CollectionIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="6" width="14.5" height="14" rx="2" />
      <path d="M7.5 3.5H18a2 2 0 0 1 2 2V17" />
      <path d="M7.5 10h7.5M7.5 13.5h5.5" />
    </svg>
  );
}
