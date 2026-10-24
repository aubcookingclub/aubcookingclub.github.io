# AUB Cooking Club website

Single-file static site: `index.html` (HTML, CSS and JS together, no build step).
Workshop content lives in the `EVENTS` array near the top of the `<script>`.
Photos are the club's real workshop photos (see the photos note below). Events hold recipes in a `recipes` array (one card and PDF each); Chapter 02 has the real Pink Pasta and Beetroot Pasta recipes, merged from the workshop table sheets.

## Rules
- **Always ask me before running `git push`.** Commit locally as needed, but never push without my explicit go-ahead in that message.
- Keep the site a single `index.html` unless I say otherwise.
- Downloads use standard browser downloads (Blob + anchor), so they work on GitHub Pages.
- **Keep all memory for this project inside the AUB COOKING WEBSITE folder.** Save project notes in the "Notes" section of this CLAUDE.md, never in the user-profile memory folder (`~/.claude/projects/.../memory`).

## Notes
- GitHub: public repo https://github.com/aubcookingclub/aubcookingclub.github.io (owned by the free `aubcookingclub` organization; `mariammansour308` is its admin), remote `origin`, branch `main`. Signed in with GitHub CLI as `mariammansour308`.
- Live site (GitHub Pages, free, from `main` / root): https://aubcookingclub.com/ (HTTPS enforced). Every push to `main` goes live, so a push is a publish. `www.aubcookingclub.com` and `aubcookingclub.github.io` redirect to it.
- Custom domain `aubcookingclub.com` is registered at GoDaddy (the user manages it; no API access). DNS set 2026-10-24: four A records for `@` → 185.199.108.153 / .109 / .110 / .111, and CNAME `www` → aubcookingclub.github.io. The repo's `CNAME` file (created by GitHub) must stay.
- On 2026-10-24 the repo moved from `mariammansour308/aub-cooking-website`; the old Pages URL (mariammansour308.github.io/aub-cooking-website) now returns 404.
- Commits use the repo-local identity `mariammansour308` with GitHub's no-reply email, so the personal Gmail address stays out of the history.
- The repo was made public on 2026-10-24 so free GitHub Pages could be used; everything in it, including history, is publicly visible.
- An older copy, `AUB Cooking Club · Our Recipe for Memories.html` (artifact-only downloads), was removed; it is still in the first commit (b5bee71) if ever needed.
- Photos (added 2026-10-24): the club's original uploads (WeTransfer folders, about 1.4 GB, including .mov videos) sit in `photos/<event-slug>/wetransfer_*/` and are git-ignored, because they are large and carry camera/location metadata. The site uses a hand-picked set (33 cake, 31 pasta; blurry shots and near-duplicates left out, no videos): `photos/<slug>/<slug>-NN.jpg` at 1600px (lightbox and download) and `photos/<slug>/thumb/` at 640px (tiles, collage, cards), re-encoded with no metadata. Alt text and sizes live in the `PHOTOS` object in `index.html`; `photos[0]` is the cover, `photos[3]` the small hero photo, `recipePhotos` picks each recipe card's photo, and `homeView` picks the collage and cookbook photos by index.
<!-- Project memory: facts, decisions and preferences learned across sessions go here. -->
