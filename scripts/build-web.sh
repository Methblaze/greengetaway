#!/usr/bin/env bash
# Builds the browser version of GreenGetaway into docs/ for GitHub Pages.
# Usage: bash scripts/build-web.sh https://github.com/<user>/<repo>
set -euo pipefail
cd "$(dirname "$0")/.."

REPO_URL="${1:-https://github.com/}"

echo "== installing app dependencies"
npm install --no-audit --no-fund --legacy-peer-deps

echo "== adding web dependencies pinned to Expo SDK 49"
npm install --no-audit --no-fund --legacy-peer-deps react-native-web@~0.19.6 react-dom@18.2.0 @expo/metro-runtime@~2.2.16 leaflet@1.9.4

echo "== patching app.json and the navigator"
node scripts/patch-app.js

echo "== inlining Leaflet CSS"
node scripts/make-leaflet-css.js

echo "== exporting the web build"
rm -rf dist
CI=1 npx expo export --platform web

echo "== preparing docs/ for GitHub Pages"
node scripts/postexport.js "$REPO_URL"

echo "done: open docs/index.html through a local server to check it"
