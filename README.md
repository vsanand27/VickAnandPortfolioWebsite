# Vick Anand — The AI CFO

Personal site for vickanand.com. The entire site is a **single self-contained
`index.html`** — styles, scripts, content, and images all live inside it. No build step,
no dependencies, no package manager. Works on any static host.

The only external requests are Google Fonts (Fraunces, Newsreader, IBM Plex Mono).

## Structure

```
index.html    The entire site: inline <style>, inline <script>, base64 images
CLAUDE.md     Guidance for Claude Code when editing this repo
```

Inside `index.html`, major regions are marked with banner comments
(`/* ===== HERO ===== */` etc.) in this order: `<head>` (meta, Open Graph, JSON-LD,
inline SVG favicon) → `<style>` (TOKENS → SHELL → HERO → SECTIONS → MOTION → RESPONSIVE)
→ markup → `<script>`.

Page sections, in order: hero, "The next chapter starts with a conversation" (`#rooms`),
01 Articles (`#writing`), 02 Start to Sold (`#record`), 03 Experience (`#experience`,
which contains Credentials), 04 Builds (`#builds`), 05 In Their Words (`#references`),
and contact (`#contact`).

### Legacy files — not used by the site

`assets/`, `css/style.css`, and `js/main.js` are left over from the previous multi-file
version of this site. **`index.html` does not reference any of them.** They are kept
because `assets/Vick-Anand-Resume.pdf` and `assets/img/vick-anand.jpg` may be linked
from LinkedIn or elsewhere. Editing them does not change the site.

## Editing content

Some sections are data-driven and some are hand-written; which one you edit depends on
the section.

**Edit the JavaScript arrays** at the top of the `<script>` block:

- `LINKS` — LinkedIn, GitHub, and email, injected into every `[data-link]` element.
- `WRITING` — the Articles section, newest first. The first entry automatically gets the
  featured treatment. `img` holds a base64 data URI cover; omit it and the card falls
  back to a typographic `cover` string.
- `TOOLS` — the Builds section. Copy a block to add a project; leave `url: ""` and the
  card renders without a link.

**Edit the HTML directly** for the hero, `#rooms`, Start to Sold, Experience,
Credentials, In Their Words, and contact.

Section headings carry a manual number (`01`, `02`, …) in a `<span class="secnum">` —
renumber by hand if you insert or reorder a section.

Colors, fonts, and spacing are CSS custom properties on `:root` at the top of the
`<style>` block: ledger-paper ground, ink, and a banker's-green accent, plus one
editorial color per section. The same hex values are repeated in the `TAGC` map in the
JavaScript, which colors the tag chips — **change both** or the chips drift out of sync.

## Images

All 10 images are embedded directly in `index.html` as base64 data URIs, which is why
the file is ~1.2 MB. There is no image folder to update for anything currently on the
page — replace the data URI in place.

## Updating the site

1. Ask Claude for the change and put the new `index.html` in this folder.
   Claude reads the live file from this repo before editing, so **push before asking for
   the next change** or the edit will be made against a stale copy.
2. Commit and push:

   ```
   git add -A && git commit -m "update" && git push
   ```

## Preview locally

```
python -m http.server 4173
```

Then open http://localhost:4173

## Deploying

No build step is needed; any static host works.

- **GitHub Pages**: enable Pages on `main` in Settings → Pages. Note this is a *project*
  repo, not a `vsanand27.github.io` user site, so the default URL is path-scoped
  (`vsanand27.github.io/VickAnandPortfolioWebsite`) unless a custom domain is added.
- **Netlify**: drag the folder onto https://app.netlify.com/drop, then add the custom
  domain in site settings.
- **Wix** cannot host raw HTML, so point vickanand.com DNS at whichever of the above you
  choose.

There is no `CNAME` file in the repo — a custom domain is configured in the host's
settings, not in version control.
