# Loculary — Administration

The admin area is authenticated and permission-checked on the server. Database-backed RBAC and audit logging are implemented; the admin UI is intentionally narrower than the long-term administration vision.

## Implemented

- **Dashboard:** permission-gated admin entry point.
- **Users:** search users, inspect account status, suspend accounts, and assign/remove administrative roles through guarded server-side operations.
- **Audit log:** read security and administrative events.
- **Authorization:** database-backed `super_admin` and `admin` roles with granular permissions. Role changes enforce the last-`super_admin` invariant and write audit events.

Current permission keys are `admin.dashboard.view`, `users.view`, `users.manage_roles`, `users.suspend`, `audit.read`, and `audit.write`. Do not document planned permissions as if they were deployed.

## Not implemented

The public tool catalog remains Git-backed. There is no admin UI for editing tools, categories or tags, nor a general-settings admin screen.

Executable tool code remains in Git. See DEC-027 and `docs/DATABASE.md` for the criteria governing any database-backed catalog proposal.
