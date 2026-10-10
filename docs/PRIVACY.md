# Loculary — Privacy and Processing Principles

## Goal

Loculary's privacy model is based on a simple principle:

> **Transparency is part of trust.**

Users should not have to guess what Loculary does with their data. The product should make data flows understandable, inspectable, and controllable.

The default engineering position is:

> **If a tool can process data locally, keep the data local.**

This document is an engineering/product direction, not a legal privacy notice. Actual public launch documentation must be reviewed against implemented data flows and applicable law.

## Processing classifications

Every tool must declare its processing classification:

### Local

All relevant processing occurs on the user's device.

User-facing message:

> 🔒 **Vos fichiers restent sur votre appareil.**

Where appropriate, the UI should explain that processing occurs locally and whether the tool uses browser APIs, Web Workers, WebAssembly, or other client-side technology.

### External

The browser sends selected data to an external provider.

The tool must explain:

- provider;
- destination/domain;
- data transmitted;
- purpose;
- storage/retention information when known;
- service dependency;
- relevant provider privacy policy;
- failure/fallback behavior.

### Loculary server

The operation requires Loculary infrastructure.

The same transparency requirements apply, including:

- what data is sent;
- why it is required;
- where it is stored;
- retention period;
- who can access it;
- deletion behavior;
- relevant security controls.

### Hybrid

Part of the operation occurs locally and part through a remote service.

The boundary must be explicit. The UI must not describe a hybrid operation as simply "local".

## Mandatory processing declaration

Processing classification is part of the Tool contract, not optional marketing metadata.

A tool definition should be able to declare at minimum:

- processing location;
- transmitted data categories;
- external providers;
- storage behavior;
- retention;
- required browser permissions;
- capabilities used;
- fallback behavior;
- privacy-sensitive operations.

This metadata should be available to the UI, search/filtering, documentation, auditing, and automated checks.

## Privacy detail view

The short status indicator should link to a tooltip, expandable explanation, or dedicated privacy/processing view.

The detailed view should answer, in plain language:

1. Where is the processing performed?
2. What data leaves the device?
3. Where is it sent?
4. Why is it needed?
5. Is it stored?
6. For how long, if applicable?
7. Which third parties are involved?
8. What browser permissions are requested?
9. What happens if the external service is unavailable?
10. Can the user use the tool without the optional data?

Technical details may be available for users who want deeper inspection.

## Data minimization

If a tool does not need a data field, it must not request it.

Inputs should be limited to the minimum information required to perform the operation.

Client-provided data must always be considered untrusted. Server-side validation and authorization remain mandatory even when the client UI already validates the same input.

## Browser permissions

Tools must explicitly declare required browser capabilities, such as:

- file access;
- clipboard;
- camera;
- microphone;
- geolocation;
- notifications.

Permissions should be requested only when needed and as close as practical to the user action requiring them.

A tool must not request broad permissions merely for convenience.

## Local file processing

For local file tools, the product should clearly communicate the local boundary.

Preferred message:

> 🔒 **Vos fichiers restent sur votre appareil.**

This claim must be technically justified. Local-only tools should be auditable through code review and automated/static checks where practical.

A tool must not be classified as local-only if it can transmit user file contents, metadata, or derived sensitive data to a remote service.

## Account data domains

User data should be logically separated into domains:

- identity/authentication;
- preferences and personalization;
- product data such as favorites and collections;
- synchronized history;
- community content;
- moderation/security records;
- analytics/telemetry.

This separation should support least-privilege access, retention rules, deletion, export, and auditing.

## Transparency dashboard

Authenticated users should eventually have a dedicated privacy/data dashboard.

The dashboard should allow a user to see, in understandable form:

- account and identity data;
- stored preferences;
- favorites;
- collections;
- synchronized history;
- community contributions;
- ratings/comments;
- public profile data;
- privacy and consent choices;
- relevant analytics/personalization data;
- connected authentication providers;
- active sessions where feasible;
- data retention/deletion state.

The goal is not an obscure legal settings page. Users should be able to understand what Loculary knows about them and why.

## Account deletion

Account deletion should aim for complete deletion of account-associated data.

The deletion workflow should show what will be deleted, what may need to be anonymized for technical/legal reasons, and what consequences are irreversible.

When deletion of a specific record is genuinely impossible or inappropriate, the system should anonymize it as strongly as practical and document the reason.

Deletion must cover relevant domains, including:

- identity/account data;
- preferences;
- favorites;
- collections;
- synchronized history;
- public profile data;
- ratings/comments where technically and legally possible;
- contributor attribution where applicable;
- analytics identifiers where applicable.

The implementation must be designed to avoid orphaned personal data.

### Implemented account deletion behavior

