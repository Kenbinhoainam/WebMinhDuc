# Live reference verification and Minh Đức navigation — v11

The network change has now reached the running machine: configuration revision 3, unrestricted/enforced, fresh `CONNECT 200; HTTP 200` for https://www.hr2b.com/. This supersedes the network limitation recorded in v10.

## Source evidence

20 observed-link page requests returned HTTP 200 on 2026-11-16. The live capture is retained at `/workspace/reference/hr2b-live-current-20261116`; `pages-manifest.json` records requested/final URL, status, capture time, byte count and SHA-256. The asset manifest records 682 candidate requests, 678 successful, three real theme-image 404s (`Search.svg`, `checked.svg`, `checked-active.svg`) and one CSS fragment misidentified as an asset (`%23a`). Those missing source icons are not dependencies of the Minh Đức prototype.

Live original core/main CSS, JavaScript and hero footage match the original Drive source byte for byte. Ordered section families also match the captured templates. Job/news item changes are source content differences, not instructions to replace Minh Đức data with HR2B data.

## Current user instruction

Keep HR2B's body presentation and animation; use Minh Đức's logo, content and previously requested menu. The desktop header therefore intentionally exposes seven evenly allocated groups with 19 second-level destinations. Hover opens submenus without label arrows; keyboard and touch remain supported. Screens below 1280px use the accessible drawer. The header uses transparent styling over banners and light glass/dark labels when scrolled. Language flags and five locales are retained. This overrides v10's compact-only navigation.

## Changes based on live evidence

- Mobile hero title/subtitle now match the source's 40px/20px emphasis. Desktop copy has the source 60% width at 1200px and above, while intrinsic content height prevents translated copy from clipping.
- Homepage rails follow the source's partially visible card widths. Eligible autoplay follows 3500ms intervals with 500ms scrolling; user controls, pointer/focus interactions, visibility, reduced motion and observer failure protect access to content.
- About history links selected illustrative phases to image/text content with keyboard and previous/next navigation. No fabricated historical dates are introduced.
- Article detail begins with its own heading and article layout, without an extra photographic hero. Related articles remain separate.
- Event detail uses the source's separate anchor-linked overview, schedule, location, gallery and related-event sections, populated with existing disclosed demo content.
- Visible footer copy now identifies this as a Minh Đức prototype; source-image provenance remains documented outside the main brand presentation.

## Verification boundary

HTTP/source download is now available. Supported visual preview remains unavailable: `sites-preview` fails to open the browser relay for port 4173, and CUA tab creation reports `Browser Use could not read requirements`. The checks below establish source/DOM behavior, not pixel equivalence, real browser animation smoothness, or performance scores. No alternative browser/server path was used to bypass that failure.
