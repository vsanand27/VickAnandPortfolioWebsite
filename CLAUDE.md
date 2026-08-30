# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`vickanand.com` — a one-page personal site for Vick Anand ("The AI CFO"). The entire
site is a **single self-contained `index.html`**: styles, scripts, content, and images
all live inside it. There is no build step, no package manager, no dependencies to
install, no test suite, and no CI. The only external requests are Google Fonts
(Fraunces / Newsreader / IBM Plex Mono).

## Unreferenced files in the repo

`index.html` contains **zero** references to `assets/`, `css/`, or `js/` — grep confirms
no matches. These are leftovers from the previous multi-file site and are not loaded by
the live page:

- `css/style.css`, `js/main.js`
- `assets/fonts/Geist-Variable.woff2`, `assets/fonts/GeistMono-Variable.woff2`
- `assets/img/vick-anand.jpg`, `assets/img/favicon.svg`, `assets/img/articles/*.png`
- `assets/Vick-Anand-Resume.pdf`

They are kept deliberately (the resume PDF and headshot may be linked from elsewhere).
Do not delete them without asking, and do not assume editing them changes the site.

## Commands

There is nothing to build, lint, or test. The useful commands are:

```bash
# Local preview (no build — just serve the folder)
python -m http.server 8000     # then open http://localhost:8000

git add -A && git commit -m "update" && git push
```

Whether a push auto-deploys depends on the host wired up to this repo; that is not
recorded in version control (see Repository and deployment below).

## Working with index.html — read this first

The file is ~1.19 MB across ~1665 lines, but **almost all of that weight is base64
JPEG data URIs embedded in the `WRITING` array** (several single lines exceed 250,000
characters). Never `cat` the file or read it whole — it will flood the context window.
Use `sed -n 'START,ENDp'` ranges, `grep -n`, and pipe through `cut -c1-200` to clip the
base64 lines.

To orient yourself, grep for the banner comments (`grep -n '/\* ==='`), which mark every
major region. The file is ordered:

| Region | Roughly | Contents |
|---|---|---|
| `<head>` | top | meta, Open Graph, JSON-LD schema, inline SVG favicon, font `<link>` |
| `<style>` | ~50–806 | all CSS, organized by banner comment: TOKENS → SHELL → HERO → SECTIONS → MOTION → RESPONSIVE |
| markup | ~807–1376 | `.masthead`, `.stripnav`, `.rail`, then `<main>` with one `<section>` per topic |
| `<script>` | ~1377–1663 | numbered content arrays, then a single IIFE labeled `RENDER` |

Line numbers drift as content is added; the banner comments are the stable anchors.

## Content model — know which half you're editing

This is the thing that trips people up: **some sections are data-driven, others are
hand-written HTML.** Where you make a change depends on the section.

**Driven by JS arrays at the top of `<script>`** (edit the array, not the markup):
- `LINKS` — LinkedIn / GitHub / email, injected into every `[data-link]` element
- `TOOLS` — the Builds section; rendered into `#builds-list`. Copy a block to add a
  project. Leaving `url: ""` renders the card without a link.
- `WRITING` — the Articles section; rendered into `#writing-list`, newest first. The
  first entry gets the `.wcard--feat` treatment automatically. `img` holds a base64
  data URI cover; omit it and the card falls back to a typographic `cover` string.

**Hand-written HTML inside `<main>`** (edit the markup directly): the hero, `#rooms`,
`#record` ("Start to Sold"), `#experience`, `#references`, and `#contact`.

Section `<h2>`s carry a manual `<span class="secnum">` number (`01`, `02`, …) — renumber
them by hand if you insert or reorder a section.

## Design system

All color, type, and spacing decisions come from CSS custom properties on `:root`:
ledger-paper ground (`--ground`, `--desk`), ink (`--ink`, `--steel`), and a
banker's-green accent (`--accent`). Each section has an assigned editorial color
(`--c-indigo` writing, `--c-oxblood` experience, `--c-amber` builds, `--c-plum`
references); the same hexes are duplicated in the JS `TAGC` map that colors the tag
chips, so **a palette change has to be made in both places**. The signature divider is
the `.footed` double-rule (an accountant's footed total) — reuse it rather than
inventing new dividers.

## Progressive enhancement is deliberate — don't break it

The JS is defensive by design and new code should match:

- Every enhancement (scrollspy, reading-progress bar, scroll reveal, count-up stats) is
  wrapped in its own `try/catch`, and the reveal handler's `catch` explicitly reveals
  everything rather than leaving content hidden.
- The stat numbers in `#record` are **real values in the markup**; `.cu` count-up only
  animates over them when `IntersectionObserver` exists and `prefers-reduced-motion` is
  not set.
- `.reveal` / `.sr` elements are only hidden once `.is-ready` / `.js` is set on the
  document, so a JS failure leaves a fully readable page.

If you add markup that is invisible until JS runs, you have broken the no-JS fallback.

All interpolated array strings pass through `esc()` before hitting `innerHTML` — keep
new template code doing the same.

## Repository and deployment

Remote is `https://github.com/vsanand27/VickAnandPortfolioWebsite` (public). This is a
*project* repo, not a `<user>.github.io` user site, so the default GitHub Pages URL is
path-scoped (`vsanand27.github.io/VickAnandPortfolioWebsite`) unless a custom domain is
configured. There is no `CNAME` file in the repo, so any custom domain is set through
Settings -> Pages rather than in version control.

## Known TODO

`LINKS.linkedin` is still the placeholder `https://www.linkedin.com/in/REPLACE-ME`.
