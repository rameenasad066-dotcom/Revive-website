# Revive Organisation Website

Static multi-page site for Revive Organisation (medical-student-run Pakistani NGO). Plain HTML/CSS/vanilla JS, no build step, deploys as-is to Netlify.

## History

The homepage was originally generated in an external website-builder tool and uploaded here as a proprietary bundle (`Revive Homepage.dc.html` + `Revive Homepage Standalone.html` + `support.js` + `image-slot.js` + `_ds/`). Those files are kept in the repo root as reference/backup but are **not** the live site — they used a custom-element runtime (`<x-dc>`, `<image-slot>`, `sc-if` templating) that only works as a single bundled page and can't support real multi-page routing or shared components. The homepage was ported into plain semantic HTML (`index.html`) preserving the exact visual design, and the site was restructured around shared nav/footer partials from there.

## Structure

```
index.html                  — home (real content, ported from the uploaded design)
lives/index.html            — /lives/  (placeholder)
pharmacy/index.html         — /pharmacy/ (placeholder)
research/index.html         — /research/ (placeholder)
donate/index.html           — /donate/ (placeholder)
about/index.html            — /about/ (placeholder)
enroll/index.html           — /enroll/ (placeholder)
partials/nav.html           — header, desktop nav, mobile nav overlay — fetched into every page
partials/footer.html        — footer — fetched into every page
css/style.css               — single shared design system (brand variables, section-numbered)
js/include.js                — fetches both partials into <div data-include="nav|footer">,
                                marks the active nav link, wires the mobile overlay
```

Every page follows the same pattern:
```html
<div data-include="nav"></div>
...page content...
<div data-include="footer"></div>
<script src="/js/include.js"></script>
```
To add a new page: create `<route>/index.html` with that pattern, and add the link to both `partials/nav.html` and `partials/footer.html` — every existing page picks it up automatically since nav/footer are fetched, not copy-pasted.

**Routing convention**: folder + `index.html` (e.g. `/lives/index.html` served at `/lives/`), matching how Netlify serves pretty URLs natively with zero config. All internal links use a leading slash (`/lives/`, not `lives/` or `lives.html`).

## Brand tokens (css/style.css `:root`)

| Token | Hex | Usage |
|---|---|---|
| `--teal-deep` | `#0B3D3A` | Primary dark backgrounds, headline color on cream |
| `--teal-deepest` | `#082722` | Footer background |
| `--teal-mid` | `#14655F` | Body copy on cream/pale backgrounds |
| `--teal-bright` | `#2AA897` | Accent, Donate button fill, hover states |
| `--teal-pale` | `#D8EDEA` | Section backgrounds, placeholder-page background |
| `--cream` | `#FAF9F4` | Page background, text on dark |

Fonts: `Big Shoulders` (headlines, 700–900 weight, uppercase), `Work Sans` (body/nav links), `JetBrains Mono` (eyebrow labels, buttons/CTAs, small caps meta). Loaded from Google Fonts in every page's `<head>`.

## Dev server

No Python or Node is installed on this machine (only non-functional Windows Store stubs). Use the PowerShell static server:
```
powershell -NoProfile -ExecutionPolicy Bypass -File ".claude/serve.ps1" -Port 5602
```
It resolves pretty URLs the same way Netlify does: exact file → `<path>/index.html` → `<path>.html` → 404. This matters because the site's nav links (`/lives/`, `/pharmacy/`, etc.) need that fallback to work locally.

`fetch()` for the nav/footer partials requires serving over `http://`, not `file://` — opening `index.html` directly by double-click will not load the nav/footer (CORS blocks `fetch` on `file://`).

## Known preview-environment limitations

The Browser-pane preview in this environment has confirmed gaps in dynamic rendering that are specific to this sandboxed renderer, not bugs in the site. Each was isolated with a minimal reproduction before concluding this — don't "fix" the source code over these, and don't re-litigate them without a similarly isolated test:

1. **`preview_screenshot` times out.** Use `read_page`, `get_page_text`, and `javascript_tool` instead.
2. **Descendants of a `position: sticky` ancestor don't reflow on dynamic size change.** Confirmed by setting the ancestor to `position: static`, which made the exact same CSS apply instantly.
3. **Native `loading="lazy"` images never fire**, even after `scrollIntoView()` + waiting. Confirmed the files load instantly the moment `loading` is switched to `eager`, and are valid 200s via `curl`. Don't remove `loading="lazy"` from real content images to chase this.
4. **Anchor `#hash` scrolling doesn't work** — neither a real click nor setting `location.hash` via JS moves `window.scrollY`.
5. **`transform` changes on `position: fixed` elements don't update rendered position**, confirmed with a from-scratch `position:fixed` div outside any app markup — `getBoundingClientRect()` stays frozen at the pre-transform value even after the transition should have completed. This is why the mobile nav overlay (`.mobile-nav-panel`, a fixed-position slide-in panel) can't be visually verified in this preview — the class-toggle JS and CSS transition are correct (verified: `.open` class applies, `matches()` confirms the rule, `inert` toggles correctly), only the actual compositor-level position update doesn't reflect in this headless renderer.

Real mobile browsers (the actual audience — Instagram traffic) handle all five natively. Verify structural/logical correctness via DOM state (classes, computed non-animated properties, `inert`, network requests) rather than visual position/timing in this preview.
