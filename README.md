# Akademi SAP Admin Proyek

Static Astro 7 site, deployed to Cloudflare Pages (Pages Functions handle login and progress). Content was migrated from the Claude artifact "Akademi SAP Admin Proyek".

## 1. Quick start

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Test the production build locally: `npm run preview` (builds `dist/`, then runs `wrangler pages dev`)

## 2. Deploy

Production: https://sap-learn.pages.dev

1. One time only: `npx wrangler login`
2. Set the secret (one time): `npx wrangler pages secret put SESSION_SECRET`
3. Deploys happen automatically on push to `main` (see CI/CD). `npm run deploy` is only a manual fallback.

Deploy from `main` only.

### Login & progress

- Sign-up needs an invite code. An admin creates one at `/admin` ("Buat kode baru"); each code works for one sign-up and expires after 30 minutes. The admin sends the learner the link `/login?invite=<code>`.
- Admins are users whose KV record `user:<name>` has `"admin": true`. Make one by setting that field on the record (`npx wrangler kv key get/put --remote`).
- Each user's progress is stored per user in Cloudflare KV (binding `DATA`) and synced from the browser.
- Local dev uses `.dev.vars` (`SESSION_SECRET`). Create a local admin with `wrangler kv key put user:<name> --local`.
- There is no login rate limiting yet.

### CI/CD

- **Deploy:** Cloudflare Pages is connected to this GitHub repo. A push to `main` builds (`npm run build`, output `dist`) and deploys production; every PR gets a preview URL posted by Cloudflare.
- **Checks:** `.github/workflows/ci.yml` runs `npm test` + `npm run build` on PRs and on `main`. No Cloudflare token is needed in GitHub.
- Build uses Node 24 (`.node-version`). KV binding comes from `wrangler.jsonc`; secret `SESSION_SECRET` lives in the Pages project settings.

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
