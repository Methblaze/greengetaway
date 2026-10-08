// Metro configuration.
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// styled-components v6 pulls in stylis, whose browser entry is an .mjs file.
// Metro in SDK 49 does not resolve .mjs unless told to. Appended last, so
// plain .js files still win wherever both exist.
if (!config.resolver.sourceExts.includes("mjs")) config.resolver.sourceExts.push("mjs");

// Local hand-over folders (git-ignored) hold copies of package.json and src/
// for uploading elsewhere. Metro scans the whole project, so without this it
// finds two of everything and refuses to bundle.
const exclusionList = require("metro-config/src/defaults/exclusionList");
// No slashes in these patterns: exclusionList rewrites "/" into the platform's
// path separator, which breaks a character class such as [\\/] on Windows.
config.resolver.blockList = exclusionList([
  config.resolver.blockList,
  /\bgithub-upload\b.*/,
  /\blovable-handover\b.*/,
]);

module.exports = config;
