# Tool Worker checkpoint — HTML Previewer

- **State:** TESTING
- **Branch:** `feat/tool/html-previewer`
- **Tool:** HTML Previewer
- **Scope:** local browser preview of user-provided HTML, with safe sandboxed rendering, reset/copy controls, EN/FR, catalog/registry/routes/SEO, domain tests and targeted browser E2E.
- **Processing:** local-only; no Loculary upload, storage, account or external service.
- **Challenge:** Existing HTML entity encoding does not let users inspect rendered HTML. A previewer adds distinct value for developers and content authors. Alternative considered: HTML formatter; rejected for now because robust formatting semantics would require either a new parser/dependency or a larger custom parser surface.
- **Security constraint:** preview must not grant same-origin access or script execution to the authored document. The implementation will use an iframe sandbox without `allow-scripts`/same-origin privileges and a restrictive document CSP where supported.
- **Implementation:** tool runtime, isolated preview document helper/tests, EN/FR messages, catalog, registry, localized routes, SEO metadata and targeted Playwright coverage are present.
- **Security:** sandboxed iframe plus restrictive CSP; no JavaScript, same-origin access, frames, objects or remote image/media/font resources from preview content.
- **Next action:** inspect the complete branch diff, open the focused PR, then verify CI and browser E2E; fix only worker-introduced failures and merge when all required checks are green.
