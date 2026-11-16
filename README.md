# Akademi SAP Admin Proyek

Static Astro 7 site, deployed to Cloudflare Pages (Pages Functions handle login and progress). Content was migrated from the Claude artifact "Akademi SAP Admin Proyek".

## 1. Quick start

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Test the production build locally: `npm run preview` (builds `dist/`, then runs `wrangler pages dev`)

## 2. Deploy

Production: https://akademi-sap.pages.dev

1. One time only: `npx wrangler login`
2. Set the secret (one time): `npx wrangler pages secret put SESSION_SECRET`
3. Deploys happen automatically on push to `main` (see CI/CD). `npm run deploy` is only a manual fallback.

Deploy from `main` only.

### Login & progress

- Sign-up needs an invite code. An admin creates one at `/admin` ("Buat kode baru"); each code works for one sign-up and expires after 30 minutes. The admin sends the learner the link `/login?invite=<code>`.
- Admins are users whose KV record `user:<name>` has `"admin": true`. Make one by setting that field on the record (`npx wrangler kv key get/put --remote`).
- Each user's progress is stored per user in Cloudflare KV (binding `DATA`) and synced from the browser.

### Roles & access

- Sign-up asks only for username, password and invite code. After the first login the learner picks a role once, from a role's detail page ("Pilih role ini", then confirm). Until then they can browse roles, the module catalog and module previews (summary + chapter list), glosarium and referensi; home, simulator, ujian, flashcard, studi kasus, jalur and report show "Pilih role dulu".
- The role's modules are open: wajib, general and pendukung. Every other module shows as locked (🔒), with a "Minta akses" button. The home page also suggests add-on modules from similar roles.
- Learners can request three things: one extra module, a second role, or a role change. An admin approves or rejects each request at `/admin` ("Permintaan akses"). The admin can also edit any user's role, extra roles and extra modules directly ("Pengguna"). Admins can open every module.
- Locking covers each module's lessons and quiz. The simulator, studi kasus and flashcards stay open for everyone.
- The lock is UI-only: `public/access.js` wraps functions of the generated `app.js`. If the artifact renames those functions, `npm run sync` fails and names the missing hook.
- Role and module lists for the server and admin page come from `functions/_lib/catalog.js`, which `npm run sync` generates.
- Local dev uses `.dev.vars` (`SESSION_SECRET`). Create a local admin with `wrangler kv key put user:<name> --local`.
- There is no login rate limiting yet.

### Coins, coupons & cart

- **Set the admin WhatsApp number first** at `/admin` ("WhatsApp admin"). Cart checkout and reward claims open `wa.me/<number>`; without it, checkout only sends the requests.
- Learners earn EXP, convert it to coins (5 EXP = 1 coin, from the artifact) and redeem rewards on `#reward`. `POST /api/redeem` checks the price (from `catalog.js`) against the stored progress, deducts coins and stores a receipt `rdm:<code>`. The learner sees a receipt with a "Klaim via WhatsApp" link.
- **Coupons:** the admin creates a code with a custom reward and coin cost at `/admin` ("Kupon"). A learner enters it under the wallet; it is refused if they lack coins. Each code works once.
- **Cart:** locked modules and extra roles go into a cart (floating button). Checkout creates all access requests in one call and opens the admin WhatsApp with the list.
- **Notifikasi** at `/admin` lists pending access requests and unprocessed redemptions (polled every 30 s); "Tandai selesai" closes a redemption. The Admin link in the app shows the count.
- "Rincian EXP", "Nilai setiap aktivitas" and "EXP per role" are admin-only. "Detail & atur" on a user shows role, add-ons, EXP breakdown, coins and redemptions.
- EXP is computed in the browser, so a learner who edits their progress can inflate coins. KV has no transactions; two redeems at the same instant can both pass.

### CI/CD

- **Deploy:** Cloudflare Pages is connected to this GitHub repo. A push to `main` builds (`npm run build`, output `dist`) and deploys production; every PR gets a preview URL posted by Cloudflare.
- **Checks:** `.github/workflows/ci.yml` runs `npm test` + `npm run build` on PRs and on `main`. No Cloudflare token is needed in GitHub.
- Build uses Node 24 (`.node-version`). KV binding comes from `wrangler.jsonc`; secret `SESSION_SECRET` lives in the Pages project settings.

## 3. Project layout

Generated from the artifact by `npm run sync`. **Do not hand-edit these files.** Re-sync instead.

- `src/styles/app.css`: styles
- `src/shell.html`: page shell (markup inside `<body>`)
- `public/app.js`: client script
- `functions/_lib/catalog.js`: roles, module ids, reward prices and coin rate

`src/pages/index.astro` (head, fonts, loads the shell and script), `src/styles/site.css` (cart, coupon, receipt styles) and everything else (config, scripts, other pages) is hand-maintained.

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
