"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ClearButton } from "@/components/ui/ClearButton";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";
import { useLocale } from "@/lib/i18n/use-locale";
import { getToolMessages } from "@/lib/i18n/tool-messages";
import { generateQrCode } from "@/lib/qr-code";

const DEFAULT_VALUE = "https://example.com";

function escapeWifiValue(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

export default function QrCodeGenerator() {
  const locale = useLocale();
  const t = getToolMessages(locale).qrCodeGenerator;
  const isFrench = locale === "fr";
  const [mode, setMode] = useState("text");
  const [value, setValue] = useState(DEFAULT_VALUE);
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [security, setSecurity] = useState("WPA");
  const [hidden, setHidden] = useState(false);
  const [size, setSize] = useState("256");
  const svgRef = useRef<SVGSVGElement>(null);

  const encodedValue = mode === "wifi"
    ? ssid
      ? `WIFI:T:${security};S:${escapeWifiValue(ssid)};P:${security === "nopass" ? "" : escapeWifiValue(password)};H:${hidden ? "true" : "false"};;`
      : ""
    : value;

  const result = useMemo(() => {
    if (!encodedValue) return null;
    try { return { qr: generateQrCode(encodedValue), error: null }; }
    catch { return { qr: null, error: t.tooLong }; }
  }, [encodedValue, t.tooLong]);

  function download() {
    if (!svgRef.current || !result?.qr) return;
    const source = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = mode === "wifi" ? "loculary-wifi-qr-code.svg" : "loculary-qr-code.svg";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function clear() {
    if (mode === "wifi") {
      setSsid("");
      setPassword("");
      setHidden(false);
    } else {
      setValue("");
    }
  }

  return (
    <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)] lg:p-8">
        <div className="space-y-5">
          <Select
            id="qr-code-mode"
            label={isFrench ? "Type de QR Code" : "QR Code type"}
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            className="w-full"
          >
            <option value="text">{isFrench ? "Texte ou lien" : "Text or link"}</option>
            <option value="wifi">{isFrench ? "Connexion Wi-Fi" : "Wi-Fi connection"}</option>
          </Select>

          {mode === "wifi" ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="qr-wifi-ssid" className="block text-sm font-medium">{isFrench ? "Nom du réseau (SSID)" : "Network name (SSID)"}</label>
                <input id="qr-wifi-ssid" value={ssid} onChange={(event) => setSsid(event.target.value)} autoComplete="off" className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--on-surface)]" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="qr-wifi-security" className="block text-sm font-medium">{isFrench ? "Sécurité du réseau" : "Network security"}</label>
                <Select id="qr-wifi-security" label={isFrench ? "Sécurité du réseau" : "Network security"} value={security} onChange={(event) => setSecurity(event.target.value)} className="w-full">
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">{isFrench ? "Aucun mot de passe" : "No password"}</option>
                </Select>
              </div>
              {security !== "nopass" && (
                <div className="space-y-1.5">
                  <label htmlFor="qr-wifi-password" className="block text-sm font-medium">{isFrench ? "Mot de passe Wi-Fi" : "Wi-Fi password"}</label>
                  <input id="qr-wifi-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--on-surface)]" />
                </div>
              )}
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={hidden} onChange={(event) => setHidden(event.target.checked)} className="size-4 accent-[var(--primary)]" />
                {isFrench ? "Réseau masqué" : "Hidden network"}
              </label>
              <p className="text-xs text-[var(--muted)]">
                {isFrench
                  ? "Le QR Code contient le nom du réseau et, si nécessaire, son mot de passe. Toute personne qui peut le scanner peut récupérer ces informations."
                  : "The QR Code contains the network name and, when required, its password. Anyone who can scan it can retrieve these details."}
              </p>
            </div>
          ) : (
            <>
              <TextArea
                label={t.input}
                inputId="qr-code-input"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder={t.placeholder}
                spellCheck={false}
                autoCapitalize="none"
                className="min-h-36 resize-y font-mono text-sm"
                aria-invalid={Boolean(result?.error)}
                aria-describedby={result?.error ? "qr-code-error" : undefined}
              />
              <p className="text-xs text-[var(--muted)]">{t.hint}</p>
            </>
          )}
          {result?.error && <p id="qr-code-error" role="alert" className="text-sm font-medium text-[var(--danger)]">{result.error}</p>}

          <div className="flex flex-wrap items-end gap-3">
            <Select id="qr-code-size" label={t.size} value={size} onChange={(event) => setSize(event.target.value)} className="min-w-32">
              <option value="192">192 px</option>
              <option value="256">256 px</option>
              <option value="320">320 px</option>
              <option value="512">512 px</option>
            </Select>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="primary" onClick={download} disabled={!result?.qr}>{t.download}</Button>
              <ClearButton onClear={clear} disabled={mode === "wifi" ? !ssid && !password && !hidden : !value} label={t.clear} />
            </div>
          </div>
        </div>

        <div className="flex min-h-72 items-center justify-center border-t border-[var(--border)] pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          {result?.qr ? (
            <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-sm)]">
              <svg
                ref={svgRef}
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`-4 -4 ${result.qr.matrix.length + 8} ${result.qr.matrix.length + 8}`}
                width={size}
                height={size}
                role="img"
                aria-label={t.preview}
                shapeRendering="crispEdges"
              >
                <rect x="-4" y="-4" width={result.qr.matrix.length + 8} height={result.qr.matrix.length + 8} fill="#fff" />
                {result.qr.matrix.map((row, rowIndex) => row.map((dark, columnIndex) =>
                  dark ? <rect key={`${rowIndex}-${columnIndex}`} x={columnIndex} y={rowIndex} width="1" height="1" fill="#000" /> : null
                ))}
              </svg>
              <p className="mt-3 text-center text-xs text-[var(--muted)]">{t.version(result.qr.version)}</p>
            </div>
          ) : (
            <p className="text-center text-sm text-[var(--muted)]">{t.emptyResult}</p>
          )}
        </div>
      </div>
    </section>
  );
}
