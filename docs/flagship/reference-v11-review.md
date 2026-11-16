# Independent review — v11 live-source follow-up

The final source includes the latest requested seven-group desktop menu at 1280px and wider, nineteen second-level destinations, no desktop arrows, and the smaller-screen drawer. This is an intentional Minh Đức customization. The shared header uses a transparent initial state and a light scrolled state.

The integration review found and verified fixes for overlay stacking, observer failure, stale callbacks, touch interaction, animation cancellation and scroll-snap restoration. Previous/next controls pause automatic movement; the explicit Play control can resume while focused. The independent five-locale interaction sequence passes through its media checks. The integration owner is running the final compiled-CSS checks after the frozen build.

The final testimonial implementation was inspected directly: all three stories remain in the DOM, the flex rail stretches cards to a common height, desktop shows two cards and mobile shows one, and automatic movement uses the same cancellable 500ms helper as the other rails. It no longer swaps a pair of text cards abruptly. Native navigation respects reduced motion, the rail is keyboard reachable, and automatic changes use `aria-live="off"`.

`tests/reference-structure.mjs` passed after the final testimonial change: ten page types across five locales, local image/srcset availability, article/event/history structures, functional featured-news controls, retained forms/anchors and no restored HR2B service endpoints. The focused carousel suite also passed after its final interaction fix. No remaining source-level blocker was found.

The live-source archive is `/workspace/reference/hr2b-live-current-20261116/`. Browser appearance, computed responsive layout and actual animation smoothness remain unverified: supported CUA still reports a requirements error and the managed preview relay times out. No alternate browser path was used. Build sizes are not loading-speed or Core Web Vitals measurements.

## Final integration checks

The final source restored the hero's explicit white foreground/dark fallback and keyboard-only video-control styling after removal of an old stylesheet. The hero regression check covers the foreground contract. Build, navigation, locale selector, partners, carousel, reversible motion, media preference/race handling, hero, compiled CSS, hover header, reference structures, sprint flows, reviewer routes, sitemap, catalog parity, SEO (200 pages) and hydration (15 route/locale states) passed. Asset audit found 89 local paths across 203 HTML files and no missing dependencies.

Final main JavaScript: 385.39 kB (120.15 kB gzip); CSS: 112.45 kB (22.00 kB gzip). These are bundle measurements, not browser loading-speed measurements.

Favicon follow-up uses the existing square Minh Đức logo without cropping or invented artwork. Browser PNG/WebP and Apple touch PNG links are present in all 203 generated HTML entries; pixel-equivalence, file signatures and dimensions were checked. The final favicon/head test and SEO audit passed.

The Google Sheet inventory contains 29 logical resources, 59 actual files and 88 grouped placements, including image metadata and favicon uses. All file sizes were checked against local assets; unused downloaded references are excluded.
