import Link from "next/link";
import { requireAdminPermission } from "@/lib/admin/authorization";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";

function ModuleContent({ module, t }: { module: { title: string; description: string; status: string }; t: ReturnType<typeof getMessages> }) {
  const available = module.status === t.admin.available;
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold">{module.title}</h3>
        <span className={available ? "shrink-0 text-xs font-semibold text-[var(--success)]" : "shrink-0 text-xs font-semibold text-[var(--muted)]"}>{module.status}</span>
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{module.description}</p>
    </>
  );
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: value } = await params;
  if (!isLocale(value)) return null;

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
    { title: t.admin.audit, description: t.admin.auditDescription, status: t.admin.available, href: `/${locale}/admin/audit` },
  ];

  return (
    <main className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href={"/" + locale + "/compte"} className="text-sm font-semibold text-[var(--accent)]">
          ← {t.admin.account}
        </Link>
        <p className="mt-5 text-sm font-semibold text-[var(--accent)]">{t.admin.label}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{t.admin.title}</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{t.admin.description}</p>
      </div>

      <section aria-labelledby="admin-modules">
        <div className="mb-4">
          <h2 id="admin-modules" className="text-xl font-semibold">{t.admin.modules}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{t.admin.dashboard}</p>
        </div>

        <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {modules.map((module) => {
            const content = <ModuleContent module={module} t={t} />;
            return module.href ? (
              <Link
                key={module.title}
                href={module.href}
                className="block py-4 outline-none transition-colors hover:bg-[var(--surface-soft)] focus-visible:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] sm:px-3"
              >
                {content}
              </Link>
            ) : (
              <div key={module.title} className="py-4 sm:px-3">
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <section aria-labelledby="admin-access">
          <h2 id="admin-access" className="text-lg font-semibold">{t.admin.access}</h2>
          <div className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            <div className="py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{t.admin.account}</p>
              <p className="mt-1 break-all font-medium">{access.email ?? "—"}</p>
            </div>
            <div className="py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{t.admin.roles}</p>
              <p className="mt-1 break-words font-medium">{roleKeys.join(", ") || "—"}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="admin-permissions">
          <h2 id="admin-permissions" className="text-lg font-semibold">{t.admin.permissions}</h2>
          <ul className="mt-4 grid gap-x-6 divide-y divide-[var(--border)] border-y border-[var(--border)] sm:grid-cols-2 sm:divide-y-0">
            {permissionKeys.map((permission) => (
              <li key={permission} className="py-3 text-sm text-[var(--muted)] sm:border-b sm:border-[var(--border)]">
                {permission}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="admin-audit" className="mt-8 border-t border-[var(--border)] pt-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 id="admin-audit" className="text-lg font-semibold">{t.admin.auditLog}</h2>
          <span className="text-xs text-[var(--muted)]">{t.admin.auditDescription}</span>
        </div>
        {auditEntries?.length ? (
          <div className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
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
