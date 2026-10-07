// One-off source patches for the web build. Idempotent: safe to run twice.
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");

// 1. app.json: build the web version with Metro as a single-page app, and give
//    the browser tab the app's real name rather than the course code.
const appJsonPath = path.join(root, "app.json");
const app = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));
app.expo.web = Object.assign({}, app.expo.web, {
  bundler: "metro",
  output: "single",
  name: "GreenGetaway",
  shortName: "GreenGetaway",
  themeColor: "#688A6F",
  backgroundColor: "#ebe2d9",
});
fs.writeFileSync(appJsonPath, JSON.stringify(app, null, 2) + "\n");
console.log("app.json: web build set to Metro, single page");

// 2. app.navigator.js uses Platform.OS for the Add button but never imports
//    Platform. That is a ReferenceError waiting to happen on any platform where
//    Platform is not a global, which includes the browser. Add the import.
const navPath = path.join(root, "src/infrastructure/navigation/app.navigator.js");
let nav = fs.readFileSync(navPath, "utf8");
const before = 'import { Text, TouchableOpacity, View, Image } from "react-native";';
const after = 'import { Text, TouchableOpacity, View, Image, Platform } from "react-native";';
if (nav.includes(before)) {
  nav = nav.replace(before, after);
  fs.writeFileSync(navPath, nav);
  console.log("app.navigator.js: added missing Platform import");
} else if (nav.includes(after) || /import \{[^}]*\bPlatform\b[^}]*\} from "react-native"/.test(nav)) {
  console.log("app.navigator.js: Platform import already present");
} else if (!/\bPlatform\./.test(nav)) {
  console.log("app.navigator.js: Platform not used, nothing to patch");
} else {
  throw new Error("app.navigator.js uses Platform without importing it, check by hand");
}

// 3. Add.js imports the community date picker directly, which renders nothing
//    in a browser. Point it at a small wrapper that picks the native picker on
//    iOS and Android and the browser's own date input on the web.
const addPath = path.join(root, "src/screens/Add.js");
let addSrc = fs.readFileSync(addPath, "utf8");
const pickerBefore = 'import DateTimePacker from "@react-native-community/datetimepicker";';
const pickerAfter = 'import DateTimePacker from "../components/datePicker";';
if (addSrc.includes(pickerBefore)) {
  addSrc = addSrc.replace(pickerBefore, pickerAfter);
  fs.writeFileSync(addPath, addSrc);
  console.log("Add.js: date picker now imported through components/datePicker");
} else if (addSrc.includes(pickerAfter)) {
  console.log("Add.js: date picker import already patched");
} else if (!addSrc.includes("@react-native-community/datetimepicker")) {
  // The 2026 Add screen uses components/form/DateField, which has its own
  // .web.js version, so there is no direct import left to redirect.
  console.log("Add.js: no direct date picker import, nothing to patch");
} else {
  throw new Error("Add.js imports the date picker in an unexpected way, check by hand");
}
