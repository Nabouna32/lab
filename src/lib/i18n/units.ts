import type { DownloadSpeedUnit, DownloadSizeUnit } from "@/lib/temps-telechargement";
import type { SpeedUnit } from "@/lib/vitesse-telechargement";
import type { SizeUnit } from "@/lib/convertisseur-taille";
import type { BitrateUnit, DurationUnit, FileSizeUnit } from "@/lib/taille-fichier";
import type { Locale } from "./config";

type UnitStyle = "long" | "short";

const FILE_SIZE_LABELS: Record<Locale, Record<SizeUnit, string>> = {
  fr: {
    o: "Octets (o)", ko: "Kilooctets (ko) — 1 000 o", mo: "Mégaoctets (Mo) — 1 000 000 o",
    go: "Gigaoctets (Go) — 1 000 000 000 o", to: "Téraoctets (To) — 1 000 000 000 000 o",
    kio: "Kio — 1 024 o", mio: "Mio — 1 048 576 o", gio: "Gio — 1 073 741 824 o", tio: "Tio — 1 099 511 627 776 o",
  },
  en: {
    o: "Bytes (B)", ko: "Kilobytes (kB) — 1,000 B", mo: "Megabytes (MB) — 1,000,000 B",
    go: "Gigabytes (GB) — 1,000,000,000 B", to: "Terabytes (TB) — 1,000,000,000,000 B",
    kio: "Kibibytes (KiB) — 1,024 B", mio: "Mebibytes (MiB) — 1,048,576 B", gio: "Gibibytes (GiB) — 1,073,741,824 B", tio: "Tebibytes (TiB) — 1,099,511,627,776 B",
  },
};

const FILE_SIZE_SHORT_LABELS: Record<Locale, Record<SizeUnit, string>> = {
  fr: { o: "o", ko: "ko", mo: "Mo", go: "Go", to: "To", kio: "Kio", mio: "Mio", gio: "Gio", tio: "Tio" },
  en: { o: "B", ko: "kB", mo: "MB", go: "GB", to: "TB", kio: "KiB", mio: "MiB", gio: "GiB", tio: "TiB" },
};

const SPEED_LABELS: Record<Locale, Record<SpeedUnit, string>> = {
  fr: { mbps: "Mégabits/s (Mbit/s)", gbps: "Gigabits/s (Gbit/s)", "ko-s": "Kilooctets/s (ko/s)", "mo-s": "Mégaoctets/s (Mo/s)", "go-s": "Gigaoctets/s (Go/s)" },
  en: { mbps: "Megabits/s (Mbit/s)", gbps: "Gigabits/s (Gbit/s)", "ko-s": "Kilobytes/s (kB/s)", "mo-s": "Megabytes/s (MB/s)", "go-s": "Gigabytes/s (GB/s)" },
};

const SPEED_SHORT_LABELS: Record<Locale, Record<SpeedUnit, string>> = {
  fr: { mbps: "Mbit/s", gbps: "Gbit/s", "ko-s": "ko/s", "mo-s": "Mo/s", "go-s": "Go/s" },
  en: { mbps: "Mbit/s", gbps: "Gbit/s", "ko-s": "kB/s", "mo-s": "MB/s", "go-s": "GB/s" },
};

const DOWNLOAD_SIZE_SHORT_LABELS: Record<Locale, Record<DownloadSizeUnit, string>> = {
  fr: { ko: "ko", mo: "Mo", go: "Go", to: "To" },
  en: { ko: "kB", mo: "MB", go: "GB", to: "TB" },
};

const DOWNLOAD_SPEED_SHORT_LABELS: Record<Locale, Record<DownloadSpeedUnit, string>> = {
  fr: { kbps: "kb/s", mbps: "Mb/s", gbps: "Gb/s", "ko-s": "ko/s", "mo-s": "Mo/s", "go-s": "Go/s" },
  en: { kbps: "kb/s", mbps: "Mb/s", gbps: "Gb/s", "ko-s": "kB/s", "mo-s": "MB/s", "go-s": "GB/s" },
};

