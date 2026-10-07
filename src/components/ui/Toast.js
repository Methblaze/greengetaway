// Short status message near the bottom of the screen, announced to screen
// readers as a polite live region.
import React, { useEffect } from "react";
import { View, Text, StyleSheet, AccessibilityInfo, Platform } from "react-native";
import { colors, fonts, radius, space } from "../../theme/tokens";

export const Toast = ({ message, onHide, duration = 4500, style }) => {
  useEffect(() => {
    if (!message) return;
    if (Platform.OS !== "web") AccessibilityInfo.announceForAccessibility(message);
    const t = setTimeout(onHide, duration);
    return () => clearTimeout(t);
  }, [message]);

  if (!message) return null;
  return (
    <View style={[styles.toast, style]} accessibilityLiveRegion="polite" aria-live="polite" role="status">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    backgroundColor: colors.ink,
    borderRadius: radius.card,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
  },
  // White on ink is 14.3:1.
  text: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.onPrimary },
});
