# W2 B2B implementation and scoped verification

Target application commit: `4231bae137528dbf152250832c1a26d060c579d9`.

The nine adjacent logs are fresh replays against that commit, extracted with git archive into an isolated checkout while the main build ran. `pinned-suite.log` and `rerun-4231.json` provide the combined command results and checkout provenance. Each records the command, UTC timestamp, environment qualifier, output and exit code. All nine commands exited 0. They use React SSR, JSDOM, source/CSS assertions or mocked media timing. They are **not** real browser, mobile-device, screen-reader or network-performance measurements.

## Implemented

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
