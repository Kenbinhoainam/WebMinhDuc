# VERSION-INVENTORY — code, artifacts and deployment

28/11/2026 snapshot. A UI version label, Git source SHA, Sites version, build checksum and deployed revision are independent. No historical tags/releases were created. [Complete reachable history and path inventory](docs/operations/evidence/2026-11-28/inventory.json) contains **102 unique commits** over the 11 pre-task branches.

## Sprint 1

| Historical label | Verified Git commit | Evidence / limit |
|---|---|---|
| v14 | [`6370b35357d9c817af4efc3f9d7c130452371891`](https://github.com/Kenbinhoainam/WebMinhDuc/tree/6370b35357d9c817af4efc3f9d7c130452371891) | Commit exists in complete prototype history; association from historical README/version records; not a signed release/tag |
| v15 | [`b6888715cb4290b3dedae86a697b153b6e018e43`](https://github.com/Kenbinhoainam/WebMinhDuc/tree/b6888715cb4290b3dedae86a697b153b6e018e43) | Commit exists in complete prototype history; association from historical README/version records; not a signed release/tag |
| v16 | [`f0035f6a00174db66d20951a5e18f2b3f5998ee1`](https://github.com/Kenbinhoainam/WebMinhDuc/tree/f0035f6a00174db66d20951a5e18f2b3f5998ee1) | Commit exists in complete prototype history; association from historical README/version records; not a signed release/tag |
| v18 | [`b2978d691fed6890b9ba11645f0b837edad68a16`](https://github.com/Kenbinhoainam/WebMinhDuc/tree/b2978d691fed6890b9ba11645f0b837edad68a16) | Commit exists in complete prototype history; association from historical README/version records; not a signed release/tag |
| v25 | [`36e2b60765c55e5eafb5ae5653f75bc2f954865c`](https://github.com/Kenbinhoainam/WebMinhDuc/tree/36e2b60765c55e5eafb5ae5653f75bc2f954865c) | Commit exists in complete prototype history; association from historical README/version records; publish version named in commit subject; not a signed release/tag |
| v29 | [`596130cd11d2915edb5e57c346e5d54b6ca1c17d`](https://github.com/Kenbinhoainam/WebMinhDuc/tree/596130cd11d2915edb5e57c346e5d54b6ca1c17d) | Commit exists in complete prototype history; association from historical README/version records; publish version named in commit subject; not a signed release/tag |
| v30 | [`08e2da46106b51537b871aea3880fc94b25da935`](https://github.com/Kenbinhoainam/WebMinhDuc/tree/08e2da46106b51537b871aea3880fc94b25da935) | Commit exists in complete prototype history; association from historical README/version records; publish version named in commit subject; not a signed release/tag |

Additional proven commits: initial prototype `27c2d311d0fbd75e9d7c843439a1e8afe30412dc`; HR2B rebuild `55b1439450474947b2d5e2d7e0408d0919dcb669`; v17-related plans/badge `b52d7002f7047b8d470d83b2fe0722c353830958`. Avoid fabricating release labels for intermediate commits. The full history retains original subjects and parent SHAs without private author metadata.

## Sprint 2 checkpoints and Sites preview

| Preview | GitHub application SHA | Sites source SHA | Sites archive SHA256 |
|---|---|---|---|
| v5 | `88e2b61596eab5952f183a81b3030da760696c9c` | `b9b58c4da406a91e43e94e2ad98a0f73327a47ab` | `7d99bb02d5f22acf619f34e1639754c5e6cef4ba57e8bfd6e9fa7268c965545c` |
| v6 | `c25a398a424880651cfc375760401aadc0c006d1` | `814828c92ccafba27b4f5c3f7394f9665c2724c7` | `51d4be4d072ee9c12dfa0a7a2c607bef30aeace3e12c325b9561fc8ca612e22d` |
| v7 | `9db1adb2d7f84371dd7b954038a5c3ae2643a469` | `bdf4066be8557f0c3765cbd9732e12f2922e881f` | `7f8ef836124903ffe998a1a1c4c0a768e2757dec4da85abb3c26bc31fd4341c4` |
| v8 | `d67c9914a17c3cedb4dcd76e397189e833ab9a4d` | `ac81527a486b6d97b5d2c34887dd9b96dc6f235f` | `db86e5c4989d61f5d46d11d9ea4e3dec585741bfa428fa4efcd97d38ede05952` |
| v9 | `c83bd9001cf2629dfb1934515fcf1c05ae553910` | `e2bca939584a5e53c2d6a8fc40e049884f266ebe` | `c752925930872baee87d71981efdce519281246a86b916a9fb9ad5e89c40d5db` |
| v10 | `66b76036469f07b35bc3cb188dc6b61d40fdda32` | `e7724563abeae86d283029bb38ec18ce442c98be` | `8606ab52068f6d5a8bd24ba09481962ead84fb5c6564dc9223e8b80a79c936f6` |

Application mapping comes from the [immutable PR #3 handoff](https://github.com/Kenbinhoainam/WebMinhDuc/blob/1300df840190ac0ecffa32e576f0c809887e9c64/docs/sdd/SEL-2026.11.27-v1.0.0/execution/PREVIEW-RELEASE.md); each application commit exists in branch history. Sites source/checksum/version was re-read from the connected service. v10 is the latest saved version returned and deployment status succeeded. No equivalence between its archive bytes and Pages ZIP is implied.

Earlier checkpoint v4 application `07e61874db50c14575d693f8d7e3e40769ab34e1`; v2 is recorded in handoff as `4231bae`. Use the complete inventory to resolve full commit before future work. v1–v4 Sites saved revisions exist, but historical screenshot/version claims are not fresh browser QA.

PR #3 HEAD is `1300df840190ac0ecffa32e576f0c809887e9c64`. Source/scripts/package files are unchanged from application v10 `66b7603`; post-v10 commits add tests/docs/evidence. That does not mean every acceptance case was rerun at HEAD. Historical result remains 524 Completed / 617 Incomplete / 116 Blocked; 187 completed codes directly tested on v10 and 337 carried from earlier evidence. These are reported QA classifications, not PO UAT sign-off.

## All pre-task branches

| Branch | Verified head | Purpose |
|---|---|---|
| `docs/master-sprint1-sdd-20261127` | `66191211358f3c3a645637b0c54a930e65f0662a` | Existing specification/documentation work |
| `docs/mdv2-github-control-20261128` | `3ab94d637db78f9f8d5849a48739c5fde42db10f` | MDV2 predecessor Draft PR #4 |
| `docs/sprint1-closure-20261127` | `175c2ccda5e352b95373c58d34118fead8892e55` | Discovery closure; separate ancestry |
| `feat/s2-ui-upgrade-sel-20261127-v1` | `1300df840190ac0ecffa32e576f0c809887e9c64` | Existing Sprint 2 PR #3 |
| `gh-pages` | `cbce772deaa9f73988d76ce7c1c0a89bc7b5c77b` | Historical S1 v25 static output; unrelated ancestry, not current live |
| `prototype` | `19ac2b365f2264399fde4312639127b8de80736f` | Default; S1 source + S2 root artifact |
| `qa/s2-approved-artifact-20261127` | `3c8ed55e9725cbd5b72c72193ab078b2af6eafb5` | Historical QA workflow/evidence |
| `qa/s2-hero-unchanged-20261127` | `6309344d7f2e2e7987bfa347d29bb6327c73b9e6` | Historical QA workflow/evidence |
| `qa/s2-w2-browser-scope-20261127` | `c36e38d572f1affde354d2d2d0e90752c38bef1b` | Historical QA workflow/evidence |
| `sprint-2/approved-ui-upgrade-sel-20261127-v1` | `5744b6da70af721bf08d915107960ab61dfb0080` | Existing specification/documentation work |
| `sprint-2/customer-demo-acceptance-20261127` | `c8be7c846f91db278190fc8f8ca0fff6a95da0ec` | Existing specification/documentation work |

The new `chore/8-github-control-center` branch starts from `19ac2b3`; its remote SHA and Draft PR are recorded in [handoff](docs/operations/HANDOFF.md). Existing refs are preserved.

## Deployment ledger

| Environment / location | Source vs artifact | Evidence |
|---|---|---|
| GitHub Pages live | Build source recorded as `66b7603`; artifact served from `19ac2b3` | [Configuration, exact HTTP hash, run/deploy IDs](DEPLOYMENT-AUDIT.md) |
| gh-pages historical | `cbce772`, commit subject Sprint 1 v25 | Static files differ; no common ancestor with prototype |
| Sprint 2 review Site | Application `66b7603`, Sites `e7724563…`, saved v10 | Authorized metadata read; origin/access distinct; not production acceptance |
| Sprint 1 review Site | Separate Sites version history, latest version 3 in service inventory | Referenced source `3453c09…` in PR #3; do not treat as WebMinhDuc Git commit |
| Sprint 1 prototype Site | Service inventory latest version 26 | Current Sites version number differs from historical UI labels v29/v30; no inferred one-to-one mapping |
| v13 comparison Site | Service inventory latest version 1 | Separate comparison origin, not current canonical release |

Two additional historical Sites were visible in account inventory; their private metadata is not newly reproduced in this public repository. They are not evidence for current WebMinhDuc deployment. No Site, revision, access policy or deployment was modified.

Future version/tag/manifest strategy is [proposed here](docs/releases/README.md). Keep historical commit references; no force-push or unverified retroactive tags.
