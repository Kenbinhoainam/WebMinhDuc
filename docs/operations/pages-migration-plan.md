# Pages source/build/deploy migration and rollback

**PROPOSED — REQUIRES_PO_APPROVAL. No migration/deploy is executed by this document.** Current Settings is legacy branch `prototype:/`, directly packaging root. [Audit](../../DEPLOYMENT-AUDIT.md) is the evidence baseline.

## Target design

One approved source commit → reproducible clean build → immutable artifact checksum/manifest → protected github-pages environment → deployment revision → public URL HTTP/browser fingerprint. Treat source, artifact, deployment and observed URL as four distinct identifiers.

Build source must first be reconciled with existing Sprint 2 PR #3; current prototype source would regress the published app if rebuilt. Keep React/Vite and existing folder structure unless a separate architecture decision authorizes change. Preserve demo noindex and current audience. No new “production approved” label follows from using GitHub Pages.

## Preflight and migration

1. PO chooses approved source SHA/integration PRs, exact target environment and reviewers. Record baseline Pages API, source branch/path, live HTML/bundle hashes, artifact/deployment IDs and rollback release. Preserve `19ac2b3` and existing `gh-pages` history.
2. In isolated CI, use committed lockfile, pinned Node/action versions and explicit Pages base/canonical. Build from approved source; test source plus generated artifact, five locales, direct deep links, noindex, sitemap, CSS/JS MIME and browser smoke. Do not run `sync-pages` into default branch during migration prep.
3. Build twice in clean equivalent environments and compare unpacked file checksums; account for intentionally nondeterministic metadata before claiming reproducibility. Save artifact plus release manifest; never label a mere source tree as build proof.
4. Prepare separate CI and CD workflows. CI on PRs uses GitHub-hosted runners, contents:read and no production secrets. CD accepts only approved source/release, uses contents:read, pages:write and id-token:write at deployment job, protected environment and concurrency. No `pull_request_target` checkout of untrusted code, no fork publishing.
5. Configure release-only/manual dispatch or approved release trigger; ordinary docs-only merges must not deploy. Decide trusted source/release authorization and verify before enabling. Environment reviewers must be actual eligible users; token cannot bypass PO gates.
6. Only after PO approval, change Pages source to GitHub Actions and execute one approved deployment. Verify live HTML/bundle hashes, headers/redirects, routes/refresh, locale/noindex/canonical/sitemap, screenshots/JS errors and cache-busted response. Record new source→artifact→deployment→URL receipt and acceptance decision.

No production workflow with deploy permission is included in this task. Changing Settings first without approved artifact/recovery makes an avoidable outage risk.

## Rollback

Keep the previous known served artifact and checksum, settings snapshot and version manifest. On approved incident rollback, redeploy that **exact artifact** through the approved mechanism and record a new deployment receipt; do not rebuild old source and assume identical output. Verify hashes/routes/cache and record reason/approver/time.

If the migration mechanism fails before successful serving, restore the previously captured branch source `prototype:/` only under PO/admin authorization and only after verifying that branch still contains the expected artifact. Switching back can republish; preserve current source/history and do not force reset it. If branch content changed, use a reviewed revert or a separately approved preserved artifact strategy.

A rollback request must state whether it restores today's Sprint 2 artifact or an older Sprint 1 version. Never choose `gh-pages` merely because of its name. No rollback has been executed or tested against production in this task.
