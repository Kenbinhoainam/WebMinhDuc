# W2 B2B implementation and scoped verification

Target application commit: `88e2b61596eab5952f183a81b3030da760696c9c`.

The nine original W2 commands and two supplemental commands are fresh replays against that commit, extracted with git archive into an isolated checkout. The supplemental tests are QA-only overlays, with SHA256s in `rerun-88e.json`. `pinned-suite.log` records every command. Each records the command, UTC timestamp, environment qualifier, output and exit code. All eleven W2 commands now have passing proof: ten local commands plus the unchanged hero-lifecycle file on CI 46010047063 (11/11 scenarios with the original 15-second deadline). Two local timeout logs remain preserved; they were not silently replaced. The separate W1 suite passed all thirteen commands. They use React SSR, JSDOM, source/CSS assertions or mocked media timing. They are **not** real browser, mobile-device, screen-reader or network-performance measurements.

## Implemented

Release verification note: final verification is against `88e2b61596eab5952f183a81b3030da760696c9c`. Historical 492 timeout/retry artifacts remain separate. Current 88e initial/retry timeout artifacts are preserved explicitly, with no false passing claim. See the current pinned suite and manifest for the final run outcomes.

Supplemental coverage is mapped per ID in `extra-coverage.json`. The new actual-App form journey and ten locale/codec scenarios found no additional runtime defect. They close specific functional coverage gaps; physical scroll/focus geometry, real media decoding and other browser acceptance remain separate.

- F01/F02 retain their existing fields, required rules and submit-again validation timing. Six F01 inputs and two F02 inputs now carry static optional labels; service is preselected context. The form names its required-field hint. Errors appear immediately on submit, keep other entries, and focus the first invalid input.
- Existing one-attempt guards remain. Receipts now show their form and selected service context; new attempts clear the submitted form while keeping earlier in-memory receipts. No network endpoint, delay, error fixture or upload was added.
- Shared form CSS supplies focus scroll margins and a T1 secondary border transition, with no shaking/floating labels. The W3/W4 owners provide their own F03–F06 field/receipt integration; their logs are referenced in `../b2b.csv`, with historical pins called out until a new replay is supplied.
- Service rails use the shared T2 token (including a zero value), with visible pause controls and unchanged single-step/reverse behavior. A cancelled mouse pointer cannot activate a card. Decorative images retry through the existing image helper, then hide on terminal failure while retaining the card title/link/frame; their hidden state has an explicit author CSS rule.
- The existing customer-story rail has an explicit pause/resume button. Its manual native scrolling remains available when reduced motion disables automatic motion.
- Service FAQ preserves the original one-open rule and initially open first item. Functional updates handle repeated/reversed clicks; unique IDs connect questions and answers. Closed answers become inert and aria-hidden immediately, while scoped grid height T2 and opacity T1 transitions can reverse. Reduced motion removes those transitions.
- Hero video opacity uses T2. Existing film crop, compact mobile layout, end-card decoration, content and lifecycle are preserved. No optional end-card redesign was included.

## Preserved differences and gates

Recruitment still omits ServiceCustomers and retains its textual fee presentation. Admissions still directs to F05/F06 and never adds F01. Contact still defaults to F02, with explicit enterprise links selecting F01. The five service slugs, route metadata, mock data, consent and validation APIs were not changed by W2.

The unresolved source row `ROW625-P01-A-UNRESOLVED`, P03-E2 aggregate CTA label/default choice, P08-E2 consulting CTA choice and MI07-3 optional processing-error fixture remain individually blocked. MO08-2 is separately tracked by W1 as optional; W2 did not alter its decoration. MI04-3 submit-again timing is retained in accordance with the SDD/file-ownership contract, without introducing competing live validation.

## Remaining acceptance

`../b2b.csv` has all 182 assigned page selections plus 18 shared slices. It separates implementation status from QA status. Actual viewport geometry, zoom, device keyboard/safe areas, touch and assistive technology, subjective visual/user-comprehension trials, direct production refresh and resource/performance measurements remain incomplete wherever specified. A passing DOM helper does not complete those criteria.

The final runtime source was not modified after the target commit. No commit, deployment or network form submission was made by this worker.

## Direct browser acceptance after the localized map title fix

Application `c25a398a424880651cfc375760401aadc0c006d1` passed the exact 615-case scoped Chromium suite in [CI 46010404698](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46010404698). Pages fingerprint: `fa5a40a7d42721f0ed5353be2ea33b4cd71abcb37fe40466b20fe06b016e47c1`. The previous 88e run had 583 passing cases and 32 instances of one localized map-title defect; both complete receipts are retained in `browser-88e-before` and `browser-final`, with `browser-defect-before-after.json` identifying its exact scope.

The suite covers 280 native-image/currentSrc/byte measurements, 240 terminal image-failure checks, 55 modal heading/error-focus/scroll-return cases, and 40 Contact mode/map/fallback cases across all five locales. Eight required viewports are used; modal checks add three short viewports. Resource delivery is hermetic from packaged files: no public-origin latency or real-device claim. Browser checks used Chromium 140.0.7339.16; partial local Chromium 156 checks corroborated the title defect but are diagnostic, not the complete certificate.

`browser-choices.json` marks only P03-F3 through P08-F3 complete for their selected image leaf criteria. Other covered rows retain their precise partial scope. `native-image-bytes.csv` lists actual selected image URLs, decoded/rendered dimensions and packaged resource sizes. Physical keyboards on mobile, safe areas, AT and live Google Maps remain unverified by this suite.

Source suites remain honestly pinned to 88e. `carry-forward-88e-c25.json` and `dependency-diff-88e-c25.patch` establish the single-function map-title change; direct c25 consultation/business-info checks have their own logs. Earlier tests are not relabeled as fresh c25 executions.

## Latest scoped browser rerun

The exact 615-case suite also passed on application `d67c9914a17c3cedb4dcd76e397189e833ab9a4d`, CI [46011867911](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46011867911). Pages fingerprint `071e0f83f0c78545ef52126323e809a997aef23335826e4b5c7c16beec354c4c`. Current `browser-final` and `browser-choices.json` refer to this direct run; the verified c25 receipt remains in `browser-c25-verified`. Source fixture logs keep their original execution pins and are not relabeled as new runs.
