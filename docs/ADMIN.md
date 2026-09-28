# Loculary — Administration

The admin area is a real authenticated and authorized backend, not a hidden public page.

Areas: dashboard, tools and lifecycle, categories and tags, users and permissions, comments and reports, proposals, contributors, analytics, settings and audit log.

Permissions are granular rather than a single admin flag. Examples: tools.read, tools.create, tools.edit, tools.publish, tools.archive, comments.moderate, users.view, users.suspend, analytics.view, settings.manage.

Sensitive administrative changes record who changed what, when and why. Admin manages metadata, content, lifecycle and configuration; executable tool code remains in Git.