const DURATION_LABELS: Record<Locale, Record<DurationUnit, string>> = {
  fr: { seconds: "Secondes", minutes: "Minutes", hours: "Heures" },
  en: { seconds: "Seconds", minutes: "Minutes", hours: "Hours" },
};

const DURATION_SHORT_LABELS: Record<Locale, { day: string; hour: string; minute: string; second: string }> = {
  fr: { day: "j", hour: "h", minute: "min", second: "s" },
  en: { day: "d", hour: "h", minute: "min", second: "s" },
};


const DURATION_PART_LABELS: Record<Locale, Record<"days" | "hours" | "minutes" | "seconds", { singular: string; plural: string }>> = {
  fr: {
    days: { singular: "jour", plural: "jours" }, hours: { singular: "heure", plural: "heures" },
    minutes: { singular: "minute", plural: "minutes" }, seconds: { singular: "seconde", plural: "secondes" },
  },
  en: {
    days: { singular: "day", plural: "days" }, hours: { singular: "hour", plural: "hours" },
    minutes: { singular: "minute", plural: "minutes" }, seconds: { singular: "second", plural: "seconds" },
  },
};

const BITRATE_LABELS: Record<Locale, Record<BitrateUnit, string>> = {
  fr: { kbps: "Kbit/s", mbps: "Mbit/s", gbps: "Gbit/s" },
  en: { kbps: "Kbit/s", mbps: "Mbit/s", gbps: "Gbit/s" },
};

const FILE_SIZE_CALCULATOR_LABELS: Record<Locale, { long: Record<FileSizeUnit, string>; short: Record<FileSizeUnit, string> }> = {
  fr: { long: { mb: "Mégaoctets (Mo)", gb: "Gigaoctets (Go)" }, short: { mb: "Mo", gb: "Go" } },
  en: { long: { mb: "Megabytes (MB)", gb: "Gigabytes (GB)" }, short: { mb: "MB", gb: "GB" } },
};

export function getFileSizeUnitLabel(locale: Locale, unit: SizeUnit, style: UnitStyle = "short"): string {
  return (style === "long" ? FILE_SIZE_LABELS : FILE_SIZE_SHORT_LABELS)[locale][unit];
}

export function getSpeedUnitLabel(locale: Locale, unit: SpeedUnit, style: UnitStyle = "short"): string {
  return (style === "long" ? SPEED_LABELS : SPEED_SHORT_LABELS)[locale][unit];
}

export function getDownloadSizeUnitLabel(locale: Locale, unit: DownloadSizeUnit): string {
  return DOWNLOAD_SIZE_SHORT_LABELS[locale][unit];
}

export function getDownloadSpeedUnitLabel(locale: Locale, unit: DownloadSpeedUnit): string {
  return DOWNLOAD_SPEED_SHORT_LABELS[locale][unit];
}

export function getDurationUnitLabel(locale: Locale, unit: DurationUnit): string {
  return DURATION_LABELS[locale][unit];
}

export function getDownloadDurationLabels(locale: Locale): Record<"day" | "hour" | "minute" | "second", string> {
  return DURATION_SHORT_LABELS[locale];
}

export function getBitrateUnitLabel(locale: Locale, unit: BitrateUnit): string {
  return BITRATE_LABELS[locale][unit];
}

export function getFileSizeCalculatorUnitLabel(locale: Locale, unit: FileSizeUnit, style: UnitStyle = "short"): string {
  return FILE_SIZE_CALCULATOR_LABELS[locale][style][unit];
}

export function formatDurationPart(locale: Locale, unit: "days" | "hours" | "minutes" | "seconds", value: number): string {
  const labels = DURATION_PART_LABELS[locale][unit];
  return `${value} ${value === 1 ? labels.singular : labels.plural}`;
}
