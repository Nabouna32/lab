import { createClient } from "npm:@supabase/supabase-js@2.117.2";

function getSecretKeys(): string[] {
  const raw = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (!raw) return [];

  try {
    const keys = JSON.parse(raw) as Record<string, string>;
    return Object.values(keys);
  } catch {
    return [];
  }
}

const url = Deno.env.get("SUPABASE_URL");
const secretKeys = getSecretKeys();

if (!url || secretKeys.length === 0) {
  throw new Error("Supabase server configuration is incomplete.");
}

const admin = createClient(url, secretKeys[0], {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

const handler = async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed." }, { status: 405 });
  }

  const callerKey = req.headers.get("apikey");
  if (!callerKey || !secretKeys.includes(callerKey)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const sourceRunId =
    req.headers.get("x-dispatch-run-id") ?? crypto.randomUUID();

  const { data, error } = await admin.rpc("agent_dispatcher_tick", {
    p_source: "edge_function",
    p_source_run_id: sourceRunId,
  });

  if (error) {
    console.error("agent dispatcher tick failed", error);
    return Response.json(
      { error: "Dispatcher tick failed." },
      { status: 500 },
    );
  }

  return Response.json({
    ok: true,
    source_run_id: sourceRunId,
    result: data?.[0] ?? {
      expired_claims: 0,
      pending_resume_requests: 0,
      ready_missions: 0,
    },
  });
};

const dispatcher = { fetch: handler };

export default dispatcher;

