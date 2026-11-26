# Nullyn AI

Website for Nullyn AI, an approach to live microphone feedback suppression, prepared for GitHub Pages at [nullyn.ai](https://nullyn.ai).

Type is self-hosted: **Syne** for headlines, **Manrope** for body copy, and **IBM Plex Mono** for figures and labels. The `.woff2` files and SIL Open Font License texts are in `fonts/`.

The site is a static front end (`index.html`, with CSS inlined). There is no build step and no custom GitHub Actions workflow, matching the [desisoundguys](https://github.com/krish-mm/desisoundguys) setup.

## Hosting (same model as desisoundguys.com)

When Krish approves going live:

- Create a public GitHub repository (suggested name: `nullyn`) under `krish-mm`
- Push this `main` branch
- Enable GitHub Pages from `main`, site root `/`
- Set the custom domain to `nullyn.ai` (this repo already includes a `CNAME` file)
- GitHub then runs its built-in `pages-build-deployment` workflow; no workflow file is required in the repo

This repository is a local draft. Do not push, enable Pages, or change DNS until approved.
