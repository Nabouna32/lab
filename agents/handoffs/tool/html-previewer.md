# Tool Worker checkpoint — HTML Previewer

- **State:** IMPLEMENTING
- **Branch:** `feat/tool/html-previewer`
- **Tool:** HTML Previewer
- **Scope:** local browser preview of user-provided HTML, with safe sandboxed rendering, reset/copy controls, EN/FR, catalog/registry/routes/SEO, domain tests and targeted browser E2E.
- **Processing:** local-only; no Loculary upload, storage, account or external service.
- **Challenge:** Existing HTML entity encoding does not let users inspect rendered HTML. A previewer adds distinct value for developers and content authors. Alternative considered: HTML formatter; rejected for now because robust formatting semantics would require either a new parser/dependency or a larger custom parser surface.
- **Security constraint:** preview must not grant same-origin access or script execution to the authored document. The implementation will use an iframe sandbox without `allow-scripts`/same-origin privileges and a restrictive document CSP where supported.
- **Next action:** implement the tool and integration on this branch, then run tests/CI/E2E and complete PR lifecycle.
