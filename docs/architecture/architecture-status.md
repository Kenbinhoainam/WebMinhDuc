# MDV2-ARCH-01 — Current vs proposed architecture

> Snapshot correction, 28/11/2026: prototype is now `19ac2b365f2264399fde4312639127b8de80736f`. Its tracked source remains Sprint 1 v30; its root static artifact records Sprint 2 source `66b7603`. See [deployment audit](../../DEPLOYMENT-AUDIT.md). Older `08e2da4` references below identify the previous snapshot, not current HEAD.

**Status:** Draft inventory, NOT a production architecture decision.

## Verified existing prototype

Current tracked source in prototype uses React + TypeScript + Vite and client-side routing. It prerenders page HTML, has five locales and **mock** forms, mock ADMIN and synthetic content. The Sprint 2 feature branch has further UI/interaction changes, CI/test evidence and a separate Sites preview. Historical README may mention prospective Next.js migration, which was not implemented by that text alone.

## Production options (NOT approved)

Next.js frontend/SEO, Spring Boot business API, custom CMS versus Strapi/Payload alternative, PostgreSQL/other database, Meilisearch/Redis only if measured need. Host, retention, CV storage and 6-tab Google Sheets integration require a versioned ADR, diagram, API/data contract, authorization model and operational cost review. Sprint 1 confirmed intent for custom CMS; a third-party CMS is not a silently approved replacement.

## Next deliverables

- ADR for CMS choice and frontend/API boundaries
- Source of truth and ownership of jobs/content/forms between CMS/API
- Real authentication/security/file storage and PII retention policy
- Export idempotence/duplicate merging contract
- Approved performance/device/SEO acceptance
- Release architecture and deployment/rollback audit

Never infer real operational backend, CMS, API or upload just because a demo screen or GitHub Pages route exists. New code may start only after the relevant SDD/ADR and PO scope approval, and every resulting change must be pushed to GitHub.
