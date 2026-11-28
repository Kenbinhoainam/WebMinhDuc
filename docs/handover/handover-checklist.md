# MDV2-HO-01 — Handover checklist (draft)

**Purpose:** index handover obligations, not evidence that production handover has occurred.

| Artifact | Expected evidence | Current status |
|---|---|---|
| Source and version history | GitHub commits/branches/PRs, reviewed release/tag | Historical source exists; formal release tags not yet created |
| Database schema/migrations | Verified source & restoration instructions | Production backend not in prototype |
| Configuration/secrets | Redacted .env.example, secrets passed out-of-band | Pending private secured channel |
| API/integration contract | OpenAPI, authentication, error cases, Sheets mapping | Production design pending |
| Design/brand/assets | Editable assets and publication rights | Rights to be verified |
| CMS/ADMIN handbook | Reproducible workflows and role model | Production CMS pending |
| Build/deployment/rollback | Exact command, environment, verified deploy receipt | Prototype CI exists; production TBD |
| QA/defects | Case IDs, actual run logs, UAT signoff | Sprint 2 QA incomplete/blocked |
| Backup/restore | Backup artifact, retention and restoration test | Production pending |
| Infrastructure/account/licenses | Ownership and access transfer | Pending secure owner agreement |
| Training | Attendee, exercises, acknowledged handoff | Pending |
| Support/warranty | Scope, SLA/date/cost signed | Pending |
| Requirements traceability | MDV2 req → SDD → AC → commit/PR/release | Initial register drafted, full reconciliation pending |
| Variances/exclusions | Signed change record and defect exception list | Decision register ongoing |

Source: draft customer acceptance HD-01…HD-14; preserve exact formal acceptance wording in a restricted approved baseline before contractual use.

**Mandatory GitHub evidence:** every AI edit to source/doc/test/config is committed and pushed. Private customer data must remain in an approved PRIVATE repo; if access is not configured report BLOCKED_PRIVACY. The existence of this checklist does not mean items were delivered or accepted.