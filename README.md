# AUB Cooking Club · Our Recipe for Memories

Photos, memories and recipes from the AUB Cooking Club's workshops.

The whole site is one static page, `index.html`. Open it in any browser to view it, with no build step needed.

## Hosting
The repository is private. On a free GitHub plan, GitHub Pages only works for public repositories, so to host the site
either make the repo public or use a paid plan. Then go to **Settings → Pages → Deploy from a branch → `main` / root**.

## Adding a workshop
Edit the `EVENTS` array near the top of the script in `index.html` (title, date, caption, photos, recipe).

## Updating the site
Open a terminal in the project folder, then run:
```
git add .
git commit -m "Describe the change"
git push
```
