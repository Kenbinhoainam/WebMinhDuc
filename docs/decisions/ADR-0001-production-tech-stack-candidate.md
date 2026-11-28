# ADR-0001 — Production Tech Stack Candidate (KT01–KT06)

**Project:** Website Minh Đức V2  
**Date:** 28/11/2026  
**Revision:** v0.1.1 — corrected KT02 from NestJS to Spring Boot by Project Owner  
**Decision status:** **PO SELECTED DIRECTION / DRAFT ARCHITECTURE — NOT PRODUCTION BASELINE APPROVAL**  
**Review tracking:** [Issue #16](https://github.com/Kenbinhoainam/WebMinhDuc/issues/16)  
**Applies to:** prospective production engineering ONLY. Existing React/TypeScript/Vite prototype and its approved Sprint 2 UI SDD are not changed.

## 1. Owner selections

| ID | Selected option | What has been decided | What remains open |
|---|---|---|---|
| KT01=A | **Next.js + TypeScript** | Preferred production web UI and SEO framework | Next.js version, routing/rendering strategy, UI migration vs reuse, deployment details |
| KT02=A | **Spring Boot** | Preferred business API/backend framework; **supersedes KT02=B NestJS** from the earlier reply | Java runtime/version, Spring Boot version, project modules, API/auth architecture |
| KT03=A | **Custom-built CMS** | Build CMS tailored to Minh Đức; aligns with Sprint 1 customer-confirmed CMS-01 | Module scope, data ownership, implementation arrangement, staffing/cost, Admin UI |
| KT04=A | **PostgreSQL** | Preferred relational primary database | Versions, migrations, hosting, encryption, partition/schema strategy, backups |
| KT05=A | **Add search/cache only on demonstrated need** | Do not include Meilisearch or Redis by default | Measured thresholds, growth assumptions, test methodology, future decision |
| KT06=A | **Self-managed VPS/Cloud** | Operate hosting/infrastructure with own responsibility | Provider, topology, OS/network, backups, availability, security, monitoring, recurring cost |

**Explicit supersession:** On 28/11/2026 the PO initially replied `KT02=B — NestJS`, then explicitly changed that selection to `KT02=A — Spring Boot`. The latter is the current PO choice for this candidate; NestJS is no longer the selected backend. This is **not a claim** that existing production source has been migrated or that a production ADR has been approved.

## 2. Evidence and consistency with existing source

- Sprint 1 customer-confirmed [Requirements Register v0.2](https://github.com/Kenbinhoainam/WebMinhDuc/blob/docs/sprint1-closure-20261127/docs/sprint-1/requirements-register.md) identifies custom CMS (**CMS-01**), a single ADMIN role type, five public locales, six forms, distinct intake queues, deduplication and Google Sheets export requirements.
- [MDV2-REQ-01 v0.1.0 DRAFT](../requirements/master-requirements.md) is the candidate master, **not** a signed production baseline.
- [MDV2-TECH-01](../specifications/technical/MDV2-TECH-01.md) and [MDV2-ARCH-01](../architecture/architecture-status.md) identify Next.js and Spring Boot as proposed, with PostgreSQL and optional cache/search under review. KT01/KT02/KT04/KT05 are directionally consistent with those proposals.
- Contractor document **HR-WEB-01 v1.2** suggested Next.js + Spring Boot, with CMS custom/Strapi/Payload alternatives and search/cache only if needed; it is historical **reference**, NOT the project's master requirement.
- Sprint 1 **O10**, MDV2-DEC-002, MDV2-DEC-005 and MDV2-DEC-010 remain open until detailed architecture, CMS responsibilities, commercial boundaries and hosting are reviewed and approved.
- The prototype is currently React + TypeScript + Vite with simulated flows. Do **not** migrate the prototype to Next.js, introduce a Spring Boot backend or connect real applicant data as a side effect of this candidate ADR.

## 3. Candidate system boundaries (to validate, not implementation approval)

```text
Visitors / company / workers
            |
  Next.js + TypeScript (public website, SEO, 5 locales)
            |
        Versioned HTTPS API
            |
  Spring Boot (business workflows and security)
      |               |
      |               +-- Custom CMS content management capability
      |                   (may use the same Spring Boot service)
      |
      +-- PostgreSQL (authorized data, audit and migrations)
      |
      +-- Authorized secure object/file storage (selection pending)
      |
      +-- Google Sheets export integration (6 tabs, pending contract)

Future optional: Redis / Meilisearch only after load/use-case analysis.
Deployment: approved self-managed VPS/Cloud topology; not GitHub Pages for API.
```

**Preferred implementation hypothesis, NOT final ADR:** keep jobs, submitted applications, deduplication, exports and access decisions under Spring Boot; have the custom CMS manage approved editorial content, media and translations. The CMS admin UI may be implemented in Next.js and backed by the same Spring Boot API to prevent duplicate business administration. Do **not** automatically create another backend, separate CMS database, a microservices network or extra user roles.

## 4. Existing confirmed requirements protected by the choice

- **5 locales:** vi (source), en, zh-Hans, ko, ja; ADMIN interface Vietnamese; translation reviewed before publication; labeled Vietnamese fallback.
- **6 forms:** F01–F06, exactly their confirmed required/optional field sets; F03 job ID bound from job, not a mandatory manually typed field; F04/F06 optional attachments with defined file count/types/size.
- **ADMIN:** one permission-role type, though account count and authentication details remain open; workflow assignees/departments are business attributes rather than extra login roles.
- **Case processing:** F03 duplicate by normalized phone + job ID; manual merge before export; exact conflict/rollback/block scope still open.
- **Google Sheets:** manual and daily export into six operational tabs, manual retry after scheduled failures; destination, mapping, idempotency and privacy remain open.
- **Quality and delivery:** responsive devices, SEO/AEO, privacy, secure file storage, audit, backup, approved AC/HD and release controls must be specified/tested separately; prototype mock behaviors are not evidence for production.

## 5. Architecture and commercial approval gates

Before production implementation:
1. Produce and approve an updated architecture diagram and module boundaries, including custom CMS data ownership and ADMIN UI.
2. Specify API, database migrations, authorization, security/privacy, file storage, forms, merge/Sheets export and operational contract.
3. Select runtime versions/build tools, VPS/Cloud provider, backup/restore and monitoring topology with quantified costs.
4. Define environment strategy (local/dev/staging/production), repeatable Next.js/Spring Boot builds, CI/CD, releases and rollback.
5. Complete the commercial feature-by-feature mapping (including CMS-01…15, AI optionality), test/acceptance matrix and PO/authorized customer approval.
6. Link the approved version to relevant Issues, SDD, test cases and acceptance. Only then may coding agents bootstrap production code in approved scope.

**No modification to production Master Requirements, existing deployed prototype, Pages configuration, or approved SDD is authorized by this candidate.**

## 6. Decision outcome

- **Confirmed today:** the PO explicitly prefers options KT01=A, KT02=A, KT03=A, KT04=A, KT05=A, KT06=A; **KT02=B NestJS is superseded**.
- **Still pending:** final versioned Production Architecture Baseline, exact implementation details, detailed scope/commercial approval, hosting provider, operational requirements, integration and acceptance.
- **Next:** architecture review → impact/cost estimate → PO sign-off via new GitHub decision → update technical requirements/ADR baseline → implementation SDD → production code.

See [Impact Assessment](../architecture/KT01-KT06-impact-assessment.md) and [Issue #16](https://github.com/Kenbinhoainam/WebMinhDuc/issues/16).
