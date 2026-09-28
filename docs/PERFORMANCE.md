# Loculary — Performance

Performance is a product constraint. **La richesse doit être progressive.** Users should not pay in loading time, memory, complexity or cognitive load for features they do not need.

Tools are code-split and loaded on demand. Small deterministic tools should produce immediate local results. Heavy processing may use Web Workers, WebAssembly, chunking and streaming. Long operations expose truthful progress and cancellation when feasible.

Modest devices should not make the whole product ugly or artificially limited. Lightweight tools remain broadly available. Heavy tools may detect relevant capabilities, show minimum/recommended requirements, offer a lighter mode, or disable only when genuinely impossible.

Slow connections receive progressive UI. External tools use appropriate timeout, retry, fallback and clear-error patterns. Offline capability is explicitly identified.

Performance budgets exist at platform/page, tool and heavy mini-application levels. Validation should cover low-end, normal and high-capability devices. Core Web Vitals are platform health indicators.

PWA compatibility should be anticipated but is not an MVP dependency. If pursued, evaluate offline value, installation, storage/cache complexity, update reliability, browser support and performance impact.
