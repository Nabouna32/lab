# Utiluna — Tool Architecture

## Model

Utiluna supports three levels: small tools, advanced tools, and mini-applications. All share a common platform contract while retaining tool-specific UX and visual identity.

## Contract

A tool should declare identity, slug, localized content, complexity, version, categories, centrally managed tags and aliases, SEO metadata, examples, processing/privacy classification, capabilities, browser requirements, offline capability, sharing/state behavior, related tools, accessibility/performance expectations, lifecycle state and contributor attribution.

## UX contract

Tool pages prioritize inputs, result, actions, explanation, then documentation. Inputs should prevent impossible values where practical. Errors are clear and actionable. Reset is systematic. Sharing may represent a blank tool, configured state, or result/state when safe.

## Capabilities

Capabilities can include local processing, file input, clipboard, camera, microphone, geolocation, external network, account data and server/database access. Access must be explicit and enforceable.

Capabilities are runtime permissions, not only descriptive metadata. The ToolPage provides a tool-scoped runtime containing exactly the capabilities declared by the resolved tool. Platform APIs are exposed through this runtime rather than being called directly by tool implementations.

The runtime currently enforces the clipboard capability. Additional browser, storage and network capabilities should follow the same pattern as their platform abstractions are introduced.

### Access

Access is a separate axis from processing:

- `anonymous` — usable without an account;
- `account` — requires an authenticated account;
- `premium` — requires the relevant paid entitlement.

A server-backed or external tool is not automatically premium. Processing location and access policy remain independent decisions.

## Processing

Every tool identifies local, external-service, Utiluna-server or hybrid processing and explains what data is transmitted, where and why.

## Heavy tools

Use Web Workers, WebAssembly, chunking and streaming when justified. Simple tools must not inherit heavy infrastructure merely for consistency.


## Registry and execution modules

Published tools are resolved through a central registry. The registry maps a stable tool identifier to an independently loadable implementation module.

A module may contain a custom UI, tool-specific logic and tool-owned editorial/documentation content; it is not required to conform to a generic form renderer. The registry resolves the executable tool and its editorial component together so tool-specific content does not accumulate in a central switch. The generic route and ToolPage shell provide shared platform infrastructure such as metadata, trust indicators, documentation, related tools and future common actions.

The registry is the executable bridge between the catalog and tool implementations. Catalog metadata and future database-backed product data must not be treated as a substitute for executable module code.

New published tools should therefore normally require:

1. a catalog definition;
2. a registered implementation module with its tool-owned editorial component;
3. automated registry coverage;
4. the relevant tool tests.

The public route is resolved dynamically from the tool category and slug, allowing the catalog to scale without one App Router page per tool.
