// The one sanctioned change to the frozen 2023 build in docs/2023/.
//
// In 2026 CARTO started answering keyless basemap requests with an
// "API KEY REQUIRED" image, so the 2023 map rendered as an empty grid. That
// says nothing about the 2023 design, so the two CARTO tile layers are swapped
// for keyless equivalents and nothing else in docs/2023/ changes:
//   standard map   CARTO Voyager           -> OpenStreetMap standard tiles
//   hybrid labels  CARTO Voyager labels    -> Esri World Boundaries and Places
//
// Usage:
//   node scripts/patch-2023-tiles.js            apply (idempotent)
//   node scripts/patch-2023-tiles.js --verify   prove docs/2023/ is the v2023-web
//                                               tag's docs/app/ plus these swaps
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const baseline = path.join(root, "docs", "2023");
const TAG = "v2023-web";

const SWAPS = [
  [
    `"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",{subdomains:"abcd",maxZoom:20,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'}`,
    `"https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}`,
  ],
  [
    `"https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",{subdomains:"abcd",maxZoom:20,pane:"labels"}`,
    `"https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",{maxZoom:19,pane:"labels"}`,
  ],
];

const count = (s, needle) => s.split(needle).length - 1;

const applySwaps = (js, file) => {
  for (const [from, to] of SWAPS) {
    const hits = count(js, from);
    const done = count(js, to);
    if (hits === 1 && done === 0) js = js.replace(from, () => to);
    else if (!(hits === 0 && done === 1)) throw new Error(`${file}: expected one tile layer to swap, found ${hits} old and ${done} new`);
  }
  return js;
};

const git = (args, opts = {}) => execFileSync("git", args, { cwd: root, maxBuffer: 1 << 28, ...opts });

if (process.argv.includes("--verify")) {
  const prefix = "docs/app/";
  const tagged = git(["ls-tree", "-r", "--name-only", TAG, prefix], { encoding: "utf8" }).split("\n").filter(Boolean);
  const onDisk = [];
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).forEach((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : onDisk.push(path.relative(baseline, path.join(dir, e.name)).split(path.sep).join("/"))
    );
  walk(baseline);

  const rel = tagged.map((p) => p.slice(prefix.length));
  const missing = rel.filter((p) => !onDisk.includes(p));
  const extra = onDisk.filter((p) => !rel.includes(p));
  if (missing.length || extra.length) throw new Error(`file lists differ. missing: ${missing} extra: ${extra}`);

  let patched = 0;
  for (const p of rel) {
    const original = git(["show", `${TAG}:${prefix}${p}`]);
    const current = fs.readFileSync(path.join(baseline, p));
    if (original.equals(current)) continue;
    if (!/^bundles\/web-[0-9a-f]+\.js$/.test(p)) throw new Error(`${p} differs from ${TAG} and is not the app bundle`);
    const expected = Buffer.from(applySwaps(original.toString("utf8"), p), "utf8");
    if (!expected.equals(current)) throw new Error(`${p} differs from ${TAG} by more than the tile swap`);
    patched++;
  }
  console.log(`verified: ${rel.length} files, ${rel.length - patched} byte-identical to ${TAG}, ${patched} differing only by the tile swap`);
} else {
  const bundles = fs.readdirSync(path.join(baseline, "bundles")).filter((n) => n.endsWith(".js"));
  if (bundles.length !== 1) throw new Error(`expected one bundle in docs/2023/bundles, found ${bundles.length}`);
  const file = path.join(baseline, "bundles", bundles[0]);
  const before = fs.readFileSync(file, "utf8");
  const after = applySwaps(before, bundles[0]);
  if (after === before) console.log("docs/2023 tiles already patched");
  else {
    fs.writeFileSync(file, after);
    console.log("patched the tile layers in docs/2023/bundles/" + bundles[0]);
  }
}
