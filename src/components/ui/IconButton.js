// Square 44 point icon button for map controls. The field border keeps the
// button's edge at 3:1 or more against light map tiles.
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, touch } from "../../theme/tokens";

export const IconButton = ({ icon, label, onPress, active = false, style }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ selected: active }}
    style={({ pressed }) => [styles.button, active && styles.active, pressed && styles.pressed, style]}
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
  pressed: { opacity: 0.8 },
});
