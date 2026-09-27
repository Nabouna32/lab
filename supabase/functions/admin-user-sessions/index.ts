import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

type Payload = { targetUserId?: string };

function getKeyMap(name: string) {
  const raw = Deno.env.get(name);
  if (!raw) return null;
  try { return JSON.parse(raw) as Record<string, string>; } catch { return null; }
}

const getPublishableKey = () => getKeyMap("SUPABASE_PUBLISHABLE_KEYS")?.default ?? Deno.env.get("SUPABASE_ANON_KEY");
const getSecretKey = () => getKeyMap("SUPABASE_SECRET_KEYS")?.default ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

Deno.serve(async (req) => {
  if (req.method !== "POST") return Response.json({ error: "Method not allowed." }, { status: 405 });

  const authHeader = req.headers.get("Authorization");
  const url = Deno.env.get("SUPABASE_URL");
  const publishableKey = getPublishableKey();
  const secretKey = getSecretKey();
  if (!authHeader || !url || !publishableKey || !secretKey) {
    return Response.json({ error: "Function is not configured." }, { status: 500 });
  }

  const client = createClient(url, publishableKey, { global: { headers: { Authorization: authHeader } }, auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } });
  const adminClient = createClient(url, secretKey, { auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } });

  const { data: actor, error: actorError } = await client.auth.getUser();
  if (actorError || !actor.user) return Response.json({ error: "Unauthorized." }, { status: 401 });

  let payload: Payload;
  try { payload = await req.json(); } catch { return Response.json({ error: "Invalid JSON." }, { status: 400 }); }
  const targetUserId = payload.targetUserId?.trim();
  if (!targetUserId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(targetUserId)) {
    return Response.json({ error: "Invalid user id." }, { status: 400 });
  }

  const { data: allowed, error: permissionError } = await client.rpc("has_admin_permission", { requested_permission: "users.suspend" });
  if (permissionError || allowed !== true) return Response.json({ error: "Forbidden." }, { status: 403 });

  if (targetUserId === actor.user.id) return Response.json({ error: "Cannot revoke your own sessions." }, { status: 400 });

  const { data: roles, error: rolesError } = await client.from("admin_user_roles").select("role_key").eq("user_id", targetUserId);
  if (rolesError) return Response.json({ error: "Could not inspect target account." }, { status: 500 });
  if ((roles ?? []).some((role) => role.role_key === "super_admin")) {
    return Response.json({ error: "Cannot revoke sessions for a super administrator." }, { status: 409 });
  }

  const { data: revoked, error: revokeError } = await client.rpc("revoke_admin_user_sessions", { target_user_id: targetUserId });
  if (revokeError) return Response.json({ error: "Could not revoke sessions." }, { status: 500 });

  const { error: auditError } = await client.rpc("record_admin_audit", {
    audit_action: "admin.user.sessions_revoked",
    audit_target_type: "user",
    audit_target_id: targetUserId,
    audit_metadata: { revoked_sessions: revoked ?? 0 },
  });
  if (auditError) return Response.json({ error: "Sessions revoked but audit logging failed." }, { status: 500 });

  return Response.json({ ok: true, revokedSessions: revoked ?? 0 });
});
