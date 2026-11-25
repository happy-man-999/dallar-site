// Dallar website: a dependency-free static server.
//
//   /            → public/        (the site)
//   /download/*  → downloads/     (installers, uploaded by hand through the
//                                  hosting panel's file manager, never committed:
//                                  they are too big for git)
//
// Port: PORT, else SERVER_PORT (what game-style panels such as Silly
// Development provide), else 8080.

const http = require("http");
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const zlib = require("zlib");

const PORT = Number(process.env.PORT || process.env.SERVER_PORT || 8080);
const PUBLIC_DIR = path.join(__dirname, "public");
const DOWNLOAD_DIR = path.join(__dirname, "downloads");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".exe": "application/vnd.microsoft.portable-executable",
};
const COMPRESSIBLE = new Set([".html", ".css", ".js", ".json", ".svg", ".txt"]);

const SECURITY = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
};

function send(res, status, text) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8", ...SECURITY });
  res.end(text);
}

/** Resolve a URL path inside `root`, or null if it tries to climb out. */
function inside(root, urlPath) {
  const p = path.normalize(path.join(root, urlPath));
  return p === root || p.startsWith(root + path.sep) ? p : null;
}

async function serveFile(req, res, filePath, stat, extra = {}, status = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const headers = {
    "Content-Type": MIME[ext] || "application/octet-stream",
    "Cache-Control": [".html", ".css", ".js"].includes(ext) ? "no-cache" : "public, max-age=3600",
    "Accept-Ranges": "bytes",
    ETag: `"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`,
    "Last-Modified": stat.mtime.toUTCString(),
    ...SECURITY,
    ...extra,
  };
  if (status === 200 && req.headers["if-none-match"] === headers.ETag) {
    res.writeHead(304, headers);
    return res.end();
  }
  if (req.method === "HEAD") {
    res.writeHead(status, { ...headers, "Content-Length": stat.size });
    return res.end();
  }

  // Ranges let a browser resume a big installer download.
  const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
  if (status === 200 && m && (m[1] || m[2])) {
    let start = m[1] ? +m[1] : Math.max(stat.size - +m[2], 0);
    let end = m[1] && m[2] ? Math.min(+m[2], stat.size - 1) : stat.size - 1;
    if (start > end || start >= stat.size) {
      res.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
      return res.end();
    }
    res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${stat.size}`, "Content-Length": end - start + 1 });
    return fs.createReadStream(filePath, { start, end }).on("error", () => res.destroy()).pipe(res);
  }

  const stream = fs.createReadStream(filePath).on("error", () => res.destroy());
  const accepts = req.headers["accept-encoding"] || "";
  if (COMPRESSIBLE.has(ext) && accepts.includes("br")) {
    res.writeHead(status, { ...headers, "Content-Encoding": "br", Vary: "Accept-Encoding" });
    stream.pipe(zlib.createBrotliCompress()).pipe(res);
  } else if (COMPRESSIBLE.has(ext) && accepts.includes("gzip")) {
    res.writeHead(status, { ...headers, "Content-Encoding": "gzip", Vary: "Accept-Encoding" });
    stream.pipe(zlib.createGzip()).pipe(res);
  } else {
    res.writeHead(status, { ...headers, "Content-Length": stat.size });
    stream.pipe(res);
  }
}

async function handle(req, res) {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
  } catch {
    return send(res, 400, "Bad request");
  }

  if (urlPath.startsWith("/download/")) {
    const file = inside(DOWNLOAD_DIR, urlPath.slice("/download".length));
    const stat = file && (await fsp.stat(file).catch(() => null));
    if (!stat || !stat.isFile()) return send(res, 404, "That download isn't available yet.");
    return serveFile(req, res, file, stat, {
      "Content-Disposition": `attachment; filename="${path.basename(file)}"`,
      "Cache-Control": "no-cache",
    });
  }

  let file = inside(PUBLIC_DIR, urlPath);
  if (!file) return send(res, 403, "Forbidden");
  let stat = await fsp.stat(file).catch(() => null);
  if (stat && stat.isDirectory()) {
    file = path.join(file, "index.html");
    stat = await fsp.stat(file).catch(() => null);
  }
  // /privacy → privacy.html
  if (!stat && !path.extname(file)) {
    file += ".html";
    stat = await fsp.stat(file).catch(() => null);
  }
  if (!stat) {
    file = path.join(PUBLIC_DIR, "404.html");
    stat = await fsp.stat(file);
    return serveFile(req, res, file, stat, {}, 404);
  }
  return serveFile(req, res, file, stat);
}

http
  .createServer((req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") return send(res, 405, "Method not allowed");
    handle(req, res).catch((err) => {
      console.error(err);
      if (!res.headersSent) send(res, 500, "Something went wrong.");
    });
  })
  .listen(PORT, () => console.log(`Dallar site running → http://localhost:${PORT}`));
