"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { TextArea } from "@/components/ui/TextArea";
import { compareJsonDocuments, JsonDiffError, type JsonDiffChange, type JsonDiffResult } from "@/lib/json-diff";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { useLocale } from "@/lib/i18n/use-locale";
import { consumePendingJsonComparison } from "@/lib/tools/json-transfer";

function formatValue(value: unknown): string {
  return JSON.stringify(value, null, 2) ?? "undefined";
}

function createReport(result: JsonDiffResult, t: DiffMessages): string {
  return result.changes.map((change) => {
    const kind = change.kind === "added" ? t.added : change.kind === "removed" ? t.removed : t.changed;
    const before = change.before === undefined ? "" : "\n  " + t.before + ": " + JSON.stringify(change.before);
    const after = change.after === undefined ? "" : "\n  " + t.after + ": " + JSON.stringify(change.after);
    return "[" + kind + "] " + change.path + before + after;
  }).join("\n");
}

function ChangeValue({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="min-w-0 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-3">
      <p className="mb-2 text-xs font-semibold text-[var(--muted)]">{label}</p>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs leading-5 text-[var(--foreground)]">
        {formatValue(value)}
      </pre>
    </div>
  );
}

type DiffMessages = ReturnType<typeof getToolMessages>["jsonDiffChecker"];

function ChangeCard({ change, t }: { change: JsonDiffChange; t: DiffMessages }) {
  const label = change.kind === "added" ? t.added : change.kind === "removed" ? t.removed : t.changed;
  const tone = change.kind === "added"
    ? "border-l-[var(--success)]"
    : change.kind === "removed"
      ? "border-l-[var(--danger)]"
      : "border-l-[var(--primary)]";

  return (
    <article className={"rounded-[var(--radius-md)] border border-[var(--border)] border-l-4 " + tone + " bg-[var(--surface-container-low)] p-4"}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="break-all font-mono text-xs text-[var(--muted)]">{change.path}</p>
        <span className="rounded-full bg-[var(--surface-container)] px-2 py-1 text-xs font-semibold text-[var(--foreground)]">{label}</span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {change.kind !== "added" && <ChangeValue label={t.before} value={change.before} />}
        {change.kind !== "removed" && <ChangeValue label={t.after} value={change.after} />}
      </div>
    </article>
  );
}

export default function JsonDiffChecker() {
  const locale = useLocale();
  const t = getToolMessages(locale).jsonDiffChecker;
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [result, setResult] = useState<JsonDiffResult | null>(null);
  const [error, setError] = useState<"invalid-json" | "input-too-large" | "depth-limit" | "file-type" | "file-too-large" | "file-read" | null>(null);
  const [transferNotice, setTransferNotice] = useState(false);

  useEffect(() => {
    try {
      const transferred = consumePendingJsonComparison(window.sessionStorage);
      if (transferred) {
        Promise.resolve().then(() => {
          setRight(transferred);
          setTransferNotice(true);
        });
      }
    } catch {
      // A blocked session store should never prevent manual comparison.
    }
  }, []);

  async function loadFile(event: ChangeEvent<HTMLInputElement>, side: "left" | "right") {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    input.value = "";
    if (!file.name.toLowerCase().endsWith(".json")) {
      setError("file-type");
      setResult(null);
      return;
    }
    if (file.size > 800_000) {
      setError("file-too-large");
      setResult(null);
      return;
    }
    try {
      const content = await file.text();
      if (content.length > 200_000) {
        setError("file-too-large");
        setResult(null);
        return;
      }
      if (side === "left") setLeft(content);
      else setRight(content);
      setError(null);
      setResult(null);
    } catch {
      setError("file-read");
      setResult(null);
    }
  }

  function compare() {
    setResult(null);
    if (!left.trim() || !right.trim()) {
      setError("invalid-json");
      return;
    }
    try {
      setResult(compareJsonDocuments(left, right));
      setError(null);
    } catch (caught) {
      setError(caught instanceof JsonDiffError ? caught.code : "invalid-json");
    }
  }

  function clear() {
    setLeft("");
    setRight("");
    setResult(null);
    setError(null);
  }

  const status = error
    ? error === "input-too-large" ? t.inputTooLarge
      : error === "depth-limit" ? t.depthLimit
        : error === "file-type" ? t.fileTypeError
          : error === "file-too-large" ? t.fileTooLarge
            : error === "file-read" ? t.fileReadError
              : t.invalidJson
    : result
      ? result.identical ? t.identical : t.changesCount(result.changes.length)
      : t.emptyResult;
  const report = result ? createReport(result, t) : "";

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="p-5 sm:p-7 lg:border-r lg:border-[var(--border)] lg:p-8">
          <div className="grid gap-5">
            <TextArea
              label={t.leftInput}
              inputId="json-diff-left"
              value={left}
              onChange={(event) => { setLeft(event.target.value); setError(null); setResult(null); }}
              placeholder={t.leftPlaceholder}
              spellCheck={false}
              className="min-h-[14rem] resize-y font-mono text-sm leading-6"
              aria-invalid={error === "invalid-json"}
            />
            <TextArea
              label={t.rightInput}
              inputId="json-diff-right"
              value={right}
              onChange={(event) => { setRight(event.target.value); setError(null); setResult(null); }}
              placeholder={t.rightPlaceholder}
              spellCheck={false}
              className="min-h-[14rem] resize-y font-mono text-sm leading-6"
              aria-invalid={error === "invalid-json"}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <label className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-[var(--outline-variant)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] outline-none transition-colors hover:bg-[var(--surface-container)] focus-within:ring-2 focus-within:ring-[var(--focus-ring)]">
              {t.loadFile}: {t.leftInput}
              <input type="file" accept=".json,application/json" className="sr-only" aria-label={`${t.loadFile}: ${t.leftInput}`} onChange={(event) => void loadFile(event, "left")} />
            </label>
            <label className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-[var(--outline-variant)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] outline-none transition-colors hover:bg-[var(--surface-container)] focus-within:ring-2 focus-within:ring-[var(--focus-ring)]">
              {t.loadFile}: {t.rightInput}
              <input type="file" accept=".json,application/json" className="sr-only" aria-label={`${t.loadFile}: ${t.rightInput}`} onChange={(event) => void loadFile(event, "right")} />
            </label>
          </div>
          <p className="mt-3 text-sm text-[var(--muted)]">{t.hint}</p>
          {transferNotice && <p className="mt-3 text-sm font-medium text-[var(--primary)]" role="status">{t.receivedFromFormatter}</p>}
          {error && <p role="alert" className="mt-3 text-sm font-medium text-[var(--danger)]">{status}</p>}
          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={compare}>{t.compare}</Button>
            <ClearButton onClear={clear} disabled={!left && !right} label={t.clear} />
          </div>
        </div>

        <div className="min-w-0 bg-[var(--background)] p-5 sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-[var(--foreground)]">{t.results}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">{status}</p>
            </div>
            {result && !result.identical && <CopyButton value={report} label={t.copyReport} />}
          </div>
          {result?.identical && (
            <p className="mt-5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--foreground)]" role="status">
              {t.identical}
            </p>
          )}
          {result && !result.identical && (
            <div className="mt-5 grid gap-3">
              {result.changes.map((change) => <ChangeCard key={change.path + ":" + change.kind} change={change} t={t} />)}
              {result.truncated && <p className="text-sm text-[var(--muted)]" role="status">{t.truncated}</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
