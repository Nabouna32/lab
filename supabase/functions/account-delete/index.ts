import { createClient } from "npm:@supabase/supabase-js@2";

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
  const url = Deno.env.get("SUPABASE_URL");
  const publishableKey = getPublishableKey();
  const secretKey = getSecretKey();

  if (!authHeader || !url || !publishableKey || !secretKey) {
    return Response.json({ error: "Function is not configured." }, { status: 500 });
  }

  const userClient = createClient(url, publishableKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
  const adminClient = createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });

  const { data: userData, error: userError } = await userClient.auth.getUser();
  if (userError || !userData.user) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const userId = userData.user.id;
  // This read-only preflight preserves a useful error for the normal UX path.
  // The auth.users DELETE trigger is authoritative and rechecks under the shared
  // advisory lock because this RPC transaction ends before the Auth Admin request.
  const { data: canDelete, error: checkError } = await userClient.rpc(
    "check_account_deletion",
    { target_user_id: userId },
  );

  if (checkError || canDelete !== true) {
    const isLastSuperAdmin = checkError?.message?.includes("last super_admin") === true;
    return Response.json(
      { error: isLastSuperAdmin ? "LAST_SUPER_ADMIN" : "Could not verify account deletion." },
      { status: isLastSuperAdmin ? 409 : 500 },
    );
  }

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId, false);
  if (deleteError) {
    return Response.json({ error: "Could not delete the account." }, { status: 500 });
  }

  return Response.json({ ok: true });
};

export default handler;
