# CI and QA operating guide

[Governance CI](../../.github/workflows/governance-ci.yml) separates test/audit from deployment. New [label setup](../../.github/workflows/governance-labels.yml) is separate, additive governance administration on this task's trusted branch only; it has issues:write solely to create missing labels. Neither workflow publishes Pages or changes production.

## Actual evidence

Bootstrap commit `e14adcbfc5887e85be753ef5f18ee8323120e386`, [run 46106771278](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46106771278): **4/4 jobs successful**. Clean npm install, TypeScript/client/SSR/prerender build; jobs logic, catalog, SEO, sprint flows, review/locales, hydration, sitemap/header/motion/hero suites; i18n diagnostic; tracked-diff check. Production dependency audit reported **0 vulnerabilities** at that observation. This is not a guarantee of future dependency safety.

Hosted Ubuntu 24.04, Node 24.15.0. Lockfile jsdom 31.0.1 requires compatible Node; avoid older Node20/22. Build uses existing package.json commands; no dependency changes or `pages:prepare` invocation.

## Scope and limits

- Source job tests the current checkout's source, which is still Sprint 1 v30 in this governance branch. It does not certify the Sprint 2 published artifact.
- Node/JSDOM/source/CSS checks do not prove rendered responsiveness, assistive technology, video behavior or real-device performance.
- `audit:i18n` emits findings but does not fail solely on remaining Vietnamese text; review findings, distinguish proper names from untranslated UI.
- HTTP audit checks Pages root, sampled direct routes/locales, cache, noindex/canonical/sitemap, all published JS/CSS hashes/MIME. It fails on unexpected results and reports its pinned expected revision. When an authorized release changes the live baseline, update that expectation through a reviewed commit; this operational check is not a universal PR required gate.
- A separate browser smoke, when reported, tests the preserved static artifact locally under /WebMinhDuc and not the freshly built S1 source. Its evidence must say which one. No full WCAG, manual UAT, physical-device or production security certification is implied.
- Existing Sprint 2 browser evidence remains on QA branches and PR #3, pinned to `66b7603`. Do not copy its workflow without its input/source/SDD dependencies.

## Resource and security controls

GitHub-hosted runners, timeouts, concurrency cancellation, immutable action pins and checkout credentials disabled. CI contents:read; metadata job adds read-only actions/pages/issues. No production secret, pages:write, id-token:write, self-hosted runner or pull_request_target. PR does not run account metadata/operational live audit. App build/tests can be skipped for pure documentation changes after path detection; governance checks still run. No required branch checks enabled until observed stable.

Raw metadata is allowlisted before logs/artifact storage; private Projects and deployment payloads are omitted. Public summaries/checksums persist in Git even after finite Actions-artifact retention. [Privacy policy](../governance/privacy-boundaries.md).

## Local replay

```sh
npm ci --no-audit --no-fund
npm run build
npm test
npm run test:catalog
npm run test:seo
npm run test:sprint
npm run test:review
npm run test:hydration
npm run test:sitemap
npm run test:header
npm run test:motion
npm run test:hero
npm run audit:i18n
npm audit --omit=dev --audit-level=high
python3 scripts/governance/check-docs.py
python3 scripts/governance/audit-live.py
```

Record SHA, run/command, exit status, actual scope and NOT_TESTED cases in PR. A failed audit is evidence to investigate; never auto-deploy to “fix” it.
