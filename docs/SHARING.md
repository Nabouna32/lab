# Utiluna — Sharing Specification

## Purpose

Sharing is a lightweight utility feature of Utiluna. It should make it easy to send someone either:

1. the tool itself, ready to use from its initial state; or
2. the current tool state/result, when that state can be represented safely and usefully.

Sharing is not intended to turn Utiluna into a social network.

## User experience

The tool page may expose a small **Share** action near other contextual actions.

The first interaction can offer:

- **Share this tool** — opens the normal tool URL.
- **Share this result** — available only when the current tool state is safely shareable.

On devices supporting the Web Share API, Utiluna should prefer the native share sheet. Otherwise it should provide a clear copy-link action.

The share action should remain visually secondary to the tool itself.

## Sharing levels

### Level 1 — Tool URL

Every public tool can share its normal URL.

Example:

`https://utiluna.example/tools/percentage`

No tool state is included.

### Level 2 — Configured state

A tool may encode a small deterministic configuration in the URL.

Example:

`/tools/percentage?base=180&rate=25`

The recipient can open the same tool with the inputs restored.

### Level 3 — Result/state

Where useful, a tool may encode enough deterministic state to reproduce or display the current result.

The implementation should prefer reproducibility over storing generated content remotely.

## State serialization rules

A tool should only place state in a share URL when all of the following are true:

- the state is reasonably small;
- the state is deterministic or has a well-defined representation;
- the state is not sensitive or private;
- exposing it in browser history, logs, referrers or copied links is acceptable;
- the URL remains practical to copy and share;
- restoring the state does not create an unsafe side effect.

Do **not** serialize passwords, authentication material, private tokens, or sensitive personal data into share URLs.

Large binary content should not be forced into URLs. A future tool may need a dedicated sharing mechanism, but that requires an explicit product and privacy decision.

## Platform contract

The shared ToolPage shell may provide the common Share action, but the executable tool remains responsible for its own shareable state.

A future capability contract may expose concepts such as:

- `canShareTool`;
- `canShareState`;
- `serializeShareState()`;
- `restoreShareState()`.

These are design concepts, not current API requirements.

The platform must not introduce a generic serializer prematurely. Concrete tools should drive the contract.

## Privacy and trust

Sharing must respect Utiluna's local-first and transparency principles.

If a share operation sends data to an external service, stores data server-side, or creates a persistent public object, the UI and documentation must make that behavior explicit.

For purely URL-based local sharing, no Utiluna storage is required.

## Future extensions

Possible later additions include:

- QR-code presentation for a share link;
- richer collection sharing;
- share previews / Open Graph metadata;
- server-backed links for data too large for URLs;
- expiring or revocable shared objects.

These are not current commitments.
