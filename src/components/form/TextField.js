// Labelled text input. The placeholder is only ever a format hint, never the
// label or an instruction. Focus shows as a 2px primary border on the field.
import React, { forwardRef, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { colors, fonts, space } from "../../theme/tokens";
import { fieldBox } from "./Field";

export const TextField = forwardRef(({ label, id, style, ...input }, ref) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.wrap, style]}>
      <Text style={styles.label} nativeID={`${id}-label`}>
        {label}
      </Text>
      <TextInput
        ref={ref}
        {...input}
        nativeID={id}
        aria-labelledby={`${id}-label`}
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        onFocus={(e) => {
          setFocused(true);
          input.onFocus && input.onFocus(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          input.onBlur && input.onBlur(e);
        }}
        style={[styles.input, focused && styles.focused]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { marginTop: space.lg },
  label: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, color: colors.ink, marginBottom: space.sm },
  input: {
    ...fieldBox,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.ink,
    outlineStyle: "none",
  },
  // One pixel less padding offsets the extra border width, so text stays put.
  focused: { borderWidth: 2, borderColor: colors.primary, paddingHorizontal: space.lg - 1 },
});
