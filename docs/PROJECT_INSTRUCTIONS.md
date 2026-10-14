# Loculary — Product and Platform Context

This document contains project-specific product, platform and UX context. `AGENTS.md` is the single mandatory guide for assistant work in this repository. Keep shared collaboration and repository-wide technical rules there; this document provides additional product and platform context, not a competing instruction contract.

## Product principles
Browser/local-first; anonymous-first core usage; transparent processing; simple by default and powerful when needed; result-first UX; modern, polished and visually engaging design; meaningful animations, transitions and micro-interactions; mobile/tablet/desktop/large screens are first-class; accessibility and reduced-motion preferences; French and English initially with extensible i18n/RTL; AI is optional.

## Architecture
Think in three product layers: public discovery, tool execution, personal account/personalization. Think in three tool levels: small tools, advanced tools, mini-applications.

## Security and privacy
All client data is untrusted. Server validation and authorization are mandatory. Never put secrets in frontend, Git, docs or tests. Tools declare capabilities and processing/privacy classification. Sensitive data remains local unless remote processing is required and explicitly disclosed.

## Platform constraints
- Loculary currently uses Supabase on the Free Plan.
- Supabase's leaked-password protection cannot be enabled on the current Free Plan. This is a plan limitation, not an unaddressed implementation omission. Do not treat the corresponding Supabase advisor warning as something that can be fixed without changing plan/features.
- If the project later moves to a plan that supports the feature, re-evaluate and enable leaked-password protection as part of the security hardening work.
- Free-plan constraints must be considered when evaluating Supabase architecture, request volume, egress, database size, Edge Functions and other usage-sensitive designs.

## Performance and accessibility
Progressively load tools. Use Workers, WASM and chunking where justified. Provide truthful progress and cancellation. Support slow connections and graceful degradation. Target WCAG 2.2 AA and Core Web Vitals. Do not make the whole product worse because one tool is heavy.

## Current UX/UI direction

Loculary's accepted visual direction is **Material 3 Expressive**, as defined by DEC-029 and the [design-system contract](DESIGN-SYSTEM.md). Follow that contract for shared component behavior, iconography, semantic color, typography, motion, palette rules and light/dark contrast. It describes the intended direction, not a claim that the current UI already conforms.

The product remains a task-first digital toolbox: help people find a tool, figure out how to accomplish something, or discover what's possible. The homepage prioritizes search and action; tool pages prioritize the task, result and useful next actions over documentation or generic discovery. See the [UX specification](UX.md) for the canonical journey and composition guidance.

Shared foundations should make the experience coherent without forcing every tool into the same layout or interaction model. Challenge, refactor or replace existing screens when they obstruct the validated direction. Preserve anonymous-first core usage, processing transparency, privacy, WCAG 2.2 AA, responsive desktop/tablet/mobile experiences, reduced-motion support and extensible i18n. Keep the brand mark distinct from functional interface iconography.
