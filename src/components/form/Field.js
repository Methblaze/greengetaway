// A visible label above its control, as every input gets one. nativeID lets
// web controls point at it with aria-labelledby.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts, radius, space, touch } from "../../theme/tokens";

export const Field = ({ label, hint, labelId, children, style }) => (
  <View style={[styles.field, style]}>
    <Text style={styles.label} nativeID={labelId}>
      {label}
      {hint ? <Text style={styles.hint}> {hint}</Text> : null}
    </Text>
    {children}
  </View>
);

// Shared look for anything that sits in a field: inputs and field buttons.
export const fieldBox = {
  minHeight: touch + 4,
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.field,
  borderRadius: radius.card,
  paddingHorizontal: space.lg,
};

const styles = StyleSheet.create({
  field: { marginTop: space.xl },
  label: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, color: colors.ink, marginBottom: space.sm },
  hint: { fontFamily: fonts.regular, color: colors.muted },
});
