# DEPLOYMENT-AUDIT — GitHub Pages live

**Observed 28/11/2026. IMPLEMENTED_AND_VERIFIED for the explicitly listed checks.** Initial web-fetch attempt could not access the URL and Cloud failed to start; later credential-free HTTP checks on GitHub-hosted runner resolved that blocker. The completed result is therefore not `BLOCKED_LIVE_DEPLOYMENT_VERIFICATION`.

## What actually serves the URL

[Pages URL](https://kenbinhoainam.github.io/WebMinhDuc/) returns HTTP **200**, no redirect at root. Pages API reports **build_type=legacy**, source **branch prototype / folder /**, **cname=null**, HTTPS enforced. A GitHub-generated Actions run transports this branch output; the existence of that run does not mean Settings is configured for a custom Actions build.

| Layer | Verified mapping |
|---|---|
| Application build source | Publish commit message records `66b76036469f07b35bc3cb188dc6b61d40fdda32`; no independent reproducible-build byte proof claimed |
| Published branch/artifact revision | `prototype@19ac2b365f2264399fde4312639127b8de80736f` |
| Git tree of publish revision | `0a7e3d70143f9d3d32354a8eb9fba1d9b29a15db` |
| GitHub Actions run | [46103834830](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46103834830), success, 28/11 10:39 UTC+7 |
| Artifact | ID `15246800587`, github-pages.zip, 195,955,331 bytes; upload ZIP SHA256 `fb79c4fcdddff2c26cc5fcee739427a238ed0409765a8119a3bef09de8346e7a` from build log |
| Pages deployment ID | `19ac2b365f2264399fde4312639127b8de80736f` from deploy log |
| Repository deployment ID | `8123972756`, environment `github-pages`, ref prototype, same SHA |
| Served root HTML | 57,850 bytes; SHA256 `420d290219fd875d08778dccb907be210c15bd2d1574b7847cf4ea9f185d42e7` |

The artifact ZIP digest is not a digest of an individual HTML file, unpacked directory or Sites archive. These identifiers have different meanings.

Build job [140852038026](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46103834830/job/140852038026) checks out prototype and uploads `path: .`; it does not rebuild React. Deploy job [140852105615](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46103834830/job/140852105615) binds artifact ID and pages_build_version to the URL. **Live HTML exactly matches the Git blob at 19ac2b3**. It does not match gh-pages; this conclusion is based on bytes and configuration, not branch names.

## Comparisons

| Candidate | Entry JS / CSS | Canonical / conclusion |
|---|---|---|
| Live / prototype publish artifact | `index-gI3X1Sm7.js` / `index-CqyiB8zo.css` | Pages URL; exact HTML match |
| gh-pages cbce772 | `index-BNe4pavk.js` / `index-BdLnFRJK.css` | Old Sprint 1 Sites canonical; HTML SHA256 `bc947da6e7fcb73d1b21a523c3bdd29200bd04e5b992c150045a81d238a0bdb9`; not live match |
| Sprint 2 Sites preview v10 | GitHub application `66b7603`, Sites source `e7724563abeae86d283029bb38ec18ce442c98be` | Separate access-controlled deployment; origin/base differences mean byte equality is not assumed |

GitHub compare API confirms **no common ancestor** between gh-pages and prototype. Do not merge unrelated histories as a cleanup technique.

Sites v10 metadata and deployment status were read through authorized connector: saved version 10, succeeded; archive SHA256 `8606ab52068f6d5a8bd24ba09481962ead84fb5c6564dc9223e8b80a79c936f6`. Publicly recorded source/receipt links are in [PR #3 handoff](https://github.com/Kenbinhoainam/WebMinhDuc/blob/1300df840190ac0ecffa32e576f0c809887e9c64/docs/sdd/SEL-2026.11.27-v1.0.0/execution/PREVIEW-RELEASE.md). No new private access details, credentials or raw archive were copied here. Sites HTTP/browser byte comparison remains **NOT_TESTED**; a hosted success is not customer production acceptance.

## HTTP, metadata, routes and cache

Initial audit [46106771278](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46106771278) and [JSON evidence](docs/operations/evidence/2026-11-28/pages-http-initial.json):

- Root 200, `text/html`, correct Pages canonical, `noindex,nofollow`, VI lang and VI/EN/ZH-Hans/KO/JA alternates.
- Initial entry JS/CSS/poster/logo returned 200. Follow-up audit compares all published JS/CSS bundles to exact Git bytes and fails on wrong MIME/hash/status; results are in [handoff](docs/operations/HANDOFF.md).
- Direct about-us and job-detail routes, locale roots and locale job lists returned 200; missing route returned 404. These are HTTP deep-link checks; browser refresh/rendering is separately reported.
- Sitemap parsed: **245 URLs**, all under Pages base. It remains possible to publish a sitemap for a noindex demo; current demo indexing control is HTML noindex. `robots.txt` allows crawling (`Disallow:` empty), so it does not prevent crawlers from reading noindex.
- Cache-busting request matched root HTML. Response cache policy `max-age=600`, initial Age 0, Last-Modified 28/11/2026 10:39:05 UTC+7. One runner observation does not prove global CDN invalidation or every visitor's cache.

No deploy was performed to test these conclusions. HTTP audit uses no authentication, submits no forms and does not alter audience.

## Critical drift and migration boundary

Tracked `src/`, existing `scripts/`, `tests/` and dependencies on prototype are still Sprint 1 v30 (`08e2da4`). Publish `19ac2b3` changes static files only. Building the current source therefore does not reproduce the Sprint 2 published app. Source CI tests that source; it must not label it “tested live Sprint 2.”

A documentation-only merge into current branch-root Pages can trigger a new Pages publish. **Do not merge governance until PO considers this impact.** The requested future behavior “docs-only merge does not deploy” requires an approved publication architecture change; this task does not switch Pages settings.

[Migration and rollback plan](docs/operations/pages-migration-plan.md) preserves current artifacts and requires PO approval. Existing publish branch, files, custom-domain state and production environment were not changed.
