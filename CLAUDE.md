# CLAUDE.md

This file gives Claude (and Claude Code) project-specific context. General,
tool-agnostic conventions live in `AGENTS.md` — read that too.

## What this project is

PowerPlay ("airhome") is a static Airbnb-style property listing page built
with plain HTML/CSS/JS — no framework, no build tool, no backend. See
`architecture.png` (or `.pdf`) in the repo root for a visual overview of how
`index.html`, `styles.css`, and `script.js` fit together.

## Quick orientation for Claude

- Everything runs client-side in the browser. There is nothing to compile,
  bundle, transpile, or `npm install`.
- The three files at the repo root are the entire app:
  - `index.html` — structure for the header, gallery, listing details,
    booking widget, similar-listings grid, and all modals/lightbox.
  - `styles.css` — all visual styling and responsive behavior.
  - `script.js` — one IIFE containing all interactivity, split into commented
    sections (see `AGENTS.md` for the full list).
- "Properties Catalog & Active Property State" in `script.js` is the closest
  thing to a data layer — an in-memory array of listing objects. Selecting a
  property from the "similar listings" grid re-renders the page from that
  array; there is no routing or backend fetch involved.

## Preferred workflow when asked to change something

1. Locate the relevant section by its comment banner in `script.js` /
   `styles.css` (`AGENTS.md` lists them) rather than searching blindly.
2. Make the smallest change that satisfies the request, keeping vanilla
   JS/CSS idioms consistent with surrounding code.
3. Update matching comment banners/markup in the other two files if the
   change spans HTML + CSS + JS.
4. Since there's no test suite or build, describe how to manually verify the
   change (which UI flow to click through in a browser).

## Things Claude should default to doing

- Prefer editing the existing three files over creating new ones. If a
  change is genuinely large, ask before splitting into additional files,
  since there's no bundler to wire them together.
- Keep accessibility attributes (`aria-*`, focus trapping, keyboard
  handlers) intact and extend the same pattern for new interactive UI.
- Keep using remote Unsplash image URLs for any new imagery unless told to
  vendor assets locally.

## Things Claude should avoid doing here

- Don't introduce React/Vue/Svelte, a bundler, or a package.json unless the
  user explicitly asks for a rebuild/migration.
- Don't invent a real backend or payment integration — booking/reservation
  flows in this project are simulated UI only (see footer disclaimer: not
  affiliated with Airbnb, portfolio project).
- Don't restructure the file layout (one HTML/CSS/JS file each) without
  being asked.

## Repo layout

```
PowerPlay/
├── index.html
├── styles.css
├── script.js
├── architecture.png      # architecture diagram
├── AGENTS.md
├── CLAUDE.md              # this file
└── .claude/
    └── settings.json      # Claude Code project settings
```
