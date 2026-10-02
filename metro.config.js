// Metro configuration.
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// styled-components v6 pulls in stylis, whose browser entry is an .mjs file.
// Metro in SDK 49 does not resolve .mjs unless told to. Appended last, so
// plain .js files still win wherever both exist.
if (!config.resolver.sourceExts.includes("mjs")) config.resolver.sourceExts.push("mjs");

module.exports = config;
