import postgres from "npm:postgres@3";
import { withSupabase } from "npm:@supabase/server@1";

type TickResult = {
  expired_claims: number;
  pending_resume_requests: number;
  ready_missions: number;
};

const dbUrl = Deno.env.get("SUPABASE_DB_URL");
if (!dbUrl) throw new Error("SUPABASE_DB_URL is not configured.");

const sql = postgres(dbUrl, { prepare: false, max: 1 });

export default {
  fetch: withSupabase({ auth: "secret" }, async (req) => {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed." }, { status: 405 });
    }

    const sourceRunId =
      req.headers.get("x-dispatch-run-id") ?? crypto.randomUUID();

    try {
      const rows = await sql.unsafe(
        "select * from private.agent_dispatcher_tick($1, $2)",
        ["edge_function", sourceRunId],
      ) as TickResult[];

      return Response.json({
        ok: true,
        source_run_id: sourceRunId,
        result: rows[0] ?? {
          expired_claims: 0,
          pending_resume_requests: 0,
          ready_missions: 0,
        },
      });
    } catch (error) {
      console.error("agent dispatcher tick failed", error);
      return Response.json(
        { error: "Dispatcher tick failed." },
        { status: 500 },
      );
    }
  }),
};