The current account implementation permanently deletes the Supabase Auth user rather than using a soft-delete. The `public.profiles` row and administrator role bindings reference `auth.users` with cascading deletion. Administrative audit records are security records and are not deleted with the account: a `BEFORE DELETE ON auth.users` trigger clears polymorphic user-target references in the same transaction, while the `actor_user_id` foreign key sets actor references to null. The event itself is retained so the audit history remains useful. If deletion is rejected, the trigger's audit cleanup rolls back with the deletion. This retention is limited to the audit record and its non-identifying metadata; it is not a general retention rule for future user-owned data.

## Data export

Users should be able to export their personal data in a structured, documented format.

The export must include the relevant user-owned domains and explain data that is excluded or transformed.

Exports are sensitive and must require appropriate authentication and authorization.

## Data import

Users may eventually be able to import supported Loculary data.

Imports must be treated as untrusted input.

Validation must protect against:

- malformed data;
- oversized payloads;
- unexpected object structures;
- malicious values;
- authorization bypass;
- cross-account data injection;
- duplicate/conflicting records;
- unsafe content.

Imports should never be allowed to overwrite protected system data or another user's data.

## Encryption and secrets

Protection should be proportional to sensitivity.

The architecture should use:

- encryption in transit for network communication;
- platform/provider encryption at rest where available;
- strong password handling through established authentication providers/libraries rather than custom cryptography;
- encryption or tokenization of especially sensitive application data where justified;
- strict secret management for credentials and API keys.

Cryptography should use established, maintained primitives and libraries. Loculary should not invent its own encryption scheme.

## Cookies and consent

Consent controls should be understandable and granular without becoming intentionally burdensome.

Users should have simple choices such as:

- **Tout accepter**
- **Refuser les cookies/traceurs non nécessaires**
- **Personnaliser**

The refusal path should be as easy as the acceptance path.

The product should not force users through dozens of partner-by-partner switches merely to refuse non-essential tracking.

Consent categories should distinguish at least:

- necessary;
- analytics;
- advertising;
- personalization.

The exact legal implementation must follow the jurisdictions served and the actual providers used.

## Analytics

Analytics should be privacy-minimized.

Default analytics must not collect raw tool inputs or sensitive user content.

Events should focus on product behavior, for example:

- tool opened;
- search performed;
- search returned no result;
- tool completed;
- feature used;
- technical error.

The analytics abstraction must make it possible to change providers without rewriting product code.

## Advertising

Advertising must not be treated as permission to expose tool inputs or personal content.

Ad technology should be isolated behind a provider abstraction such as:

`<AdSlot />` → `AdProvider`

The product should be able to disable or replace the provider without changing individual tool implementations.

## External API catalog

Every external integration should have a traceable catalog entry containing:

- provider;
- domain/endpoint;
- purpose;
- data transmitted;
- authentication model;
- privacy policy reference;
- retention behavior when known;
- cost/quota;
- fallback behavior;
- owner/maintainer;
- implementation location.

This catalog is an operational trust and cost-control mechanism.

## API secrets

API secrets must never appear in:

- frontend bundles;
- client-side environment variables intended for public exposure;
- Git history;
- documentation;
- tool metadata.

When a provider requires a secret, the backend must act as the controlled proxy/orchestration layer where appropriate.

Client-side APIs must be treated as public unless the provider explicitly documents a safe public model.

## Rate limiting and abuse protection

Rate limiting should be applied where an operation can create meaningful cost, abuse, enumeration, spam, or denial-of-service risk.

The limit should be proportional to the operation rather than globally restrictive.

Examples include:

- external API calls;
- authentication endpoints;
- account recovery;
- community submissions;
- comments;
- ratings;
- proposal creation;
- expensive server-side operations.

## Moderation automation

Automated moderation may classify content as:

- safe;
- suspicious;
- blocked.

Automation should not silently become the final authority for ambiguous cases.

Suspicious content should be reviewable by human moderators. Moderation actions must be auditable.

## Tool capability isolation

Tools should explicitly declare capabilities such as:

- local-processing;
- file-input;
- clipboard;
- camera;
- microphone;
- geolocation;
- network/external-api;
- account-data;
- database access.

A tool should receive only the capabilities it actually needs.

Tool code must not gain arbitrary access to:

- other users' data;
- account secrets;
- server credentials;
- unrelated tool state;
- internal administrative APIs.

## Trust philosophy

Loculary should aim to earn trust through three things:

1. **Privacy** — collect and transmit as little as reasonably possible.
2. **Transparency** — clearly explain what happens when data moves.
3. **Utility** — make privacy-preserving choices without making the product unnecessarily difficult to use.

The product should never ask users to trust blindly when the system can explain or expose the relevant information instead.

## Future legal/compliance work

Before broad public launch, privacy/legal documentation should be reviewed against the actual implementation, data flows, consent mechanisms, retention policies, and jurisdictions served.
