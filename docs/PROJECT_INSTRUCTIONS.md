# Loculary — Product and Platform Context

This document keeps only project-specific constraints that are not already covered by the canonical product, architecture, UX, privacy, internationalization and design-system documents. `AGENTS.md` remains the single mandatory guide for assistant work.

## Supabase platform constraints

- Loculary currently uses Supabase on the Free Plan.
- Supabase's leaked-password protection cannot be enabled on the current Free Plan. This is a plan limitation, not an unaddressed implementation omission. Do not treat the corresponding Supabase advisor warning as something that can be fixed without changing plan/features.
- If the project later moves to a plan that supports the feature, re-evaluate and enable leaked-password protection as part of the security hardening work.
- Free-plan constraints must be considered when evaluating Supabase architecture, request volume, egress, database size, Edge Functions and other usage-sensitive designs.
