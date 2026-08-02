# Vick Anand - Portfolio Website

New portfolio site replacing the old vickanand.com. Pure static HTML/CSS/JS: no build step, no dependencies. Works on any static host.

## Structure

```
index.html              The whole site (all sections)
css/style.css           All styling (design tokens at the top)
js/main.js              Scroll reveals, nav state, metric count-up, mobile menu
assets/img/             Headshot + favicon
assets/img/articles/    LinkedIn article cover images (Writing section)
assets/fonts/           Self-hosted Geist + Geist Mono
assets/Vick-Anand-Resume.pdf
```

## Editing content

Everything visible lives in `index.html`. Sections are marked with comments
(`<!-- ==== HERO ==== -->` etc.). Sections, in order: hero, metrics, about,
experience, AI, writing (LinkedIn articles), projects, recommendations,
credentials, contact. Colors and fonts are CSS variables at the
top of `css/style.css` (`:root` = dark theme, the `prefers-color-scheme: light`
block = light theme).

To swap the headshot, replace `assets/img/vick-anand.jpg` with a new photo
(square crop, 640px+; it renders as a circle in the hero). The current one is
the LinkedIn profile photo, upscaled and sharpened from a 272px capture, so a
fresh high-resolution original would be a worthwhile upgrade.

To update the resume, replace `assets/Vick-Anand-Resume.pdf` (keep the filename).

## Preview locally

```
python -m http.server 4173
```

Then open http://localhost:4173

## Deploying

Any of these work; no build step needed:

- **Netlify**: drag the whole folder onto https://app.netlify.com/drop, then add
  the custom domain vickanand.com in site settings.
- **GitHub Pages**: push this folder to a repo (e.g. `vsanand27/portfolio`),
  enable Pages on the main branch, add the custom domain.
- **Existing Wix hosting**: Wix cannot host raw HTML files, so point the
  vickanand.com DNS at Netlify or GitHub Pages instead.
