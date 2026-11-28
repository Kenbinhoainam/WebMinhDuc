# MDV2-04 — UX/UI & Design System Specification

**Version:** v0.1.0-DRAFT · **Date:** 28/11/2026. This is a candidate production UX specification, **not** a replacement for the already approved prototype-specific selection SEL-2026.11.27-v1.0.0 / MDU-SDD-v1.0.0.

## Context and visual direction

- Brand should look polished, bright, modern and professional with accessible typography and color. Sprint 1 identified blue/white/red brand colors; exact final palette and use require PO approval.
- REF-UI-01 (minhduccorp.com.vn) is the customer reference for corporate layout and storytelling. HR2B and SuccessHRVN were supplementary research references, not automatically approved assets or complete pixel templates.
- B2B is the business focus recorded in Sprint 1; B2C worker journey must remain visible and usable. Exact visual proportion must be approved before changing the layout.
- Avoid invented claims, copied logos, unauthorized partner media, mock metrics presented as real company outcomes.

## Shared component specification

Component groups: Header/Navigation; logo and locale switcher; Hero and video states; service and job cards; CTA/buttons; forms F01–F06; filter chips, search and pagination; modal/accordion/tab; editorial and partner rails; ADMIN responsive table; Footer and accessibility helpers.

For each component, provide source code paths, reference screenshot/state, proposed design tokens, behavior across input methods, responsive constraints, edge states, approved change IDs and QA evidence. Shared components must be completed before page-specific changes and have a single file owner to avoid multi-agent overlaps.

## Motion/microinteraction requirements

The approved prototype SDD has 88 Micro & Motion selections, each with trigger, feedback, duration, interruption, keyboard/touch/reduced motion and acceptance. Suggested common tokens T0=0, T1=120, T2=180, T3=240, T4=320 ms ease-out are design values, not universal WCAG thresholds; spring/Undo/salary sorting/route fade and other conditional features need separate scoped decisions.

Functional state, ARIA and focus must be updated immediately and independently of transitionend. Repeated click, cancel/unmount, route change, visibility change and reduced-motion switching must not leave a hidden overlay, stale callback or unresponsive control. User pause of auto-moving content should not be revoked by leaving focus.

## Devices and accessibility

Test phone, tablet, laptop/desktop and wide screen groups, using real content-driven breakpoints. At minimum cover representative viewport CSS widths 320,390,430,768,820,1024,1280,1440,1920 plus actual breakpoints and 200% zoom. Browser keyboard and touch tests must include real hardware/device service where required; an iframe screenshot alone does not verify touch, file selection or virtual keyboard.

Five locales VI, EN, Simplified Chinese, KO, JA require long-text fallback, valid links, labels, error/status/receipt translations and no truncated glyphs. Reduce-motion mode should preserve all information and manual controls. Automated accessibility tools supplement, but do not replace, a scoped manual audit.

## Next deliverables / approval

Versioned reference board of home/about/services/jobs/forms, semantic palette and typography, signed breakpoint/motion specification, asset-rights inventory, acceptance cases and independent QA matrix. Work only on individually approved SDD scope; commit and PUSH every AI code/document/test change to a GitHub branch before handoff, with PR and verifiable SHA.
