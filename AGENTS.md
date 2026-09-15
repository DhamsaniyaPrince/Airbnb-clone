# AGENTS.md

Instructions for AI coding agents (Codex, Cursor, Copilot Workspace, Claude Code,
etc.) working in this repository.

## Project summary

**PowerPlay** ("airhome") is a static, front-end-only clone of an Airbnb listing
page. There is no backend, build step, framework, or package manager — it is
plain HTML, CSS, and vanilla JavaScript loaded directly by the browser.

```
PowerPlay/
├── index.html     # Single page: markup for every section, modal, and the lightbox
├── styles.css     # All styling (layout, theme, responsive rules, animations)
├── script.js      # All behavior, wrapped in one IIFE, organized by feature section
├── AGENTS.md       # This file
├── CLAUDE.md       # Claude-specific project notes
└── .claude/        # Claude Code project settings
```

## How to run it

There is no build/install step.

- Open `index.html` directly in a browser, **or**
- Serve the folder so relative asset paths resolve identically to production:
  ```bash
  npx serve .
  # or
  python3 -m http.server 8080
  ```

## Code organization

`script.js` is a single IIFE (`(() => { 'use strict'; ... })()`) divided into
clearly commented sections. When adding a feature, add a new section rather
than scattering logic across existing ones. Current sections, in file order:

1. Utilities (`$`, `$$`, `fmtUSD`, focus trapping)
2. Toast notifications
3. Header scroll state + compact search pill
4. Scroll reveal animations (IntersectionObserver)
5. Properties catalog & active property state (the in-memory "database")
6. Gallery lightbox
7. Generic modal open/close helper (used by amenities / host / share modals)
8. Save / heart toggle
9. Show more / less description
10. Reviews carousel
11. Guests popover (stepper) with dynamic pricing
12. Date-range calendar popover
13. Property selection & homepage synchronization
14. Reserve buttons
15. Similar listings grid ("Select Property")

`styles.css` mirrors this structure with matching comment banners.
`index.html` mirrors it too, with `<!-- ==== SECTION ==== -->` comments.

## Conventions

- **No frameworks, no build tools, no dependencies.** Keep it that way unless
  the user explicitly asks to introduce a bundler/framework.
- **Vanilla DOM APIs only** (`querySelector`, `addEventListener`, template
  literals for rendering). Follow the existing `$` / `$$` helper pattern
  instead of re-querying `document` directly.
- **Accessibility matters in this project**: existing code uses `aria-*`
  attributes, `role`, focus trapping in modals, and keyboard handlers
  (Escape to close, arrow keys in the lightbox). Preserve and extend this
  pattern for any new interactive element — don't add a click-only control.
- **Images** are loaded from Unsplash via URL, not stored locally. Keep using
  remote URLs unless asked to vendor assets.
- **State** lives in plain JS objects/arrays in `script.js` (see "Properties
  Catalog & Active Property State"); there is no external state library.
- Keep the single-file-per-concern layout (one HTML, one CSS, one JS file).
  Do not split into modules/components unless explicitly requested, since
  there is no bundler to reassemble them for the browser.

## Making changes

- Match the existing code style: 2-space indentation, semicolons, `const`
  over `let` where possible, small named helper functions.
- When adding a UI section, add matching markup in `index.html`, styles in
  `styles.css`, and behavior in `script.js`, keeping section comments in
  sync across all three files.
- This is a portfolio/demo project (see footer: "This is a portfolio
  project, not affiliated with Airbnb"). Booking, payment, and search are
  simulated client-side — there is no real backend to wire up.
- Test changes by opening `index.html` in a browser and manually exercising
  the gallery, modals, date picker, guest stepper, and listings grid. There
  is currently no automated test suite.

## Do not

- Do not add a package.json / node_modules / bundler unless asked.
- Do not introduce a frontend framework (React, Vue, etc.) unless asked.
- Do not remove the accessibility attributes/behaviors already present.
