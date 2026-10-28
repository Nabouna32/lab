import Link from "next/link";
import { PageContainer } from "@/components/layout/PageLayout";
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
    { title: t.admin.users, description: t.admin.usersDescription, href: `/${locale}/admin/utilisateurs` },
    { title: t.admin.audit, description: t.admin.auditDescription, href: `/${locale}/admin/audit` },
  ];

  return (
    <main className="min-h-[calc(100vh-4.5rem)]">
      <PageContainer width="default" spacing="none" className="py-[var(--space-8)] sm:py-[var(--space-10)]">
      <div className="mb-8">
        <Link href={"/" + locale + "/compte"} className="m3-type-label-large text-[var(--primary)]">
          ← {t.admin.account}
        </Link>
        <p className="mt-5 m3-type-label-large text-[var(--primary)]">{t.admin.label}</p>
        <h1 className="mt-1 m3-type-headline-large">{t.admin.title}</h1>
        <p className="mt-3 max-w-2xl m3-type-body-large text-[var(--muted)]">{t.admin.description}</p>
      </div>

      <section aria-labelledby="admin-modules">
        <div className="mb-4">
          <h2 id="admin-modules" className="m3-type-title-large">{t.admin.modules}</h2>
          <p className="mt-1 m3-type-body-medium text-[var(--muted)]">{t.admin.dashboard}</p>
        </div>

        <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {modules.map((module) => (
            <Link
              key={module.title}
              href={module.href}
              className="block py-4 outline-none transition-colors hover:bg-[var(--surface-soft)] focus-visible:bg-[var(--surface-soft)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--focus-ring)] sm:px-3"
            >
              <h3 className="m3-type-title-medium">{module.title}</h3>
              <p className="mt-2 m3-type-body-medium text-[var(--muted)]">{module.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <section aria-labelledby="admin-access">
          <h2 id="admin-access" className="m3-type-title-large">{t.admin.access}</h2>
          <div className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            <div className="py-4">
              <p className="m3-type-label-small uppercase text-[var(--muted)]">{t.admin.account}</p>
              <p className="mt-1 break-all m3-type-body-medium">{access.email ?? "—"}</p>
            </div>
            <div className="py-4">
              <p className="m3-type-label-small uppercase text-[var(--muted)]">{t.admin.roles}</p>
              <p className="mt-1 break-words m3-type-body-medium">{roleKeys.join(", ") || "—"}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="admin-permissions">
          <h2 id="admin-permissions" className="m3-type-title-large">{t.admin.permissions}</h2>
          <ul className="mt-4 grid gap-x-6 divide-y divide-[var(--border)] border-y border-[var(--border)] sm:grid-cols-2 sm:divide-y-0">
            {permissionKeys.map((permission) => (
              <li key={permission} className="m3-type-body-medium py-3 text-[var(--muted)] sm:border-b sm:border-[var(--border)]">
                {permission}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="admin-audit" className="mt-8 border-t border-[var(--border)] pt-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 id="admin-audit" className="m3-type-title-large">{t.admin.auditLog}</h2>
          <span className="m3-type-body-small text-[var(--muted)]">{t.admin.auditDescription}</span>
        </div>
        {auditEntries?.length ? (
          <div className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {auditEntries.map((entry) => (
              <div key={entry.id} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="m3-type-body-medium">{entry.action}</p>
                  <p className="m3-type-body-small text-[var(--muted)]">{entry.target_type ?? t.admin.dashboard}</p>
                </div>
                <time className="m3-type-body-small text-[var(--muted)]" dateTime={entry.created_at}>
                  {new Date(entry.created_at).toLocaleString(locale)}
                </time>
              </div>
            ))}
          </div>
        ) : (
          <p className="m3-type-body-medium mt-4 text-[var(--muted)]">{t.admin.noAuditEntries}</p>
        )}
      </section>
      </PageContainer>
    </main>
  );
}
