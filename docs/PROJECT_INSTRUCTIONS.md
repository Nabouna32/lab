# Loculary — Product and Platform Context

This document contains project-specific product, platform and UX context. `AGENTS.md` is the single mandatory guide for assistant work in this repository. Keep shared collaboration and repository-wide technical rules there; this document provides additional product and platform context, not a competing instruction contract.

## Product principles
Browser/local-first; anonymous-first core usage; transparent processing; simple by default and powerful when needed; result-first UX; modern, polished and visually engaging design; meaningful animations, transitions and micro-interactions; mobile/tablet/desktop/large screens are first-class; accessibility and reduced-motion preferences; French and English initially with extensible i18n/RTL; ads never obstruct the main task; AI is optional.

## Architecture
Think in three product layers: public discovery, tool execution, personal account/personalization. Think in three tool levels: small tools, advanced tools, mini-applications.

## Security and privacy
All client data is untrusted. Server validation and authorization are mandatory. Never put secrets in frontend, Git, docs or tests. Tools declare capabilities and processing/privacy classification. Sensitive data remains local unless remote processing is required and explicitly disclosed.

## Platform constraints
- Loculary currently uses Supabase on the Free Plan.
- Supabase's leaked-password protection cannot be enabled on the current Free Plan. This is a plan limitation, not an unaddressed implementation omission. Do not treat the corresponding Supabase advisor warning as something that can be fixed without changing plan/features.
- If the project later moves to a plan that supports the feature, re-evaluate and enable leaked-password protection as part of the security hardening work.
- Free-plan constraints must be considered when evaluating Supabase architecture, request volume, egress, database size, Edge Functions and other usage-sensitive designs.

## Database CI

Supabase database validation and production migration release are manual-only. When working on migrations, database tests, configuration or seed data, run `.github/workflows/supabase-database.yml` in GitHub Actions with mode `validate` on the working branch and verify it before merge. Production migrations are applied only by a separate manual run from `main` with mode `release`; that mode repeats validation and is protected by the `supabase-production` environment. The ordinary PR CI is not a database validation gate.

## Performance and accessibility
Progressively load tools. Use Workers, WASM and chunking where justified. Provide truthful progress and cancellation. Support slow connections and graceful degradation. Target WCAG 2.2 AA and Core Web Vitals. Do not make the whole product worse because one tool is heavy.

## Current UX/UI direction

The accepted shared visual-system direction is **Material 3 Expressive**, as defined by DEC-048 and `docs/DESIGN-SYSTEM.md`. Apply it consistently to shared foundations and components—including headers/navigation, buttons, fields, switches, menus, dialogs/popups, cards, feedback, typography, semantic color, iconography, states, surfaces and motion—to create a polished, Android-inspired web-app experience. Do not treat Expressive as a palette-only change or copy Android layouts literally.

The default semantic palette uses Material Purple seed #6750A4, and Roboto is the validated default interface typeface. Keep both validated rainbow treatments with distinct roles: MCU-generated tonal Rainbow colors for expressive surfaces/frame backgrounds, and Loculary's saturated direct seven-color palette for vivid category pills, badges and compact differentiation. Do not treat either as a replacement for the other or let category colors override semantic success/warning/error roles. Offer curated palette choices rather than an unrestricted color picker, with deliberate light/dark mappings and contrast checks. Anonymous preferences should persist locally; account synchronization is a planned behavior for signed-in users, not an implemented capability until the relevant settings and persistence are delivered.

Loculary remains a task-first digital toolbox organized around the user's need: find something, figure out how to do something, or discover. The preferred journey is **need → find/explore → tool → action → result → next action**. The homepage should be action/search-first; tool pages prioritize the tool, result and relevant actions over documentation or discovery content.

Expressive foundations standardize the shared platform without forcing every tool into an identical layout or interaction model. Existing screens and components may be challenged, refactored or replaced when they obstruct the validated direction. Preserve anonymous-first core usage, processing transparency, privacy, WCAG 2.2 AA, responsive desktop/tablet/mobile experiences, reduced-motion support and extensible i18n. The brand mark remains distinct from functional interface iconography.
