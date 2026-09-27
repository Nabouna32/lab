// @ts-expect-error Resolved by the Deno Edge runtime, not the Node typecheck.\nimport { createClient } from "npm:@supabase/supabase-js@2";\n\ndeclare const Deno: { env: { get(name: string): string | undefined } };


type Action = "suspend" | "unsuspend";

type Payload = {
  action?: Action;
  targetUserId?: string;
};

type AdminRole = {
  role_key: string;
};

function getKeyMap(name: string) {
  const raw = Deno.env.get(name);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return null;
  }
}

function getPublishableKey() {
  return getKeyMap("SUPABASE_PUBLISHABLE_KEYS")?.default ?? Deno.env.get("SUPABASE_ANON_KEY");
}

function getSecretKey() {
  return getKeyMap("SUPABASE_SECRET_KEYS")?.default ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed." }, { status: 405 });
  }

  const authHeader = req.headers.get("Authorization");
  const publishableKey = getPublishableKey();
  const secretKey = getSecretKey();
  const supabaseUrl = Deno.env.get("SUPABASE_URL");

  if (!authHeader || !publishableKey || !secretKey || !supabaseUrl) {
    return Response.json({ error: "Function is not configured." }, { status: 500 });
  }

  const userClient = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
  const adminClient = createClient(supabaseUrl, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });

  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  let payload: Payload;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const action = payload.action;
  const targetUserId = payload.targetUserId?.trim();

  if ((action !== "suspend" && action !== "unsuspend") || !targetUserId) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(targetUserId)) {
    return Response.json({ error: "Invalid user id." }, { status: 400 });
  }

  const { data: allowed, error: permissionError } = await userClient.rpc(
    "has_admin_permission",
    { requested_permission: "users.suspend" },
  );

  if (permissionError || allowed !== true) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  if (action === "suspend") {
    if (targetUserId === userData.user.id) {
      return Response.json({ error: "Cannot suspend yourself." }, { status: 400 });
    }

    const { data: targetRoles, error: rolesError } = await userClient
      .from("admin_user_roles")
      .select("role_key")
      .eq("user_id", targetUserId);

    if (rolesError) {
      return Response.json({ error: "Could not inspect target account." }, { status: 500 });
    }

    if ((targetRoles as AdminRole[] | null)?.some((role) => role.role_key === "super_admin")) {
      return Response.json({ error: "Cannot suspend a super administrator." }, { status: 409 });
    }
  }

  const { data: user, error: updateError } = await adminClient.auth.admin.updateUserById(
    targetUserId,
    { ban_duration: action === "suspend" ? "876000h" : "none" },
  );

  if (updateError) {
    return Response.json({ error: "Could not update the account." }, { status: 500 });
  }

  const { error: revokeError } = await userClient.rpc("revoke_admin_user_sessions", { target_user_id: targetUserId });
  if (revokeError) {
    return Response.json({ error: "Account changed but existing sessions could not be revoked." }, { status: 500 });
  }

  const { error: auditError } = await userClient.rpc("record_admin_audit", {
    audit_action: action === "suspend" ? "admin.user.suspended" : "admin.user.unsuspended",
    audit_target_type: "user",
    audit_target_id: targetUserId,
    audit_metadata: {
      banned_until: user.user?.banned_until ?? null,
      sessions_revoked: true,
    },
  });

  if (auditError) {
    return Response.json({ error: "Account changed but audit logging failed." }, { status: 500 });
  }

  return Response.json({
    ok: true,
    bannedUntil: user.user?.banned_until ?? null,
  });
};

export default handler;
