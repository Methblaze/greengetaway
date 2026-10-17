// Square 44 point icon button for map controls. The field border keeps the
// button's edge at 3:1 or more against light map tiles.
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, radius, touch, hover, pressed as pressedStyle } from "../../theme/tokens";

export const IconButton = ({ icon, label, onPress, active = false, style }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ selected: active }}
    style={({ pressed, hovered }) => [styles.button, hovered && !active && hover.quiet, active && styles.active, pressed && (active ? pressedStyle.primary : pressedStyle.surface), style]}
  >
    <Ionicons name={icon} size={22} color={active ? colors.onPrimary : colors.ink} />
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    width: touch,
    height: touch,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.field,
    alignItems: "center",
    justifyContent: "center",
  },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
});
