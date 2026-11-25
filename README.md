# Dallar website

Landing page, pricing, FAQ, privacy policy and terms for Dallar. No dependencies:
`server.js` is a small Node static server.

```bash
npm start            # http://localhost:8080
PORT=3000 npm start
```

The port comes from `PORT`, else `SERVER_PORT` (set by Silly Development's panel),
else 8080.

## Before going live

Edit `public/config.js`:

| Setting | What to put |
| --- | --- |
| `buyUrl` | Polar checkout link for the $5/month product |
| `downloadUrl` | Already points at the latest GitHub release (below) |
| `supportEmail` | The email customers write to |

## The installer

Attach `Dallar-Setup.exe` to a GitHub release of this repo (Releases → Draft a new
release → tag e.g. `v1.6.0` → drop the file in → Publish). The site's download
link always points at the latest release, so each new version is just a new
release with a file of the same name.

## Hosting (Render, free static site)

Render → New → **Static Site** → this repo. Build command: empty. Publish
directory: `public`. (Or New → Blueprint, which reads `render.yaml`.) Static
sites don't sleep, unlike free Web Services.

`server.js` and `sillydev.conf` are for hosting it as a Node server instead
(e.g. Silly Development); Render's static site doesn't use them.

## Pages

| Page | File |
| --- | --- |
| Home | `public/index.html` |
| Privacy | `public/privacy.html` (`/privacy`) |
| Terms | `public/terms.html` (`/terms`) |
| Styles | `public/styles.css` |
| Screenshots | `public/img/` (taken from the real app with demo data) |
