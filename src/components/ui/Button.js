// Primary is the filled green action. Outline is a clear but secondary action
// (a white button with a 3:1 border). Secondary is a quiet text button in the
// same green. All are at least 44 points tall.
import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, fonts, radius, space, touch, hover } from "../../theme/tokens";

export const Button = ({ title, onPress, variant = "primary", icon, disabled = false, style, accessibilityHint }) => {
  const primary = variant === "primary";
  const tint = primary ? colors.onPrimary : colors.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityHint={accessibilityHint}
      style={({ pressed, hovered }) => [
        styles.base,
        primary ? styles.primary : variant === "outline" ? styles.outline : styles.secondary,
        hovered && !disabled && (primary ? styles.primaryHovered : hover.quiet),
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <View style={styles.content}>
        {icon && <Ionicons name={icon} size={20} color={tint} style={styles.icon} />}
        <Text style={[styles.text, { color: tint }]}>{title}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    minWidth: touch,
    borderRadius: radius.card,
    paddingHorizontal: space.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: { backgroundColor: colors.primary },
  // White on primary at 90% opacity is still 5.2:1 or better on white or the page.
  primaryHovered: { opacity: 0.9 },
  outline: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.field },
  secondary: { backgroundColor: "transparent", minHeight: touch },
  // Disabled keeps white on green legible (WCAG exempts disabled controls,
  // but the label still has to be readable to explain why it is off).
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.85 },
  content: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: space.sm },
  text: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 24 },
});
