"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { Select } from "@/components/ui/Select";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { hashFile, hashText, verifyDigest, MAX_HASH_FILE_BYTES, type DigestVerification, type HashAlgorithm } from "@/lib/hash-generator";

type InputMode = "text" | "file";
type HashError = "invalid" | "size" | null;

export default function HashGenerator() {
  const locale = useLocale();
  const t = getToolMessages(locale).hashGenerator;
  const [mode, setMode] = useState<InputMode>("text");
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [expectedDigest, setExpectedDigest] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [result, setResult] = useState("");
  const [error, setError] = useState<HashError>(null);
  const [verification, setVerification] = useState<DigestVerification | null>(null);
  const [busy, setBusy] = useState(false);
  const requestRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const expectedDigestRef = useRef("");

  useEffect(() => () => { requestRef.current += 1; }, []);

  function resetResult() {
    requestRef.current += 1;
    setResult("");
    setError(null);
    setVerification(null);
    setBusy(false);
  }

  function changeMode(nextMode: InputMode) {
    if (nextMode === mode) return;
    resetResult();
    setMode(nextMode);
  }

  function chooseFile(nextFile: File | null) {
    resetResult();
    if (nextFile && nextFile.size > MAX_HASH_FILE_BYTES) {
      setFile(null);
      setError("size");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFile(nextFile);
  }

  async function generate() {
    const requestId = ++requestRef.current;
    const value = input;
    const selectedFile = file;
    const selectedMode = mode;
    const selectedAlgorithm = algorithm;
    setBusy(true);
    setError(null);
    setVerification(null);
    try {
      const nextResult = selectedMode === "file"
        ? selectedFile ? await hashFile(selectedFile, selectedAlgorithm) : ""
        : await hashText(value, selectedAlgorithm);
      if (requestId !== requestRef.current) return;
      if (!nextResult) {
        setError("invalid");
        setResult("");
        return;
      }
      setResult(nextResult);
      if (selectedMode === "file" && expectedDigestRef.current.trim()) {
        setVerification(verifyDigest(nextResult, expectedDigestRef.current, selectedAlgorithm));
      }
    } catch (caught) {
      if (requestId !== requestRef.current) return;
      setResult("");
      setError(caught instanceof RangeError ? "size" : "invalid");
    } finally {
      if (requestId === requestRef.current) setBusy(false);
    }
  }

  function updateExpectedDigest(value: string) {
    expectedDigestRef.current = value;
    setExpectedDigest(value);
    setVerification(result && mode === "file" && value.trim()
      ? verifyDigest(result, value, algorithm)
      : null);
  }

  function clear() {
    requestRef.current += 1;
    setInput("");
    setFile(null);
    setExpectedDigest("");
    expectedDigestRef.current = "";
    setResult("");
    setError(null);
    setVerification(null);
    setBusy(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const canGenerate = mode === "text" ? input.length > 0 : Boolean(file);

  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label={t.inputMode}>
        <button type="button" aria-pressed={mode === "text"} onClick={() => changeMode("text")} className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${mode === "text" ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--on-primary)]" : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-soft)]"}`}>{t.textMode}</button>
        <button type="button" aria-pressed={mode === "file"} onClick={() => changeMode("file")} className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] ${mode === "file" ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--on-primary)]" : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-soft)]"}`}>{t.fileMode}</button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          {mode === "text" ? (
            <>
              <label htmlFor="hash-input" className="block text-sm font-medium text-[var(--foreground)]">{t.input}</label>
              <textarea
                id="hash-input"
                value={input}
                onChange={(event) => { setInput(event.target.value); resetResult(); }}
                placeholder={t.placeholder}
                rows={8}
                className="mt-2 min-h-48 w-full resize-y rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-sm text-[var(--foreground)] outline-none transition-[border-color,box-shadow] duration-[var(--motion-standard)] placeholder:text-[var(--muted)] hover:border-[var(--border-strong)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                aria-invalid={error !== null}
              />
            </>
          ) : (
            <div>
              <label htmlFor="hash-file" className="block text-sm font-medium text-[var(--foreground)]">{t.fileInput}</label>
              <input
                ref={fileInputRef}
                id="hash-file"
                type="file"
                onChange={(event) => chooseFile(event.target.files?.[0] ?? null)}
                aria-describedby="hash-file-hint"
                className="mt-2 block min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-2 text-sm text-[var(--foreground)] file:mr-3 file:min-h-8 file:rounded-full file:border-0 file:bg-[var(--surface-soft)] file:px-3 file:font-semibold file:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              />
              <p id="hash-file-hint" className="mt-2 text-xs leading-5 text-[var(--muted)]">{t.fileHint}</p>
              {file && <p className="mt-3 break-words rounded-[var(--radius-md)] bg-[var(--surface-soft)] p-3 text-sm text-[var(--foreground)]">{file.name} · {(file.size / (1024 * 1024)).toLocaleString(locale, { maximumFractionDigits: 2 })} MiB</p>}
              <label htmlFor="hash-expected" className="mt-5 block text-sm font-medium text-[var(--foreground)]">{t.expectedDigest}</label>
              <input
                id="hash-expected"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={expectedDigest}
                onChange={(event) => updateExpectedDigest(event.target.value)}
                placeholder={t.expectedPlaceholder}
                className="mt-2 min-h-11 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-mono text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              />
              <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{t.expectedHint}</p>
            </div>
          )}
        </div>
        <div>
          <Select label={t.algorithm} id="hash-algorithm" value={algorithm} onChange={(event) => { setAlgorithm(event.target.value as HashAlgorithm); resetResult(); }} aria-invalid={error !== null}>
            <option value="SHA-1">SHA-1</option>
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-384">SHA-384</option>
            <option value="SHA-512">SHA-512</option>
          </Select>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="button" onClick={generate} disabled={busy || !canGenerate}>{busy ? t.generating : mode === "file" ? t.hashFile : t.generate}</Button>
            <ClearButton onClear={clear} disabled={!input && !file && !result && !expectedDigest} label={t.clear} />
          </div>
        </div>
      </div>

      {error && <p role="alert" className="mt-5 text-sm font-medium text-[var(--danger)]">{error === "size" ? t.fileTooLarge : t.invalid}</p>}

      <div className="mt-6 border-t border-[var(--border)] pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--muted)]">{t.result}</p>
            <p className="mt-1 text-sm text-[var(--muted)]" aria-live="polite">{result ? t.complete : t.emptyResult}</p>
          </div>
          {result && <CopyButton value={result} label={t.copy} />}
        </div>
        <output aria-live="polite" className="mt-4 block min-h-24 break-all rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-soft)] p-4 font-mono text-sm leading-7 text-[var(--foreground)]">
          {result || " "}
        </output>
        {verification && (
          <p role="status" className={`mt-3 rounded-[var(--radius-md)] border p-3 text-sm font-semibold ${verification === "match" ? "border-[var(--success)]/40 bg-[var(--success-soft)] text-[var(--success)]" : verification === "mismatch" ? "border-[var(--danger)]/40 bg-[var(--danger-soft)] text-[var(--danger)]" : "border-[var(--border)] bg-[var(--surface-soft)] text-[var(--muted)]"}`}>
            {verification === "match" ? t.digestMatch : verification === "mismatch" ? t.digestMismatch : t.digestInvalid}
          </p>
        )}
      </div>
    </section>
  );
}
