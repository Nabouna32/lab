import Link from "next/link";
import { requireAdminPermission } from "@/lib/admin/authorization";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";

type AuditRow = {
  id: string;
  actor_email: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatTarget(row: AuditRow) {
  if (!row.target_type && !row.target_id) return "—";
  if (!row.target_id) return row.target_type ?? "—";
  return `${row.target_type ?? "—"} · ${row.target_id}`;
}

export default async function AdminAuditPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  if (!isLocale(value)) return null;

  const locale: Locale = value;
  await requireAdminPermission(locale, "audit.read");
  const t = getMessages(locale);
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("list_admin_audit_log", { limit_count: 100 });
  const entries = (data ?? []) as AuditRow[];

  return (
    <main className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href={`/${locale}/admin`} className="text-sm font-semibold text-[var(--accent)]">{t.admin.auditBack}</Link>

      <header className="mt-6">
        <p className="text-sm font-semibold text-[var(--accent)]">{t.admin.label}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{t.admin.auditTitle}</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{t.admin.auditDescription}</p>
      </header>

      {error ? (
        <p className="mt-8 rounded-xl bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]" role="alert">
          {t.admin.auditLoadError}
        </p>
      ) : entries.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6 text-[var(--muted)]">
          {t.admin.auditEmpty}
        </p>
      ) : (
        <section className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-soft)] text-left">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">{t.admin.auditDate}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{t.admin.auditActor}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{t.admin.auditAction}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{t.admin.auditTarget}</th>
                  <th scope="col" className="px-4 py-3 font-semibold">{t.admin.auditDetails}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="whitespace-nowrap px-4 py-4 align-top">{formatDate(entry.created_at, locale)}</td>
                    <td className="max-w-52 break-all px-4 py-4 align-top">{entry.actor_email ?? "—"}</td>
                    <td className="px-4 py-4 align-top font-medium">{entry.action}</td>
                    <td className="max-w-72 break-all px-4 py-4 align-top">{formatTarget(entry)}</td>
                    <td className="max-w-80 break-words px-4 py-4 align-top text-[var(--muted)]">
                      {Object.keys(entry.metadata).length ? JSON.stringify(entry.metadata) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
