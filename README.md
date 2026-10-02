# GreenGetaway

A sustainable tourist guide to Copenhagen, built with React Native and Expo for the ITU course Programming Mobile Applications. Find the greenest attractions on a map, see how each one scores, and log the places you visit with a photo.

**Live web demo:** https://methblaze.github.io/greengetaway/

## What is in this repo

The app itself is the original Expo SDK 49 project (`App.js`, `src/`, `assets/`). It runs on iOS and Android through Expo Go as before.

In 2026 I added a browser build so the app can be tried directly from my portfolio without installing anything. The native code is untouched; the web versions sit next to it as `.web.js` files, which Expo picks up only when building for the browser:

- `src/screens/map/Map.web.js` replaces `react-native-maps` with a Leaflet map showing the same attractions, pins and detail cards
- `src/services/authentication/authentication.context.web.js` skips Firebase sign-in, so the demo needs no account and stores no data
- `src/services/camera/camera.service.web.js` and `src/services/location/location.service.web.js` use the browser's own camera and location permissions
- `src/components/datePicker.web.js` uses the browser's date input in place of the native date picker

The built site lives in `docs/` and is served by GitHub Pages.

## Run the app on a phone

```bash
npm install --legacy-peer-deps
npx expo start
```

Native sign-in needs a Firebase project. Put its keys in a `.env` file (see `firebaseConfig.js` for the variable names). The `.env` file is not committed.

## Rebuild the web demo

```bash
bash scripts/build-web.sh https://github.com/methblaze/greengetaway
```

This installs the web dependencies, exports the app with Metro and writes the GitHub Pages site to `docs/`. All paths in the build are relative, so `npx serve docs` is enough to check it locally.
