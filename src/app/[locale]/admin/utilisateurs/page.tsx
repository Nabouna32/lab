import Link from "next/link";
import { assignAdminRole, removeAdminRole, suspendUser, unsuspendUser } from "./actions";
import { requireAdminPermission } from "@/lib/admin/authorization";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "@/lib/i18n/messages";
import { isLocale, type Locale } from "@/lib/i18n/config";

type UserRow = {
  user_id: string;
  email: string | null;
  display_name: string | null;
  locale: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  banned_until: string | null;
  roles: string[];
};

function formatDate(value: string | null, locale: Locale) {
  if (!value) return null;
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default async function AdminUsersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; status?: string; error?: string }>;
}) {
  const { locale: value } = await params;
  if (!isLocale(value)) return null;

  const locale: Locale = value;
  await requireAdminPermission(locale, "users.view");
  const t = getMessages(locale);
  const { q: rawQuery, status, error } = await searchParams;
  const query = typeof rawQuery === "string" ? rawQuery.trim().slice(0, 100) : "";
  const supabase = await createClient();

  const [{ data: users, error: usersError }, { data: roles }, { data: rolePermissions }] = await Promise.all([
    supabase.rpc("list_admin_users", { search_term: query || null }),
    supabase.from("admin_roles").select("key, name").order("key"),
    supabase.from("admin_role_permissions").select("role_key, permission_key").eq("permission_key", "users.manage_roles"),
  ]);

  const manageableRoles = new Set(rolePermissions?.map((item) => item.role_key) ?? []);\n  const canManageRoles = manageableRoles.size > 0;\n  const { data: suspendPermission } = await supabase.rpc("has_admin_permission", { requested_permission: "users.suspend" });\n  const canSuspendUsers = suspendPermission === true;
  const roleOptions = roles?.filter((role) => role.key === "admin" || role.key === "super_admin") ?? [];

  return (
    <main className="mx-auto min-h-[calc(100vh-4.5rem)] max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href={`/${locale}/admin`} className="text-sm font-semibold text-[var(--accent)]">{t.admin.usersBack}</Link>

      <header className="mt-6">
        <p className="text-sm font-semibold text-[var(--accent)]">{t.admin.label}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{t.admin.usersTitle}</h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">{t.admin.usersDescription}</p>
      </header>

      {status === "updated" || status === "suspended" || status === "unsuspended" ? (
        <p className="mt-5 rounded-xl bg-[var(--success-soft)] px-4 py-3 text-sm font-medium text-[var(--success)]" role="status">{status === "suspended" ? t.admin.userSuspended : status === "unsuspended" ? t.admin.userUnsuspended : t.admin.userUpdated}</p>
      ) : null}
      {status === "error" || error ? (
        <p className="mt-5 rounded-xl bg-[var(--danger-soft)] px-4 py-3 text-sm font-medium text-[var(--danger)]" role="alert">{t.admin.userActionError}</p>
      ) : null}

      <form className="mt-8 flex flex-col gap-3 sm:flex-row" method="get">
        <label className="sr-only" htmlFor="user-search">{t.admin.usersSearch}</label>
        <input id="user-search" name="q" defaultValue={query} placeholder={t.admin.usersSearchPlaceholder} className="min-h-11 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--focus-ring)]" />
        <button type="submit" className="min-h-11 rounded-xl bg-[var(--accent)] px-5 font-semibold text-white hover:bg-[var(--accent-strong)]">{t.admin.usersSearchSubmit}</button>
      </form>

      {usersError ? (
        <p className="mt-6 rounded-xl bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]" role="alert">{usersError.message}</p>
      ) : users?.length ? (
        <section className="mt-8 space-y-4" aria-label={t.admin.usersTitle}>
          {(users as UserRow[]).map((user) => (
            <article key={user.user_id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 shadow-[var(--shadow-sm)]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <h2 className="break-all text-lg font-semibold">{user.email ?? "—"}</h2>
                  <p className="mt-1 text-sm text-[var(--muted)]">{user.display_name || t.account.notSet}</p>
                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div><dt className="text-[var(--muted)]">{t.admin.userCreated}</dt><dd className="mt-1">{formatDate(user.created_at, locale)}</dd></div>
                    <div><dt className="text-[var(--muted)]">{t.admin.userLastSignIn}</dt><dd className="mt-1">{formatDate(user.last_sign_in_at, locale) ?? t.admin.userNeverSignedIn}</dd></div>
                  </dl>
                </div>
                <div className="shrink-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{t.admin.userEmail}</p>
                  <p className={"mt-2 rounded-full px-3 py-1.5 text-sm font-semibold " + (user.email_confirmed_at ? "bg-[var(--success-soft)] text-[var(--success)]" : "bg-[var(--warning-soft)] text-[var(--warning)]")}>
                    {user.email_confirmed_at ? t.admin.userEmailConfirmed : t.admin.userPending}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-[var(--border)] pt-5">
                <p className="text-sm font-semibold">{t.admin.userRoles}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {user.roles.length ? user.roles.map((role) => (
                    <div key={role} className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-sm font-medium">
                      {role}
                      {manageableRoles.has("super_admin") ? (
                        <form action={removeAdminRole}>
                          <input type="hidden" name="locale" value={locale} />
                          <input type="hidden" name="userId" value={user.user_id} />
                          <input type="hidden" name="roleKey" value={role} />
                          <button type="submit" className="text-[var(--danger)] underline underline-offset-2">{t.admin.userRemoveRole}</button>
                        </form>
                      ) : null}
                    </span>
                  )) : <span className="text-sm text-[var(--muted)]">{t.admin.userNoRoles}</span>}
                </div>

                {canManageRoles && roleOptions.some((role) => !user.roles.includes(role.key)) ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-sm text-[var(--muted)]">{t.admin.userAssignRole}:</span>
                    {roleOptions.filter((role) => !user.roles.includes(role.key)).map((role) => (
                      <form key={role.key} action={assignAdminRole}>
                        <input type="hidden" name="locale" value={locale} />
                        <input type="hidden" name="userId" value={user.user_id} />
                        <input type="hidden" name="roleKey" value={role.key} />
                        <button type="submit" className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--surface-soft)]">{role.name}</button>
                      </form>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <p className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-6 text-[var(--muted)]">{t.admin.usersNoResults}</p>
      )}
    </main>
  );
}
