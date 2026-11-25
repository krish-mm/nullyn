# Nullyn

Website for Nullyn, an AI approach to live microphone feedback suppression, prepared for GitHub Pages at [nullyn.com](https://nullyn.com).

The site is a static front end (`index.html`, with CSS inlined). There is no build step and no custom GitHub Actions workflow, matching the [desisoundguys](https://github.com/krish-mm/desisoundguys) setup.

## Hosting (same model as desisoundguys.com)

When Krish approves going live:

- Create a public GitHub repository (suggested name: `nullyn`) under `krish-mm`
- Push this `main` branch
- Enable GitHub Pages from `main`, site root `/`
- Set the custom domain to `nullyn.com` (this repo already includes a `CNAME` file)
- GitHub then runs its built-in `pages-build-deployment` workflow; no workflow file is required in the repo

This repository is a local draft. Do not push, enable Pages, or change DNS until approved.
