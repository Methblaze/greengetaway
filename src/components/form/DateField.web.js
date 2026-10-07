// Web build only. The browser's own date input, styled as a field, labelled
// by the visible "Date" label, and capped at today. The browser formats the
// input in its own locale (10/07/2026 can mean either 10 July or 7 October),
// so the chosen date is also written out in full underneath.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts, radius, space, touch } from "../../theme/tokens";
import { toInputValue, fromInputValue, formatVisitDate } from "../../utils/date";

export const DateField = ({ value, onChange, labelId }) => (
  <View>
    {React.createElement("input", {
      type: "date",
      value: toInputValue(value),
      max: toInputValue(new Date()),
      "aria-labelledby": labelId,
      "aria-describedby": "visit-date-written",
      onChange: (e) => e.target.value && onChange(fromInputValue(e.target.value)),
      style: {
        boxSizing: "border-box",
        width: "100%",
        minHeight: touch + 4,
        padding: `0 ${space.lg}px`,
        border: `1px solid ${colors.field}`,
        borderRadius: radius.card,
        background: colors.surface,
        color: colors.ink,
        fontFamily: fonts.regular,
        fontSize: 16,
        accentColor: colors.primary,
      },
    })}
    <Text style={styles.written} nativeID="visit-date-written">
      {formatVisitDate(value)}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  written: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.muted, marginTop: space.xs },
});
