# Backoffice Admin

> **Status:** `planned`
> **MVP:** No (Phase 2)

## Overview

The backoffice admin panel provides internal tools for VisualStory team members to manage customers, monitor platform usage, and handle support operations. This is not a user-facing module — it is intended for internal operations and customer success teams.

## Planned Features

| Feature | Status | Summary |
|---------|--------|---------|
| Customer list | `planned` | Browse, search, and filter all registered users/workspaces |
| Customer detail | `planned` | View user profile, subscription tier, project count, usage metrics |
| Subscription management | `planned` | Override plans, apply credits, extend trials, manage refunds |
| Usage dashboard | `planned` | Platform-wide metrics: signups, active users, exports, revenue |
| Content moderation | `planned` | Review flagged presentations, manage abuse reports |
| Feature flags | `planned` | Toggle feature availability per user, workspace, or plan tier |
| Support tools | `planned` | Impersonate user (read-only), view error logs, trigger re-exports |

## Future Considerations

- **Audit log** — Track all admin actions for compliance
- **Role-based access** — Different admin roles (support, billing, engineering)
- **Automated alerts** — Notify on failed exports, billing issues, unusual activity
- **Analytics & reporting** — Cohort analysis, churn prediction, revenue dashboards

## Dependencies

- [auth/](../auth/) — Admin authentication (separate from user auth, or role-gated)
- [user-profile/](../user-profile/) — Customer data originates from user profile and subscription modules

## Notes

- This module is not part of MVP. Planning begins once the core product is stable.
- Consider using an existing admin framework (e.g., Retool, AdminJS) to speed up development.
