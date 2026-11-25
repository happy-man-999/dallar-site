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
| `downloadUrl` | Keep `/download/Dallar-Setup.exe` and upload the installer (below), or use any other link |
| `supportEmail` | The email customers write to |

## The installer

Upload `Dallar-Setup.exe` into the server's `downloads/` folder with the panel's
file manager. It's served at `/download/Dallar-Setup.exe`. It is not in git
(GitHub refuses files over 100 MB), so upload it again after each new release.

## Hosting (Silly Development)

`sillydev.conf` sets Node 24 and `server.js` as the main file. Connect this
repository in the panel and deploy; changes to the conf apply on the next deploy.

## Pages

| Page | File |
| --- | --- |
| Home | `public/index.html` |
| Privacy | `public/privacy.html` (`/privacy`) |
| Terms | `public/terms.html` (`/terms`) |
| Styles | `public/styles.css` |
| Screenshots | `public/img/` (taken from the real app with demo data) |
