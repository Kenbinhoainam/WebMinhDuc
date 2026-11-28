# RISKS-AND-DEPENDENCIES

28/11/2026. Risk priority describes impact/urgency; it is not a Project-field mutation.

| ID / priority | Risk or dependency | Evidence / mitigation | Owner / status |
|---|---|---|---|
| R01 / P1 | Default source builds Sprint 1 while branch output serves Sprint 2 | `src/scripts/tests` unchanged from 08e2da4; publish 19ac2b3 records 66b7603. Preserve output, reconcile PR #3 source through reviewed integration | PO + integrator; REQUIRES_PO_APPROVAL |
| R02 / P1 | Docs merge can trigger live republish | Pages legacy prototype:/ uploads root; block merge until release impact approved, propose Actions migration | PO + DevOps; REQUIRES_PO_APPROVAL |
| R03 / P1 | Force push/direct writes insufficiently governed | All branch flags false, rulesets empty; admin protection API403 | Admin; BLOCKED_PERMISSION / PROPOSED |
| R04 / P1 | Restricted records have no approved private GitHub destination | Public repo, private original requirements/acceptance/commercial inputs not migrated | PO; BLOCKED_PRIVACY |
| R05 / P1 | Sprint 2 incomplete QA mistaken for acceptance | PR #3 reports 617 Incomplete /116 Blocked, carried historical evidence | QA + PO; existing Issue #7 remains open |
| R06 / P2 | PR #4 old base restores stale context or overlaps successor docs | 08e2da4 vs 19ac2b3; carry only docs into new branch; compare every web/source blob before review | Integrator; implementation preserves artifacts, merge sequence needs PO |
| R07 / P2 | Orphan gh-pages/discovery histories merged incorrectly | Compare API no ancestor for gh-pages; closure has independent root | Maintainers; preserve refs, link/archive rather than rewrite |
| R08 / P2 | Project duplicate or hidden private Project overlooked | GITHUB_TOKEN empty visibility is not owner-wide enumeration | Project admin; BLOCKED_PERMISSION |
| R09 / P2 | Required reviews/checks deadlock solo owner | No independent reviewer appointed; checks must exist and be stable first | Admin + PO; PROPOSED |
| R10 / P2 | noindex misread as access control | Live public Pages; robots permits crawling, HTML noindex controls indexing only | PO + SEO; keep demo boundary, never store private data |
| R11 / P2 | Raw CI metadata leaks future payload/private Projects | Initial run fields empty; independent review prompted output allowlist | DevOps; script hardened, final CI verification recorded in handoff |
| R12 / P2 | Cloud setup cannot execute | Saved config had two main checkouts; task instance corrected both to prototype, startup still unverified | Cloud owner/platform; NOT_TESTED runtime until shell succeeds |
| R13 / P2 | Historical media rights and external source links assumed approved | Existing flagship/source provenance needs formal rights review | PO/customer; REQUIRES_PO_APPROVAL |
| R14 / P2 | CI success overstates browser/security coverage | Source/JSDOM checks differ from actual browser/hardware/UAT; production backend absent | QA; NOT_TESTED portions explicit |
| R15 / P3 | Artifact expiry erodes traceability | Actions artifacts have finite retention; public-safe summary/checksums committed, restricted raw evidence needs private storage | DevOps; release policy PROPOSED |

## Dependency order

Issue #8 delivers reviewable governance. Admin access/Project discovery and Issue #6 private/protection decisions unblock operational controls. Issue #7 completes Sprint 2 QA. PO decides integration of #4 and this successor without replaying stale artifact trees, then source reconciliation and eventual Pages migration/release. No Done transition is inferred from an agent report or successful deployment transport.

## PO decisions required

- Which governance PR integration sequence to approve; whether current docs merge's Pages republish impact is acceptable.
- Source/artifact reconciliation and any Pages branch→Actions migration; approved rollback target/environment.
- Name, visibility and members/roles of a private source repository; allowed public summaries and retention.
- Independent reviewer/merge owners, release-tag strategy, protected publish/source branches.
- MDV2 production requirement/spec baseline, commercial scope and UAT; v0.1 remains DRAFT.

No task here authorizes automatic merge, default branch rename, branch/tag deletion, production deploy, secret exposure or publication of restricted originals.
