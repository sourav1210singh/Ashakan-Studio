# Ashkan Studios — WordPress (WP Engine) deployment guide

The site is a React/Vite app. We ship it to WordPress as a **wrapper theme**:
the compiled app (`assets/`, `images/`) sits at the WordPress **site root**,
and the theme's `index.php` is the shell that boots it. Result is **pixel-
identical** to the live build, because the exact same compiled code runs.

---

## What you have (after `npx vite build` + `node build-wp-theme.mjs`)

| Item | Path | Goes to |
|------|------|---------|
| Theme folder | `wp-theme-dist/ashkan-studios/` (3 files) | `wp-content/themes/` |
| Theme zip | `wp-theme-dist/ashkan-studios.zip` | (alt: upload via wp-admin) |
| App + media | `dist/assets/`, `dist/images/`, `dist/robots.txt`, `dist/sitemap.xml` | WordPress **site root** |

> Do **not** upload `dist/index.html` or `dist/_redirects` — the theme's
> `index.php` is the shell, and redirects are handled separately (step 4).

---

## Step 1 — Connect via SFTP (FileZilla / WinSCP)

1. In the **WP Engine portal** → your install → **SFTP users** → create/copy
   the SFTP host, username, port, and password.
2. Open FileZilla → enter those → connect.
3. Find the WordPress **docroot** (the folder that contains `wp-admin`,
   `wp-content`, `wp-includes`, `index.php`). On WP Engine it's usually
   `/sites/<install>/` or shown as the root after login.

## Step 2 — Upload the files

1. **Theme:** upload the folder `ashkan-studios/` into
   `wp-content/themes/`  → result: `wp-content/themes/ashkan-studios/`
2. **App + media (to the docroot root, next to `wp-admin`):**
   - `dist/assets/`  → `/assets/`
   - `dist/images/`  → `/images/`   *(~98 MB — will take a few minutes)*
   - `dist/robots.txt` → `/robots.txt`
   - `dist/sitemap.xml` → `/sitemap.xml`

## Step 3 — Activate the theme (wp-admin, Sourav browser)

1. Log in to `wp-admin` (you enter the password).
2. **Appearance → Themes** → "Ashkan Studios" → **Activate**.
3. **Settings → Permalinks** → choose **Post name** → **Save Changes**
   (this flushes rewrite rules so deep links like `/work/photography/` work).

## Step 4 — Redirects (old URLs → new)

The `vercel.json` 301s don't carry over. On WordPress use the free
**Redirection** plugin (Plugins → Add New → "Redirection" → install/activate),
then import the redirect list. *(Ask Claude to generate the import file from
the current `vercel.json` when you reach this step.)*

## Step 5 — Clear WP Engine cache

WP Engine caches aggressively. WP Engine portal (or the WP Engine admin bar
menu) → **Clear all caches**. Do this after every change or you'll see stale
output.

## Step 6 — Test

- Home `/` loads with all animations.
- Deep links: `/work/photography/fashion/`, `/work/campaigns/eye-gallery/`,
  `/videographer-houston/` — each should render (not 404, not homepage).
- Images, Vimeo videos, hover/scroll animations all work.

---

## Re-deploying after a React change

```
cd app
npx vite build
node build-wp-theme.mjs
```
Then re-upload (hashed filenames change each build):
- `wp-theme-dist/ashkan-studios/index.php` → theme folder
- `dist/assets/` → site root `/assets/`  (old hashed files can be deleted)
- only re-upload `dist/images/` if images changed

## Troubleshooting

- **Blank page / white screen:** `/assets/*.js` or `*.css` 404 → assets
  folder not at the docroot root, or path wrong. Confirm `/assets/` sits next
  to `wp-admin`.
- **Images missing:** `/images/` not at the docroot root.
- **Deep link shows homepage or 404:** permalinks not set to Post name, or
  cache not cleared. Re-do steps 3 + 5.
- **Old version still showing:** WP Engine cache — clear it (step 5).
