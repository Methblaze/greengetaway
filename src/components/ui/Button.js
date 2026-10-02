// Primary is the filled green action. Secondary is a quiet text button in the
// same green. Both are at least 44 points tall.
import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, space, touch } from "../../theme/tokens";

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
      style={({ pressed }) => [
        styles.base,
        primary ? styles.primary : styles.secondary,
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
  secondary: { backgroundColor: "transparent", minHeight: touch },
  // Disabled keeps white on green legible (WCAG exempts disabled controls,
  // but the label still has to be readable to explain why it is off).
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.85 },
  content: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: space.sm },
  text: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 24 },
});
