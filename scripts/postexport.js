// Turns Expo's web export (dist/) into a GitHub Pages site under docs/:
//   docs/index.html   showcase page with the app in a phone frame
//   docs/app/         the exported app itself, usable on its own or in an iframe
//
// Expo SDK 49 writes root-absolute URLs ("/_expo/...", "/assets/..."), which
// break when the site lives in a sub-folder such as /<repo>/app/. They are
// rewritten to relative URLs here. GitHub Pages also hides folders that start
// with an underscore unless Jekyll is switched off, hence .nojekyll.
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const docs = path.join(root, "docs");
const appOut = path.join(docs, "app");
const repoUrl = process.argv[2] || "https://github.com/";

if (!fs.existsSync(dist)) throw new Error("dist/ not found, run the export first");

fs.rmSync(docs, { recursive: true, force: true });
fs.mkdirSync(appOut, { recursive: true });
fs.cpSync(dist, appOut, { recursive: true });

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]
  );

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

const showcase = fs
  .readFileSync(path.join(root, "web-showcase/index.html"), "utf8")
  .replace(/REPO_URL/g, repoUrl);
fs.writeFileSync(path.join(docs, "index.html"), showcase);
fs.writeFileSync(path.join(docs, ".nojekyll"), "");
console.log("wrote docs/index.html and docs/.nojekyll");
