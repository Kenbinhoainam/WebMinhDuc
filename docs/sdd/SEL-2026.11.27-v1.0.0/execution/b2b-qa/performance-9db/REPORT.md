# Focused lab measurements — archived 9db Site build

Chromium 156.0.8078.79 · VI only · 1440×900 desktop and 390×844 touch emulation · 24 navigations (3 fresh contexts and 3 repeat navigations per route/device).

Source `9db1adb2d7f84371dd7b954038a5c3ae2643a469`; Site bytes `429a3989859c8ed4b473773ffeb99c95e7bac4123a41182fce5d27134aa52ba7`. All 549 dist files match the rc7 archive. This is the archived 9db build, **not a rerun on current d67**.

Local file fulfillment, no real network or compression, CPU throttle 1× on a shared 5-vCPU Linux host. HTTP cache is disabled: 'repeat' reuses the browser context, not a warm HTTP cache. Native video playback is enabled through a Chromium launch flag; the middle of the film is skipped, then the browser's trusted ended event is observed.

| Route | Viewport | Condition (n=3) | Initial LCP median [min–max], ms | Initial CLS median | Native-end CLS median |
|---|---|---|---:|---:|---:|
| / | desktop | fresh context | 428.0 [300.0–728.0] | 0.000737 | 0.001814 |
| / | desktop | repeat, HTTP cache off | 144.0 [124.0–220.0] | 0.000737 | 0.000736 |
| / | mobile | fresh context | 252.0 [244.0–252.0] | 0.004440 | 0.1146 |
| / | mobile | repeat, HTTP cache off | 156.0 [132.0–248.0] | 0.004440 | 0.1146 |
| /partners | desktop | fresh context | 268.0 [260.0–356.0] | 0.002435 | — |
| /partners | desktop | repeat, HTTP cache off | 172.0 [108.0–244.0] | 0.002435 | — |
| /partners | mobile | fresh context | 220.0 [172.0–248.0] | 0.000000 | — |
| /partners | mobile | repeat, HTTP cache off | 192.0 [132.0–240.0] | 0.000000 | — |

The latest initial LCP candidate is sampled after fonts are ready plus 2 seconds, before interaction. These are local lab observations, not p75 field LCP, INP, real mobile performance or a full Core Web Vitals pass. Raw ResourceTiming sizes include uncompressed media/range payloads and cannot be treated as production startup transfer sizes.

**Observed mobile transition:** all 6 mobile runs produced native-end CLS 0.114600. Hero height changes from 508.219 to 449.375 px, moving the next section upward 58.844 px; player controls also change position. Desktop end-phase CLS spans 0.000736–0.001814. Raw shift rectangles and recent-input flags are retained. Consider reserving consistent hero geometry across playback/end states in a separately approved change; no application code was changed.

| Partner strip (n=6 per viewport) | Main-thread task time while visible, ms/2s window | Offscreen, ms/2s window | Visible movement | Offscreen movement | New requests in both windows |
|---|---:|---:|---:|---:|---:|
| desktop | 84.64 [71.25–116.70] | 6.48 [4.17–12.30] | 44–45px | 0–0px | 0 |
| mobile | 75.82 [48.98–209.49] | 7.24 [3.49–21.68] | 44–46px | 0–0px | 0 |

These are whole-page CDP main-thread duration deltas, not process CPU utilization or battery measurements. Offscreen scrolling was real; no synthetic document visibility event was used. All 5 mapped logos decoded, both forced-failure tests retained all 5 visible text names. The JEILTECH VINA→glovitech.webp mapping is intentional, not inferred wrong from its filename.

Across the 24 measurement runs, no JavaScript exceptions, console warnings/errors, uncanceled network errors or media error events were recorded. The 12 canceled media requests correspond to intentional playback/seek transitions. Both blocked-image cases were separate deliberate failures.

Evidence: `measurements.json` (raw CDP/PerformanceObserver data), `summary.json`, `observations.jsonl`, and `tests/s2-w2-performance.py`. Fields retain URL, viewport, cache condition, trial, timestamps, host load and rAF calibration. Remaining: live network/throttling, real HTTP warm-cache, other locales/viewports, physical hardware, background-tab CPU, field data and an approved performance budget.
