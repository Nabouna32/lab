type LocularyLogoProps = {
  className?: string;
  wordmarkClassName?: string;
};

export default function LocularyLogo({
  className = "",
  wordmarkClassName = "text-lg font-bold tracking-[-0.03em]",
}: LocularyLogoProps) {
  return (
    <span className={"inline-flex items-center " + className}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        className="h-8 w-8 shrink-0 sm:h-9 sm:w-9"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M11 7.5v19.2c0 3.2 2.6 5.8 5.8 5.8h10.7"
          stroke="currentColor"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m27 4.5 2.2 6 6 2.2-6 2.2-2.2 6-2.2-6-6-2.2 6-2.2 2.2-6Z"
          fill="var(--accent)"
        />
      </svg>
      <span className={wordmarkClassName}>Loculary</span>
    </span>
  );
}
