# Independent DOM and static acceptance checks

Run `node tests/s2-qa.mjs` from the project root after building the Pages profile. For the root-mounted Site preview, supply the same `MINHDUC_PREVIEW_ORIGIN` used for its build. The test reads generated HTML and CSS from `dist/` and mounts the checked-out components with their real records, router and locale providers. Exit code 1 indicates a failed assertion. No test sends a form to a live endpoint.

- `route-audit.json` records the generated H1, title, description, canonical, language and robots directives for P01–P40 × five locales. Additional assertions inspect alternate links, About anchors, legacy aliases and event schedules. P41 has its own reviewer tests.
- `observations.json` contains exact inputs, expected behavior, actual values, and results. The four CSS observations examine named declarations at 19 viewport widths. The DOM observations exercise form validation, duplicate submit handling, scoped receipts, filters, menu focus and queue deep links.
- `choice-evidence.json` indexes each scoped observation by frozen choice ID and workbook row. Its coverage field applies to that single assertion. A single passing clause does not resolve an entire multi-clause row. The remaining field identifies evidence still needed.
- `dist_tree_sha256` covers every regular file under dist, including images/video and the reviewer. `source_tree_sha256` covers src. Each digest uses sorted relative paths, a NUL, the file's hexadecimal SHA-256 and a newline. `build_sha` is the checkout's Git HEAD at run time, which can precede uncommitted implementation work.
- `baseline/` captures an earlier calibration using the branch's static HTML snapshot and the components present when that run occurred. Source components were already being changed. The baseline is not frozen pre-sprint interaction evidence.

JSDOM does not measure physical touch, IME behavior, assistive technology speech, fonts, real image decoding, running video/audio, viewport occlusion, or native browser focus scrolling. Separate browser evidence is required for those acceptance clauses. Component tests use the application’s JSX translation runtime and LocaleProvider. Route metadata assertions read generated markup for the corresponding language.

## Verification for 4231bae

The Pages build at `4231bae137528dbf152250832c1a26d060c579d9` produced ca25ff51c80afd5428a56cc3adf6a0ed889ef45b9d6e824455419065f84e05f5 (complete dist SHA-256). The independent rerun recorded 200 route/locale cases and 795 assertions across 182 frozen choices, with zero failed predicates. See [run.log](run.log), [choice evidence](choice-evidence.json) and [route results](route-audit.json).

On the same Pages tree, `python tests/s2-media-audit.py --dist dist --sha 4231bae137528dbf152250832c1a26d060c579d9` decoded 67 distinct assets, checked 200 route/language outputs and completed 60 selection predicates without a failure. The separate root-mounted preview used Site source `7721ff18d35855dc2a8e0df6fd667c39d2a973cd`. The [common audit](../common-audit.json) covers 193 choices over 48 checks and the [execution log](../logs/common-audit.log) records the fixed CMS feedback regression.
