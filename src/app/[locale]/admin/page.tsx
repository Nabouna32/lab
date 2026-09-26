import Link from "next/link";
import { requireAdminPermission } from "@/lib/admin/authorization";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  if (!isLocale(value)) {
    return null;
  }

  const locale: Locale = value;
  const access = await requireAdminPermission(locale, "admin.dashboard.view");
  const t = getMessages(locale);
  const supabase = await createClient();

  const [{ data: roles }, { data: auditEntries }] = await Promise.all([
    supabase
      .from("admin_user_roles")
      .select("role_key, created_at")
      .eq("user_id", access.userId)
      .order("created_at"),
    supabase
      .from("admin_audit_log")
      .select("id, action, target_type, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const roleKeys = roles?.map((role) => role.role_key) ?? [];
  let permissionKeys: string[] = [];

  if (roleKeys.length > 0) {
    const { data: rolePermissions } = await supabase
      .from("admin_role_permissions")
      .select("role_key, permission_key")
      .in("role_key", roleKeys);

    permissionKeys = [...new Set(rolePermissions?.map((item) => item.permission_key) ?? [])];
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href={`/${locale}/compte`} className="text-sm font-semibold text-[var(--accent)]">
          ← {t.admin.account}
        </Link>
        <p className="mt-6 text-sm font-semibold text-[var(--accent)]">{t.admin.label}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{t.admin.title}</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{t.admin.description}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-sm)] lg:col-span-2">
          <h2 className="text-lg font-semibold">{t.admin.dashboard}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{t.admin.account}</p>
              <p className="mt-2 break-all font-medium">{access.email ?? access.userId}</p>
            </div>
            <div className="rounded-2xl bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{t.admin.roles}</p>
              <p className="mt-2 font-medium">{roleKeys.join(", ") || "—"}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-sm)]">
          <h2 className="text-lg font-semibold">{t.admin.permissions}</h2>
          <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
            {permissionKeys.map((permission) => (
              <li key={permission} className="rounded-xl bg-[var(--surface-soft)] px-3 py-2">
                {permission}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-5 rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-sm)]">
        <h2 className="text-lg font-semibold">{t.admin.auditLog}</h2>
        {auditEntries?.length ? (
          <div className="mt-4 divide-y divide-[var(--border)]">
            {auditEntries.map((entry) => (
              <div key={entry.id} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-medium">{entry.action}</p>
                  <p className="text-sm text-[var(--muted)]">
                    {entry.target_type ?? t.admin.dashboard}
                  </p>
                </div>
                <time className="text-sm text-[var(--muted)]" dateTime={entry.created_at}>
                  {new Date(entry.created_at).toLocaleString(locale)}
                </time>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--muted)]">{t.admin.noAuditEntries}</p>
        )}
      </section>
    </main>
  );
}
