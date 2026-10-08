// Turns Expo's web export (dist/) into a GitHub Pages site under docs/:
//   docs/index.html   showcase page with the app in a phone frame
//   docs/compare.html 2023/2026 compare page for embedding in the portfolio
//   docs/app/         the exported app itself, usable on its own or in an iframe
//   docs/2023/        the frozen 2023 build. Never written here, see below.
//
// Expo SDK 49 writes root-absolute URLs ("/_expo/...", "/assets/..."), which
// break when the site lives in a sub-folder such as /<repo>/app/. They are
// rewritten to relative URLs here. GitHub Pages also hides folders that start
// with an underscore unless Jekyll is switched off, hence .nojekyll.
const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const docs = path.join(root, "docs");
const appOut = path.join(docs, "app");
const baseline = path.join(docs, "2023");
const repoUrl = process.argv[2] || "https://github.com/";

// Check the export is complete before anything in docs/ is touched. A failed
// export can leave empty dist/assets and dist/bundles folders behind, and
// copying those would replace the live app with nothing.
if (!fs.existsSync(path.join(dist, "index.html"))) throw new Error("dist/index.html not found, the export did not finish. docs/ was not changed.");
const distBundles = fs.existsSync(path.join(dist, "bundles")) ? fs.readdirSync(path.join(dist, "bundles")).filter((n) => n.endsWith(".js")) : [];
if (distBundles.length !== 1) throw new Error(`expected one bundle in dist/bundles, found ${distBundles.length}. docs/ was not changed.`);

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]
  );

// docs/2023/ is the only copy of the 2023 app the portfolio compares against.
// Only docs/app/, docs/index.html and docs/compare.html are replaced here, and
// docs/2023/ is fingerprinted before and after so any change to it fails the
// build loudly instead of shipping.
const fingerprint = (dir) => {
  const hash = crypto.createHash("sha256");
  for (const file of walk(dir).sort()) {
    hash.update(path.relative(dir, file).split(path.sep).join("/"));
    hash.update(fs.readFileSync(file));
  }
  return hash.digest("hex");
};
if (!fs.existsSync(baseline)) {
  throw new Error("docs/2023/ is missing. Restore it with: git checkout v2023-web -- docs/app && git mv docs/app docs/2023");
}
const baselineBefore = fingerprint(baseline);

fs.rmSync(appOut, { recursive: true, force: true });
fs.mkdirSync(appOut, { recursive: true });
fs.cpSync(dist, appOut, { recursive: true });

let changed = 0;
for (const file of walk(appOut)) {
  if (!/\.(html|js|json|css)$/.test(file)) continue;
  let s = fs.readFileSync(file, "utf8");
  const before = s;
  s = s
    .replace(/(["'(])\/(_expo|assets|bundles)\//g, "$1./$2/")
    .replace(/(href|src)="\/(?!\/)/g, '$1="./');
  if (file.endsWith("index.html")) {
    s = s.replace(/<title>[^<]*<\/title>/, "<title>GreenGetaway</title>");
    if (!/name="description"/.test(s)) {
      s = s.replace(
        "</head>",
        '<meta name="description" content="GreenGetaway, a sustainable tourist guide to Copenhagen, built with React Native and Expo.">\n</head>'
      );
    }
  }
  if (s !== before) {
    fs.writeFileSync(file, s);
    changed++;
  }
}
console.log("rewrote root-absolute URLs in", changed, "files");

// expo-asset (SDK 49) resolves web asset paths against the site origin and then
// strips the origin, so "./assets/x.png" becomes "/assets/x.png" at runtime and
// fonts and map pins 404 under a sub-folder. Resolve against the page instead.
const bundleDir = path.join(appOut, "bundles");
for (const f of fs.readdirSync(bundleDir).filter((n) => n.endsWith(".js"))) {
  const p = path.join(bundleDir, f);
  let js = fs.readFileSync(p, "utf8");
  const re = /new URL\((\w+)\(this\.asset\),this\.serverUrl\)/g;
  const hits = js.match(re) || [];
  if (hits.length !== 1) throw new Error(`asset resolver patch: expected 1 match in ${f}, found ${hits.length}`);
  js = js.replace(re, 'new URL($1(this.asset),(typeof document!=="undefined"&&document.baseURI)||this.serverUrl)');
  fs.writeFileSync(p, js);
  console.log("patched the web asset resolver in", f);
}

for (const page of ["index.html", "compare.html"]) {
  const src = path.join(root, "web-showcase", page);
  if (!fs.existsSync(src)) continue;
  fs.writeFileSync(path.join(docs, page), fs.readFileSync(src, "utf8").replace(/REPO_URL/g, repoUrl));
  console.log("wrote docs/" + page);
}
fs.writeFileSync(path.join(docs, ".nojekyll"), "");

if (fingerprint(baseline) !== baselineBefore) throw new Error("docs/2023/ changed during postexport. Do not deploy.");
console.log("docs/2023/ untouched");
