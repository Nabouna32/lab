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

  const modules = [
    { title: t.admin.users, description: t.admin.usersDescription, status: t.admin.available, href: `/${locale}/admin/utilisateurs` },
    { title: t.admin.tools, description: t.admin.toolsDescription, status: t.admin.comingSoon, href: null },
    { title: t.admin.moderation, description: t.admin.moderationDescription, status: t.admin.comingSoon, href: null },
    { title: t.admin.analytics, description: t.admin.analyticsDescription, status: t.admin.comingSoon, href: null },
    { title: t.admin.settings, description: t.admin.settingsDescription, status: t.admin.comingSoon, href: null },
    { title: t.admin.audit, description: t.admin.auditDescription, status: t.admin.available, href: null },
  ];

  return (
    <main className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href={"/" + locale + "/compte"} className="text-sm font-semibold text-[var(--accent)]">
            ← {t.admin.account}
          </Link>
          <p className="mt-5 text-sm font-semibold text-[var(--accent)]">{t.admin.label}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{t.admin.title}</h1>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">{t.admin.description}</p>
        </div>
      </div>

      <section aria-labelledby="admin-modules">
        <div className="mb-4">
          <h2 id="admin-modules" className="text-xl font-semibold">{t.admin.modules}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{t.admin.dashboard}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const available = module.status === t.admin.available;

            return (
              <article
                key={module.title}
                className={
                  available
                    ? "rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--accent)]"
                    : "rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)]/60 p-5 opacity-75"
                }
              >
                {module.href ? <Link href={module.href} className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"> : null}
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold">{module.title}</h3>
                  <span
                    className={
                      available
                        ? "shrink-0 rounded-full bg-[var(--success-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--success)]"
                        : "shrink-0 rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--muted)]"
                    }
                  >
                    {module.status}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{module.description}</p>
                {module.href ? </Link> : null}
              </article>
            );
          })}
        </div>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-[var(--shadow-sm)]">
          <h2 className="text-lg font-semibold">{t.admin.access}</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{t.admin.account}</p>
              <p className="mt-1 break-all font-medium">{access.email ?? "—"}</p>
            </div>
            <div className="rounded-xl bg-[var(--surface-soft)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{t.admin.roles}</p>
              <p className="mt-1 font-medium">{roleKeys.join(", ") || "—"}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-[var(--shadow-sm)]">
          <h2 className="text-lg font-semibold">{t.admin.permissions}</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {permissionKeys.map((permission) => (
              <li key={permission} className="rounded-xl bg-[var(--surface-soft)] px-3 py-2 text-sm text-[var(--muted)]">
                {permission}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-[var(--shadow-sm)]">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold">{t.admin.auditLog}</h2>
          <span className="text-xs text-[var(--muted)]">{t.admin.auditDescription}</span>
        </div>
        {auditEntries?.length ? (
          <div className="mt-4 divide-y divide-[var(--border)]">
            {auditEntries.map((entry) => (
              <div key={entry.id} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-medium">{entry.action}</p>
                  <p className="text-sm text-[var(--muted)]">{entry.target_type ?? t.admin.dashboard}</p>
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
