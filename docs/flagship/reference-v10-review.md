# Independent source-fidelity review — v10

Review scope: the user's request to reproduce HR2B's presentation, changing Minh Đức text and logo. Source inspection is against `/workspace/reference/hr2b/src/content/pages/` and the theme CSS in its `public/mirror/` tree. This local reference is a reconstruction with integration code, not a verified current browser capture.

## Findings requiring rework

The first v10 pass still changed major compositions. Shared typography and matching outer class names did not resolve these differences.

| Area | Reference evidence | Initial implementation | Requested correction |
| --- | --- | --- | --- |
| Home news | `.wrap-slide-news .auto-3-column` with navigation | Static three-card grid | Restore the card rail and navigation |
| Home customers | Logo rail followed by separate testimonial slider with decorative edges | A single newly designed white quote card | Restore the two-part composition with existing authorized names and sample disclosures |
| Home partners | Static two/four-column logo grid | Animated partner strip | Use the source grid composition |
| About | Split statement, three simultaneous image/value cards, four-stat block, history/media sections | Custom tabs and text cards | Map existing content into source compositions; remove duplicated alternative interfaces |
| Services | Asymmetric introduction and solution-card rail | Additional custom tabbed service panel | Restore source overview structure |
| News listing | Featured carousel and separate regular listing | Oversized first item inside one grid | Restore separate feature and listing regions |
| Job detail | Heading/breadcrumb inside the main gray card and a 9/3 body/sidebar | Extra full-width hero and repeated title | Remove the extra hero; keep one H1 and source content/sidebar composition |
| Careers | Three-column opportunities, alternating media/text rows and supporting rails | Generic icon cards and text panels | Reuse source compositions with existing data and anchors |
| Contact offices | Vertical expandable office blocks | Pill tabs | Use accessible expandable blocks, retaining verified destinations |

These requests were sent to the respective owners. Revised source now restores the homepage logo/review/grid/rail compositions, simultaneous About values and four-stat block, service rail, separate feature/list news presentation, job-detail intro/sidebar, careers media rows, and office accordions. About and service detail now contain actual consultation forms. The extra homepage FAQ/CTA and overview/news CTA banners were removed; corresponding homepage FAQ schema has been removed by the integration owner.

The hero's first reference port introduced a fixed-height inner frame with absolutely positioned translated copy. This could clip longer locales at tablet widths. The owner changed it to a content-bearing grid with the reference ratio as a minimum height. The independent hero test checks that content contributes to frame height.

`tests/reference-structure.mjs` passes for eight page types across five locales. It also activates featured-news next/previous controls and checks that they change the feature without replacing the regular listing. `tests/hero-review.mjs` checks all localized initial title/description layers, the single primary CTA, immediate poster markup and intrinsic-height safeguards. The revised `tests/flagship-review.mjs` checks the drawer-based header; its compiled-style assertions require the final build.

Final Home composition corrections are present: desktop event alignment/background and external all-events CTA, intro thumbnail descriptions and the decorative brand wordmark. Recovered edge-3/4 images replace the temporary decorative fallbacks. These were findings from actual source structures, not browser screenshots.

The final source rerun of both independent suites passed. The reference-structure suite also checks that every rendered local image and srcset candidate exists. Shared PageHero now contains only the source-style title and breadcrumb; the extra eyebrow/description lines have been removed. The final compiled flagship checks also passed.

## Content and behavior constraints

- Existing Minh Đức routes, five locales, six demo forms, saved jobs, closed-job restrictions, filters, and required anchors remain functional. Reference layout takes priority over old custom interaction styling.
- No HR2B team, certification, customer, award, or testimonial content becomes a claim about Minh Đức. Missing corresponding company information must be described as a specific content deviation, or existing clearly labeled sample content must occupy the reference composition.
- Do not restore reference submission endpoints, tracking scripts, contact details, misleading submission confirmations, or a second history/router implementation.
- Preserve readable initial HTML, keyboard access, reduced motion, focus protection, and route cleanup. The local reference adapter's `AOS once: true` is not the approved two-way reveal behavior.
- New visible strings require all four translated catalogs and regeneration before build.

## Required verification

1. Compare concrete section composition and responsive theme rules against reference templates; selector-name matching alone is insufficient.
2. Check rendered first-state HTML across five locales, one appropriate H1 per page, working internal links and required anchors, and no external HR2B forms/scripts/contact links.
3. Resolve all used image, srcset, font and CSS URL dependencies locally. The starting mirror was incomplete: 53 missing homepage media references, 36 missing core CSS asset references and 34 missing main CSS asset references were observed.
4. Run appropriate form, job, navigation, media, motion, catalog, SEO and hydration checks after the source is frozen. Test the changed interactions rather than weakening tests to accept missing functionality.
5. Measure final resource sizes and describe the actual quality/loading tradeoff. No unmeasured speed or Core Web Vitals claim.

## Visual verification limit

The supported browser/preview infrastructure has failed. No alternate browser/server route was used. DOM, CSS-source and controlled-event tests cannot establish computed layout, exact spacing, real animation smoothness, or pixel equivalence. Those remain unverified until the supported preview can be observed.

## Final integration evidence

Final build passed. Navigation/header, motion, media/hero, reference structures, job/application/admin/education/contact flows, sitemap and generated catalog checks passed. SEO verified 200 locale pages; hydration passed 15 route/locale cases. The asset audit checked 87 local paths across 203 HTML files with no missing deployed media/font/script/stylesheet. Main JS is 377.62 kB (118.01 kB gzip), CSS 105.35 kB (20.82 kB gzip); hero video remains 2.39 MB. These are build sizes, not measured transfer speeds or CWV.
