# Supabase Edge Functions

Each function has its own `deno.json` and committed `deno.lock`. Direct npm imports must use exact versions; CI checks the lockfile in frozen mode and type-checks each entry point.

## Runtime compatibility

Use Deno **2.1.4** for dependency and type-check validation because the hosted Supabase Edge Runtime is currently documented as compatible with Deno 2.1.4. Do not generate these lockfiles with a newer Deno version unless the hosted runtime compatibility and lockfile format are revalidated.

## Updating a dependency

1. Update the exact `npm:` import version in the relevant function. If the application also uses the package, update `package.json` and `package-lock.json` as well.
2. From that function's directory, run `deno check --frozen=false index.ts` with Deno 2.1.4 to regenerate its lockfile.
3. Review the lockfile diff, restore `"lock": { "frozen": true }` in `deno.json`, then run `deno check --frozen index.ts`.
4. Confirm the **Supabase Edge Functions CI** workflow passes.

This workflow validates dependency resolution and types; it does not deploy functions. Production deployment and database migrations remain coordinated release steps.
