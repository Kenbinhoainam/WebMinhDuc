# HR2B reference port — v10

The latest request makes HR2B's existing presentation the reference, with Minh Đức copy and identity. This replaces the earlier custom visible desktop navigation and additional homepage sections. Existing demo workflows, five languages and the Minh Đức two-level sitemap remain.

## Evidence and downloaded reference

- Public web reader inspected HR2B home, About, services, staffing, executive search, HR consulting, job seekers, careers, contact, news, events, testimonials and legal pages on 2026-11-16. Reader extracts are saved under `/workspace/reference/hr2b-live-20261116/`.
- Direct raw HTTP downloads from `www.hr2b.com` remain blocked by the environment's enforced destination allowlist (CONNECT 403). The requested setting change is pending; this is not a freshly crawled raw HTML mirror.
- The user-provided Drive reconstruction supplies 19 original full-page HTML snapshots, 16 captured page templates, shared header/footer, original theme CSS, original JavaScript and media. All 429 distinct local HR2B media references in those captured templates resolve after Drive recovery. Provenance is recorded in `drive-source/assets-provenance.jsonl`; 451 records include recovered fonts and other assets.
- The reference snapshot is retained outside the product at `/workspace/reference/hr2b`. The deployed site includes only active assets, local subset fonts and scoped styles. Original trackers, third-party forms and HR2B submission endpoints are not executed.

## Implementation

- Shared compact transparent header, utility pills and two-level drawer; dark foreground on routes without a banner. Removed the former desktop hover-menu branch and its obsolete styling.
- Original viewport-relative desktop rem scale, containers, spacing, font families, pill buttons, image banner/title/breadcrumb and footer composition. Footer subscription opens the existing demo form in an accessible dialog.
- Homepage follows the source section sequence, with actual source service icons and decorations, customer/partner compositions, news rail, event presentation and four video thumbnails. Removed the extra homepage FAQ and CTA; removed its corresponding FAQ structured data.
- About, service index/details, jobs/detail/careers, news/details, events, partners, contact and legal pages follow their captured page families. Reference-only corporate facts are replaced with Minh Đức content or visibly illustrative role/document cards.
- Hero uses the confirmed original 3-second dwell and 300-ms transition. Its 2:1 layout can grow with translated text or zoom. The existing 1600px local video, poster-first loading, data-saving and reduced-motion behavior remain.
- The homepage's reference cutout was edited with image generation to replace its laptop logo with Minh Đức. The prior custom homepage CSS (124 rules) and two unused files were removed. Original generated PNG is retained in `/workspace/generated_images`; the site uses optimized local WebP. The image remains explicitly illustrative.
- Four intro thumbnails open the same clearly disclosed illustrative clip on request. They do not imply four real Minh Đức films. Customer and partner areas use the supplied Minh Đức partner names; no HR2B client list is relabeled as Minh Đức clients.

## Review and validation

Independent review required structural rework rather than accepting color/spacing changes. Source-composition tests cover eight page types in five locales, local img/srcset closure, source homepage order, actual featured-news controls, consultation forms and retained anchors. Other suites cover navigation, locales, motion, video, applications, contact/admin forms, SEO output and hydration.

Browser rendering remains unavailable under the previously observed preview infrastructure failure. Source/DOM checks cannot certify pixel-perfect screenshots, all device layouts, animation smoothness, Lighthouse or real-network loading performance. The original raw live crawl also remains pending the network setting update. These limits must be stated rather than calling the port an exact visual match.

Final checks: build; flagship/header/reference; sprint/review/sitemap/catalog; SEO (200 pages); hydration (15 cases); local assets (87 paths / 203 HTML files, zero missing). Main JS 377.62 kB / 118.01 kB gzip; CSS 105.35 kB / 20.82 kB gzip. Raw reference archive includes 19 full-page source snapshots and restored media; the prototype source is packaged separately.
