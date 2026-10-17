// Design tokens for the 2026 redesign. Screens use only these values.
// The values come from the design tokens in tokens/ (one DTCG source shared
// with Figma); run `npm run tokens:build` after changing them and
// `npm run tokens:check` to prove names, contrast and Figma drift.
// Contrast ratios are WCAG 2.2, measured against bg unless stated, and are
// checked on every build by tokens/checks.json.
import { Platform } from "react-native";
import { tokens } from "../../tokens/build/tokens";

const t = tokens.themes.light.color;
const base = tokens.base;
const num = (v) => parseFloat(v);

export const colors = {
  bg: t.bg.canvas,
  surface: t.bg.surface,
  ink: t.text.primary, // 13.5:1
  muted: t.text.secondary, // 5.4:1, 6.0:1 on surface
  line: t.border.subtle, // dividers and card borders only, it is decorative at 1.2:1
  field: t.border.control, // input and control borders, WCAG 1.4.11: 3.4:1 on surface, 3.1:1 on bg
  primary: t.accent.default, // buttons, links, active tabs. White on it 6.6:1, 6.0:1 on bg
  onPrimary: t.text["on-accent"],
  brand: t.brand.default, // the original green: logo and large decorative areas, never text
  band: {
    low: t.eco.low, // white text 6.4:1
    medium: t.eco.medium, // white text 5.0:1
    high: t.eco.high, // white text 6.6:1
  },
  scrim: t.bg.scrim, // behind sheets, ink at 40%
};

// Hover feedback for mouse users on the web (React Native Web passes
// "hovered" to Pressable styles; phones never set it). Only colours change,
// never sizes or border widths, so nothing shifts on hover.
export const hover = {
  card: { borderColor: colors.field }, // cards and rows: the edge darkens
  field: { borderColor: colors.ink }, // field-like buttons
  quiet: { backgroundColor: colors.bg }, // icon and text buttons: a beige tint
};

// Pressed feedback. A tint and a darker edge, never opacity: opacity fades the
// text with the control, and at 85% muted text fell to 4.3:1 and white on an eco
// band to 3.9:1. On sand every text colour stays at 5.4:1 or better.
export const pressed = {
  surface: { backgroundColor: colors.bg, borderColor: colors.ink }, // cards, rows, fields, icon and text buttons
  primary: { backgroundColor: colors.ink, borderColor: colors.ink }, // filled buttons: white on it 14.9:1
};

export const space =Object.fromEntries(Object.entries(base.size.space).map(([k, v]) => [k, num(v)]));

export const radius = Object.fromEntries(Object.entries(base.size.radius).map(([k, v]) => [k, num(v)]));

// Minimum touch target, WCAG 2.5.5 and both platform guidelines.
export const touch = num(base.size.touch);

export const fonts = {
  regular: "DMSans_400Regular",
  medium: "DMSans_500Medium",
  semibold: "DMSans_600SemiBold",
};

// fontFamily carries the weight. Setting fontWeight on top of a custom font
// makes Android fall back to the system font, so it is left out on purpose.
const fontFor = { 400: fonts.regular, 500: fonts.medium, 600: fonts.semibold };
const style = (name, color) => {
  const s = base.typography[name];
  return { fontFamily: fontFor[s.fontWeight], fontSize: num(s.fontSize), lineHeight: num(s.lineHeight), color };
};
export const type = {
  title: style("title", colors.ink),
  heading: style("heading", colors.ink),
  body: style("body", colors.ink),
  label: style("label", colors.ink),
  caption: style("caption", colors.muted),
};

// Elevation is borders first. Only sheets and the tab bar get this one shadow.
const sheet = base.shadow.sheet[0];
export const shadow = Platform.select({
  web: { boxShadow: `${sheet.offsetX} ${sheet.offsetY} ${sheet.blur} ${sheet.color}` },
  default: {
    shadowColor: sheet.color.slice(0, 7),
    shadowOffset: { width: num(sheet.offsetX), height: num(sheet.offsetY) },
    shadowOpacity: Math.round((parseInt(sheet.color.slice(7, 9), 16) / 255) * 100) / 100,
    shadowRadius: num(sheet.blur) / 2,
    elevation: 8,
  },
});
