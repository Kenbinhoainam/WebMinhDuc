# MDV2-REL-01 — Where the code of each version lives

**Verified:** 28/11/2026 using repository refs/commits. **Repo:** https://github.com/Kenbinhoainam/WebMinhDuc (PUBLIC). The code is reached by selecting a branch or a historical commit. A preview version, a GitHub commit and a hosted Sites revision can be different identifiers. Do not confuse them.

## Prototype / Sprint 1 source history

| Milestone | GitHub code ref | Description |
|---|---|---|
| 2026-11-15 starting prototype | 27c2d311d0fbd75e9d7c843439a1e8afe30412dc | Build Minh Duc responsive prototype |
| HR2B rebuild | 55b1439450474947b2e5e2d7e0408d0919dcb669 | Page reconstruction and five locales |
| Sprint 1 v14 | 6370b35357d9c817af4efc3f9d7c130452371891 | B2B demo, video and v1.2 forms |
| Sprint 1 v15 | b6888715cb4290b3dedae86a697b153b6e018e43 | Responsive hero and profile |
| Sprint 1 v16 | f0035f6a00174db66d20951a5e18f2b3f5998ee1 | Flagship hero, content and motion |
| Sprint 1 v17 related change | b52d7002f7047b8d470d83b2fe0722c353830958 | Saved jobs badge and six page design plans; confirm release label separately |
| Sprint 1 v18 | b2978d691fed6890b9ba11645f0b837edad68a16 | Six page families |
| Sprint 1 v25 | 36e2b60765c55e5eafb5ae5653f75bc2f954865c | Published v25 |
| Sprint 1 v29 | 596130cd11d2915edb5e57c346e5d54b6ca1c17d | Published v29 |
| **Sprint 1 v30** | **08e2da46106b51537b871aea3880fc94b25da935** | Current prototype branch HEAD at inventory time |

For each row use https://github.com/Kenbinhoainam/WebMinhDuc/tree/<full-commit-sha> to inspect entire tracked source including src/, scripts/, tests/ and docs/.

## Sprint 2 code and preview versions

| Artifact | GitHub ref | Meaning |
|---|---|---|
| Approved selected SDD handoff | 5744b6da70af721bf08d915107960ab61dfb0080 | 22 documentation/data files; no app-code change |
| Sprint 2 preview v5 source | 88e2b61596eab5952f183a81b3030da760696c9c | Application source checkpoint recorded in PREVIEW-RELEASE |
| Sprint 2 preview v6 source | c25a398a424880651cfc375760401aadc0c006d1 | Application source checkpoint recorded in PREVIEW-RELEASE |
| Sprint 2 preview v7 source | 9db1adb2d7f84371dd7b954038a5c3ae2643a469 | Application source checkpoint recorded in PREVIEW-RELEASE |
| Sprint 2 preview v8 source | d67c9914a17c3cedb4dcd76e397189e833ab9a4d | Verified Git commit |
| Sprint 2 preview v9 source | c83bd9001cf2629dfb1934515fcf1c05ae553910 | Verified Git commit |
| Sprint 2 preview v10 source | 66b76036469f07b35bc3cb188dc6b61d40fdda32 | Verified Git commit of reported preview v10 |
| **Sprint 2 implementation handoff HEAD** | **1300df840190ac0ecffa32e576f0c809887e9c64** | Feature branch HEAD, QA/handoff changes after preview source; PR #3 Draft |

Sprint 2 feature branch: https://github.com/Kenbinhoainam/WebMinhDuc/tree/feat/s2-ui-upgrade-sel-20261127-v1

PR #3: https://github.com/Kenbinhoainam/WebMinhDuc/pull/3 (Draft, unmerged as inventoried).

Reported separate preview: https://minhduc-sprint2-approved-review.kenbinhoainam.chatgpt.site/ ; its v10 source/receipt mapping is in docs/sdd/SEL-2026.11.27-v1.0.0/execution/PREVIEW-RELEASE.md on the feature branch. Current accessibility can depend on the owner account. Do not treat feature HEAD as the exact deployed v10 unless a new receipt proves it.

## Current branches by purpose

| Branch | SHA at inventory | Purpose |
|---|---|---|
| prototype (DEFAULT) | 08e2da46106b51537b871aea3880fc94b25da935 | Main tracked React/Vite source; currently Sprint 1 v30 |
| feat/s2-ui-upgrade-sel-20261127-v1 | 1300df840190ac0ecffa32e576f0c809887e9c64 | Sprint 2 code + QA handoff, PR #3 |
| sprint-2/approved-ui-upgrade-sel-20261127-v1 | 5744b6da70af721bf08d915107960ab61dfb0080 | Frozen selected SDD, Code Cloud prompt, data |
| sprint-2/customer-demo-acceptance-20261127 | c8be7c846f91db278190fc8f8ca0fff6a95da0ec | Sprint 2 scope and demo acceptance Draft PR #2 |
| docs/master-sprint1-sdd-20261127 | 66191211358f3c3a645637b0c54a930e65f0662a | MASTER summaries Draft PR #1 |
| docs/sprint1-closure-20261127 | 175c2ccda5e352b95373c58d34118fead8892e55 | Sprint 1 closure (separate Git history; do not auto merge) |
| qa/s2-approved-artifact-20261127 | 3c8ed55e9725cbd5b72c72193ab078b2af6eafb5 | Historical QA branch |
| qa/s2-hero-unchanged-20261127 | 6309344d7f2e2e7987bfa347d29bb6327c73b9e6 | Historical QA branch |
| qa/s2-w2-browser-scope-20261127 | c36e38d572f1affde354d2d2d0e90752c38bef1b | Historical QA branch |
| gh-pages | cbce772deaa9f73988d76ce7c1c0a89bc7b5c77b | Static publish output; NOT the canonical source branch |

## Other hosting/source histories

- The Sprint 1 UI Review Site reports an independent Sites source/revision history, including bc0610e… and 3453c09…; these are **not GitHub commits in this repository**. The Sprint 2 implementation SOURCE-BASELINE.md explains how the Sites source was reconciled. Future Sites edits must be mirrored/pushed into GitHub, with explicit mapping to the GitHub source commit.
- README and docs/flagship contain historical review artifacts for multiple versions. Their presence alone does not imply a corresponding tagged release or a deploy.
- At inventory time, **no Git refs/tags and no GitHub Releases** were returned for the repository. Historical versions remain inspectable through commits; recommend **reviewed annotated tags** for future milestones, never rewrite/relabel an unapproved release.
- This register is a **snapshot**, not a live pointer. Every subsequent sprint must refresh branch SHAs, PR status and deployment receipts before reporting "latest".

## Verification commands

~~~bash
git remote -v
git fetch origin --prune --tags
git branch -a
git log --oneline --decorate --all -40
git ls-remote --heads --tags origin

# Inspect a historic version without changing prototype
git switch --detach 66b76036469f07b35bc3cb188dc6b61d40fdda32
~~~

A detached checkout is for inspection. For new work, create a unique feature branch from the approved and verified base, then commit and push. Do not force-push or deploy from detached HEAD.