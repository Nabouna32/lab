# Utiluna — Database

PostgreSQL is the planned relational source of truth for durable product, account and community data. Executable behavior remains in Git; business metadata and operational state live in the database.

Expected domains include users/auth identities, preferences, languages/translations, tools and versions, lifecycle state, categories/tags, examples/SEO content, favorites, collections, history metadata, ratings, comments, reports, moderation, proposals, contributors, permissions, audit logs, analytics metadata and privacy/consent state.

Sensitive tool inputs and file contents are not stored by default. Each tool defines what history can retain. Anonymous local favorites may be merged into account favorites after login with deterministic conflict handling.

All client-provided data is untrusted. Enforce server-side validation, authorization, constraints, uniqueness and auditability.

Tool lifecycle: draft → review → published → hidden → archived. Hard deletion is exceptional and protected.


## Implemented foundation

The first account foundation is now deployed to Supabase: Supabase Auth remains the identity system, while `public.profiles` stores only user-owned profile metadata that is safe to synchronize. Row Level Security restricts profile access to the owning user, and a database trigger creates the profile when an Auth user is created.

This is intentionally a small first step. Catalog/editorial data, favorites, collections, preferences, community data and administration will be designed and moved into the database incrementally after the code/database boundary is reviewed.


## Administration foundation

Administrative authorization now has a database foundation separate from executable tool behavior. Roles, permissions, role bindings, user-role assignments and the administrative audit log are stored in Supabase with Row Level Security. The first roles are `super_admin` and `admin`. No automatic first-user bootstrap exists; administrator assignment must be explicit.
