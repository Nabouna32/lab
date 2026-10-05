# Loculary — Performance

Performance is a product constraint and an experience-quality constraint. **Performance should enable richness, not become an aesthetic ideology that suppresses it.** Users should not pay in loading time, memory, complexity or cognitive load for capabilities they do not need, but visual richness may be justified when its experiential value warrants its cost.

The relevant question is not whether a visual or interactive feature has any cost, but whether its value justifies that cost and whether the experience can be optimized to preserve that value. Optimize before removing; measure before suppressing. A lighter implementation is not automatically a better experience, and **less costly does not mean empty**.

Tools are code-split and loaded on demand. Small deterministic tools should produce immediate local results. Heavy processing may use Web Workers, WebAssembly, chunking and streaming. Long operations expose truthful progress and cancellation when feasible. These techniques should be used to preserve responsive, rich experiences where appropriate, not only to minimize implementation weight.

Modest devices should not make the whole product ugly or artificially limited. Lightweight tools remain broadly available. Heavy tools may detect relevant capabilities, show minimum/recommended requirements, offer a lighter mode, or disable only when genuinely impossible. When adaptation is necessary, preserve the core character and usability of the experience rather than reducing it to a blank or degraded interface by default.

Slow connections receive progressive UI. External tools use appropriate timeout, retry, fallback and clear-error patterns. Offline capability is explicitly identified.

Performance budgets exist at platform/page, tool and heavy mini-application levels. Validation should cover low-end, normal and high-capability devices. Core Web Vitals are platform health indicators. Performance evaluation should consider responsiveness, visual continuity, interaction quality and perceived experience alongside raw loading and runtime metrics.

PWA compatibility should be anticipated but is not an MVP dependency. If pursued, evaluate offline value, installation, storage/cache complexity, update reliability, browser support and performance impact.
