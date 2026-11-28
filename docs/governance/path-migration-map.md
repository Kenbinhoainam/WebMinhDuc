# Path inventory and migration map

**Implemented scope:** navigation and additive governance. No source, generated output, legacy docs, binary evidence or existing branch was moved/deleted. Full pre-task refs/paths are indexed in [audit evidence](../operations/evidence/2026-11-28/inventory.json).

| Old path / branch | Target / treatment | References and safety |
|---|---|---|
| root README.md | Remains entrypoint; concise navigation replaces stale current-version claims | Original text preserved at immutable commit, linked in archive |
| AGENTS.md | Same path; mandatory cross-provider rule prepended | Historical technical decisions retained |
| docs/flagship/** | Keep in place | README, tests/review artifacts and media scripts refer here; binary/HTML references not relocated |
| docs/sprint-1/** on prototype | Keep in place | Different content than orphan discovery closure; do not conflate |
| docs/sprint-1/** on docs/sprint1-closure-20261127 | Immutable branch links from archive | Separate Git ancestry; no unrelated-history merge |
| docs/sdd/** on approved/feature branches | Keep existing branch paths; immutable links from hub | QA scripts and CSV/JSONL evidence use exact paths; no copied Sprint 2 tree |
| PR #4 docs/{governance,requirements,specifications,architecture,decisions,acceptance,traceability,sprints,versions,handover,ai} | Same canonical paths in governance proposal based on 19ac2b3 | Read all 25 changed files and conversation before carrying public docs forward; v0.1 remains DRAFT |
| PR #4 generic ai-work-item template | Eight typed Issue forms | No existing user Issue rewritten or Sprint 2 recreated |
| src/, tests/, existing scripts/, public/ | Keep in place | package.json, Vite, prerender and QA depend on these paths |
| index.html, assets/, locale/routes, .pages-output.json | Keep byte-identical to 19ac2b3 | Active branch-root publishing; moving/removing can break live |
| docs/00-start-here/, operations/, releases/, archive/ | Add indexes/runbooks/evidence only | No duplicate app artifacts |

Before any later move: find all references with `rg`; export old→new file mapping; move with Git; update code/CI/docs references; validate links and scripts; review diff and preserve history; only then remove old path after comparison. Generated/static-path cleanup is a separate PO-approved deployment migration.

Target folder structure is navigational, not authority to bulk-move files. Requirements/SDD authoritative source is its approved commit, not newest directory name.
