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
    <main className="min-h-[calc(100vh-4.5rem)]">
      <div className="mx-auto w-full max-w-[var(--layout-content-default)] px-[var(--layout-page-gutter)] py-[var(--space-8)]">
      <Link href={`/${locale}/admin`} className="m3-type-label-large text-[var(--primary)]">{t.admin.auditBack}</Link>

      <header className="mt-6">
        <p className="m3-type-label-large text-[var(--primary)]">{t.admin.label}</p>
        <h1 className="mt-1 m3-type-headline-large">{t.admin.auditTitle}</h1>
        <p className="mt-3 max-w-2xl m3-type-body-large text-[var(--muted)]">{t.admin.auditDescription}</p>
      </header>

      {error ? (
        <p className="mt-8 border-y border-[var(--danger)]/30 bg-[var(--danger-soft)] px-1 py-3 m3-type-body-medium text-[var(--danger)]" role="alert">
          {t.admin.auditLoadError}
        </p>
      ) : entries.length === 0 ? (
        <p className="mt-8 border-y border-[var(--border)] py-5 m3-type-body-large text-[var(--muted)]">
          {t.admin.auditEmpty}
        </p>
      ) : (
        <section className="mt-8 border-y border-[var(--border)]" aria-label={t.admin.auditTitle}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse m3-type-body-medium">
              <thead className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                <tr>
                  <th scope="col" className="px-3 py-3 m3-type-label-large">{t.admin.auditDate}</th>
                  <th scope="col" className="px-3 py-3 m3-type-label-large">{t.admin.auditActor}</th>
                  <th scope="col" className="px-3 py-3 m3-type-label-large">{t.admin.auditAction}</th>
                  <th scope="col" className="px-3 py-3 m3-type-label-large">{t.admin.auditTarget}</th>
                  <th scope="col" className="px-3 py-3 m3-type-label-large">{t.admin.auditDetails}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="whitespace-nowrap px-3 py-4 align-top m3-type-body-medium text-[var(--muted)]">{formatDate(entry.created_at, locale)}</td>
                    <td className="max-w-52 break-all px-3 py-4 align-top">{entry.actor_email ?? "—"}</td>
                    <td className="px-3 py-4 align-top m3-type-title-small">{entry.action}</td>
                    <td className="max-w-72 break-all px-3 py-4 align-top">{formatTarget(entry)}</td>
                    <td className="max-w-80 break-words px-3 py-4 align-top m3-type-body-medium text-[var(--muted)]">
                      {Object.keys(entry.metadata).length ? JSON.stringify(entry.metadata) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      </div>
    </main>
  );
}
