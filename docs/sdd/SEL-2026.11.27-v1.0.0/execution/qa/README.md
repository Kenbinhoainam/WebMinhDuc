# Independent DOM and static acceptance checks

Run `node tests/s2-qa.mjs` from the project root after building the Pages profile. For the root-mounted Site preview, supply the same `MINHDUC_PREVIEW_ORIGIN` used for its build. The test reads generated HTML and CSS from `dist/` and mounts the checked-out components with their real records, router and locale providers. Exit code 1 indicates a failed assertion. No test sends a form to a live endpoint.

- `route-audit.json` records the generated H1, title, description, canonical, language and robots directives for P01–P40 × five locales. Additional assertions inspect alternate links, About anchors, legacy aliases and event schedules. P41 has its own reviewer tests.
- `observations.json` contains exact inputs, expected behavior, actual values, and results. The four CSS observations examine named declarations at 19 viewport widths. The DOM observations exercise form validation, duplicate submit handling, scoped receipts, filters, menu focus and queue deep links.
- `choice-evidence.json` indexes each scoped observation by frozen choice ID and workbook row. Its coverage field applies to that single assertion. A single passing clause does not resolve an entire multi-clause row. The remaining field identifies evidence still needed.
- `dist_tree_sha256` covers every regular file under dist, including images/video and the reviewer. `source_tree_sha256` covers src. Each digest uses sorted relative paths, a NUL, the file's hexadecimal SHA-256 and a newline. `build_sha` is the checkout's Git HEAD at run time, which can precede uncommitted implementation work.

JSDOM does not measure physical touch, IME behavior, assistive technology speech, fonts, real image decoding, running video/audio, viewport occlusion, or native browser focus scrolling. Separate browser evidence is required for those acceptance clauses. Component tests use the application’s JSX translation runtime and LocaleProvider. Route metadata assertions read generated markup for the corresponding language.

## Verification for 88e2b61

The Pages build at `88e2b61596eab5952f183a81b3030da760696c9c` produced `eb23762c4afa9ff5e909159f93858404d6c14135f45751171131981eb8134211` (complete directory digest). The independent rerun recorded 200 route/locale cases and 795 assertions across 182 frozen choices. All passed. See [run.log](run.log), [choice evidence](choice-evidence.json) and [route results](route-audit.json).

The [media audit](../media-audit.json) decoded 67 distinct assets across 200 route/locale outputs and verified 60 selection predicates on this Pages tree. The [common audit](../common-audit.json) covered 193 choices in 48 checks against private Site source `b9b58c4da406a91e43e94e2ad98a0f73327a47ab`; its archive SHA-256 is `901989a98553b6c44e47d01c45a7d1c8f64196c0b58bc4c541929cf5585a9782`.

The [residual checks](../residual.json) exercised 43 cases for 17 choices, including the real App router, sample administrative receipts, file metadata/validation, focus after removal, saved-job fallback, localized route aliases and registration forms. [Full checks log](../residual-checks.log) and [pre-fix attachment reproduction](../residual-files-baseline.log).

The [Chromium attachment checks](../residual-browser.json) passed all 20 form, language and narrow-width cases. Long names wrapped inside their rows. An empty file selection preserved the existing list; native OS dismissal and spoken screen reader output remain unobserved. [Screenshots and log](../residual-browser/)

The [education workflow checks](../residual-education/choices.json) verified 12 F05/F06 submissions on the three Vietnamese program pages, all 15 selected criteria, and noindex in 15 localized pages. The [public filter keyboard regression](../logs/b2c-filter-focus.log) measured collapsed and expanded focus at 390 and 1440 CSS pixels.
