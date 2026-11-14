# Akademi SAP Admin Proyek

Static Astro 7 site, deployed to Cloudflare Workers static assets via Wrangler. Content was migrated from the Claude artifact "Akademi SAP Admin Proyek".

## 1. Quick start

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Test the production build locally: `npm run preview` (builds `dist/`, then runs `wrangler dev`)

## 2. Deploy

1. One time only: `npx wrangler login`
2. Build and deploy: `npm run deploy`

Deploy from `main` only.

## 3. Project layout

Generated from the artifact by `npm run sync`. **Do not hand-edit these files.** Re-sync instead.

- `src/styles/app.css`: styles
- `src/shell.html`: page shell (markup inside `<body>`)
- `public/app.js`: client script

`src/pages/index.astro` (head, fonts, loads the shell and script) and everything else (config, scripts, other pages) is hand-maintained.

## 4. Updating from the artifact

Source: https://claude.ai/artifact/2u3QTCES25mG91BWwwCMo4

1. Ask Claude Code to read the artifact above and save its HTML to a local file, e.g. `artifact.html`.
2. Split the saved HTML into the generated files: `npm run sync -- artifact.html`
3. Review the changes: `git diff`
4. Commit the changes.
5. Deploy: `npm run deploy`

## 5. Git workflow (trunk-based)

`main` is the trunk. It is always deployable.

1. Branch from up-to-date `main`. Name it `<name>/<task>`, e.g. `andre/sync-artifact-2026-11-14`.
2. Keep the branch short-lived. Commit small and often.
3. Rebase on `main` before opening the PR: `git fetch && git rebase origin/main`
4. Open a PR into `main`.
5. Merge fast once it is reviewed and green.
6. Delete the branch after merging.
7. Deploy from `main`: `npm run deploy`
