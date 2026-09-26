import { withSupabase } from "npm:@supabase/server";

type Action = "suspend" | "unsuspend";

type Payload = {
  action?: Action;
  targetUserId?: string;
};

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed." }, { status: 405 });
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

    if (action === "suspend") {
      const { data: allowed, error: permissionError } = await ctx.supabase.rpc(
        "has_admin_permission",
        { requested_permission: "users.suspend" },
      );

      if (permissionError || allowed !== true) {
        return Response.json({ error: "Forbidden." }, { status: 403 });
      }

      if (targetUserId === ctx.userClaims?.sub) {
        return Response.json({ error: "Cannot suspend yourself." }, { status: 400 });
      }

      const { data: targetRoles, error: rolesError } = await ctx.supabase
        .from("admin_user_roles")
        .select("role_key")
        .eq("user_id", targetUserId);

      if (rolesError) {
        return Response.json({ error: "Could not inspect target account." }, { status: 500 });
      }

      if (targetRoles?.some((role) => role.role_key === "super_admin")) {
        return Response.json({ error: "Cannot suspend a super administrator." }, { status: 409 });
      }
    } else {
      const { data: allowed, error: permissionError } = await ctx.supabase.rpc(
        "has_admin_permission",
        { requested_permission: "users.suspend" },
      );

      if (permissionError || allowed !== true) {
        return Response.json({ error: "Forbidden." }, { status: 403 });
      }
    }

    const { data: user, error: updateError } = await ctx.supabaseAdmin.auth.admin.updateUserById(
      targetUserId,
      { ban_duration: action === "suspend" ? "876000h" : "none" },
    );

    if (updateError) {
      return Response.json({ error: "Could not update the account." }, { status: 500 });
    }

    const { error: auditError } = await ctx.supabase.rpc("record_admin_audit", {
      audit_action: action === "suspend" ? "admin.user.suspended" : "admin.user.unsuspended",
      audit_target_type: "user",
      audit_target_id: targetUserId,
      audit_metadata: {
        banned_until: user.user?.banned_until ?? null,
      },
    });

    if (auditError) {
      return Response.json({ error: "Account changed but audit logging failed." }, { status: 500 });
    }

    return Response.json({
      ok: true,
      bannedUntil: user.user?.banned_until ?? null,
    });
  }),
};
