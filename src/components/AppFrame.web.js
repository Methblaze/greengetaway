// Web build only. Opened full screen on a desktop, the app would stretch its
// text across the whole window (about 150 characters a line at 1280 wide).
// This keeps it a phone-shaped column, centred, so lines stay near 60
// characters. At phone widths and in the portfolio embed it changes nothing.
import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { colors } from "../theme/tokens";

export const APP_MAX_WIDTH = 560;

export const AppFrame = ({ children }) => {
  const { width } = useWindowDimensions();
  const framed = width > APP_MAX_WIDTH;
  return (
    <View style={styles.page}>
      <View style={[styles.column, framed && styles.framed]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg, alignItems: "center" },
  column: { flex: 1, width: "100%", maxWidth: APP_MAX_WIDTH },
  framed: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.line },
});
