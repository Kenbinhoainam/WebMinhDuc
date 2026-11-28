# MDV2-05 — Technical Specification (initial index)

**Version:** v0.1.0-DRAFT, 28/11/2026.
**Evidence:** previous prototype snapshot 08e2da4 contains React/TypeScript/Vite and prerender scripts. Current prototype 19ac2b3 retains that source but has newer Sprint 2 static output; no repository workflow file existed there before this task. GitHub-generated Pages publishing and QA-branch workflows are separate. See [deployment audit](../../../DEPLOYMENT-AUDIT.md). Feature branch Sprint 2 contains UI enhancements. This is **not production architecture approval**.

## Actual prototype
- React/Vite web app, client UI, build + prerender.
- Five locales, sample jobs, six mock forms, preview/admin-demo, no secure production database or server-only access policy evidenced.
- GitHub: source branches and PR evidence; gh-pages hosts build output, not canonical TypeScript source. Sites preview has separate deployment IDs and must be mapped to source Git SHA.
- No real CV upload, true appointment booking, CRM, Google Sheets operational export or AI integration is implied by mock flows.

## Proposed production boundaries (pending ADR)
- Frontend rendering/routing/SEO (Next.js or other documented/approved approach).
- Business API for forms/jobs/CV, server validation, authentication/authorization, duplicate/merge, data exports (Spring Boot proposed, not approved).
- Custom-written CMS was recorded as customer need; Strapi/Payload alternatives only by PO-approved ADR and impact analysis.
- Database, private file storage, audit/retention/backup, secrets, monitoring and recovery; no PII in public repo, analytics or error logs.
- Optional search/cache Meilisearch/Redis based on measured need and cost rather than promises such as 50ms.

## Required ADR and test gates
Architecture diagram, requirements-to-service ownership, DB schema/migrations, API contracts, six forms, CMS permission model, Sheets row mapping/idempotence/schedule zone/retry, PII deletion/retention, CSP/upload scanning, hosting/rollback, performance PERF-01, real-device/browser matrix, threat model. Separate technical and commercial approvals needed.

**Every changed code/doc/config/ADR MUST be pushed to an authorized GitHub branch and opened as a PR.**
