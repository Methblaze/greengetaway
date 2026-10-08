// Design tokens for the 2026 redesign. Screens use only these values.
// Contrast ratios are WCAG 2.2, measured against bg unless stated.
import { Platform } from "react-native";

export const colors = {
  bg: "#F7F3EE",
  surface: "#FFFFFF",
  ink: "#1F2A22", // 13.5:1
  muted: "#5C665F", // 5.4:1, 6.0:1 on surface
  line: "#E2DBD2", // dividers and card borders only, it is decorative at 1.2:1
  field: "#848D86", // input and control borders, WCAG 1.4.11: 3.4:1 on surface, 3.1:1 on bg
  primary: "#466350", // buttons, links, active tabs. White on it 6.6:1, 6.0:1 on bg
  onPrimary: "#FFFFFF",
  brand: "#688A6F", // the original green: logo and large decorative areas, never text
  band: {
    low: "#2F6B3F", // white text 6.4:1
    medium: "#B45309", // white text 5.0:1
    high: "#B42318", // white text 6.6:1
  },
  scrim: "rgba(31, 42, 34, 0.4)", // behind sheets, ink at 40%
};

// Hover feedback for mouse users on the web (React Native Web passes
// "hovered" to Pressable styles; phones never set it). Only colours change,
// never sizes or border widths, so nothing shifts on hover.
export const hover = {
  card: { borderColor: colors.field }, // cards and rows: the edge darkens
  field: { borderColor: colors.ink }, // field-like buttons
  quiet: { backgroundColor: colors.bg }, // icon and text buttons: a beige tint
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const radius = { card: 12, sheet: 16, pill: 999 };

// Minimum touch target, WCAG 2.5.5 and both platform guidelines.
export const touch = 44;

export const fonts = {
  regular: "DMSans_400Regular",
  medium: "DMSans_500Medium",
  semibold: "DMSans_600SemiBold",
};

// fontFamily carries the weight. Setting fontWeight on top of a custom font
// makes Android fall back to the system font, so it is left out on purpose.
export const type = {
  title: { fontFamily: fonts.semibold, fontSize: 28, lineHeight: 34, color: colors.ink },
  heading: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 26, color: colors.ink },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, color: colors.ink },
  label: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: colors.ink },
  caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, color: colors.muted },
};

// Elevation is borders first. Only sheets and the tab bar get this one shadow.
export const shadow = Platform.select({
  web: { boxShadow: "0 -2px 16px rgba(31, 42, 34, 0.10)" },
  default: {
    shadowColor: "#1F2A22",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
});
