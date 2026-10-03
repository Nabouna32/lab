type ToolExample = {
  title: string;
  description: string;
};

type ToolExamplesProps = {
  examples: ToolExample[];
};

export default function ToolExamples({
  examples,
}: ToolExamplesProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {examples.map((example) => (
        <div
          key={example.title}
          className="border-t border-[var(--border)] pt-4 first:border-t-0 sm:p-1 sm:first:border-t-0"
        >
          <h3 className="font-semibold text-[var(--foreground)]">
            {example.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {example.description}
          </p>
        </div>
      ))}
    </div>
  );
}
