# Impact Assessment — KT01–KT06 Production Tech Stack Choice

**Date:** 28/11/2026 · **Status:** DRAFT for [Issue #16](https://github.com/Kenbinhoainam/WebMinhDuc/issues/16). Exact costs and effort are not yet estimated; impacts below describe technical direction, not a budget commitment.

## Main change in this conversation

**KT02 changed from B (NestJS) to A (Spring Boot).** The historical technical drafts already named Spring Boot as a proposed API platform, so the new preference aligns with that earlier *proposal*. This does not override the Sprint 1 customer-confirmed custom CMS requirement or mean production backend code already exists.

| Area | Expected consequence / benefit | Risks or work to authorize |
|---|---|---|
| KT01 Next.js / TypeScript | SEO/server rendering and reusable React concepts; opportunity for typed routes and five locales | Existing Vite SPA/SSR prototype code is not a drop-in production application. Audit component portability, routing, forms, SEO, hydration and media before migrating |
| **KT02 Spring Boot** | Business workflow, server validation, access/audit, form/CV API, export handling in Java ecosystem | Separate Java backend from TypeScript frontend requires explicit HTTP API/DTO/schema contracts, local/staging environment, build/test, observability and JVM sizing. No NestJS implementation should be started |
| KT03 custom CMS | Matches previously confirmed CMS preference; fine-grained content/translation workflows | Higher own engineering, QA, security, UX and maintenance responsibility. Avoid accidentally implementing full advanced CMS-01…15 or duplicate permission/data systems |
| KT04 PostgreSQL | Relational transactions and referential constraints for jobs/submissions/audit; migrations possible | Define schemas, transaction scope for merges/exports, migrations, backups, read/write users, encryption, recovery and data retention |
| KT05 defer Meilisearch/Redis | Lower initial topology, cost and sync complexity; PostgreSQL queries/indexes may suffice initially | Define realistic search/filter/performance tests; add external search/cache only on measured and approved needs |
| KT06 self-managed VPS/Cloud | Control over infrastructure, deploy and backup policy | Operational security, patching, monitoring, secret management, TLS, offsite backups, incident response, DR/rollback, release owner, recurring hosting charges |
| Cross-cutting Next.js + Spring Boot | Clear frontend/business separation and independently tested contracts | CORS/cookie/session/CSRF model, API security, Next.js hosting choice, network/firewall, authenticated CMS admin, service boundaries and CI compatibility |
| Prototype/Design Freeze | Can continue React/Vite UI work without architecture churn | Production portability must be assessed after UI Design Freeze; changing production stack must not silently modify active prototype Pages build |
| Marketing/business scope | Preserves core F01–F06, five locales and ADMIN operation | Confirm owner of jobs/content/submissions; implement one ADMIN role type only; no real data until privacy, file and backup policies are signed |
| Commercial and schedule | Stack is assessable for costing; one service may host CMS features instead of multiplying services | Custom CMS and VPS operations increase responsibility; obtain estimate/maintenance/support terms, don't infer fixed price or deadline |

## Technical decisions still required (not magically closed by selecting frameworks)

- **TECH-01:** Supported Java LTS and Spring Boot version; Gradle/Maven, modular monolith vs split components.
- **TECH-02:** Supported Node/Next.js versions, SSR/ISR/SSG strategy, use of React/Vite prototype assets and acceptance for cross-framework migration.
- **TECH-03:** Is custom CMS housed in the same Spring Boot API or a separate authorized component? Content source of truth, media storage, translation review and ADMIN UI.
- **TECH-04:** PostgreSQL version, schema ownership, backups, retention, migrations, audit logs and rollbacks.
- **TECH-05:** Search performance baseline, data volumes, future criteria for adding Meilisearch/Redis.
- **TECH-06:** VPS/Cloud provider, geography, node sizing, network/TLS, secrets, patches, uptime, monitoring, backup and recovery objectives, deployment model.
- **TECH-07:** REST/OpenAPI contract, Next.js/API auth model, F01–F06, CV/storage scanning, duplicate/merge, six Sheets tabs and integration behavior.
- **TECH-08:** MVP vs optional CMS/AI/CRM modules, cost/maintenance, UAT and release plan.

## Risk-adjusted sequencing

1. **Now:** focus UI prototype Design Freeze; do not alter its React/Vite implementation solely because production Next.js was chosen.
2. **Before production code:** produce comparative ADR/diagram/API/CMS boundaries; get security/ops/cost estimate and Owner's architecture approval.
3. **After approval:** bootstrap production Next.js, Spring Boot, custom CMS capability and PostgreSQL in scoped branch(es); integrate and verify small end-to-end F01/F03 slices first.
4. **Only after measured need:** consider Redis or Meilisearch as optional new decisions.

**No hard promises:** Do not claim a latency of under 50 ms, production SEO rank or a delivery date without an approved measurement and evidence.

Related: [ADR-0001](../decisions/ADR-0001-production-tech-stack-candidate.md), [MDV2 Decision Register](../decisions/decision-log.md).
