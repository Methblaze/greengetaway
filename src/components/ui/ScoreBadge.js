// The eco score as colour, number and (optionally) the band label, so the
// band never relies on colour alone.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { bandFor } from "../../data/attractions";
import { colors, fonts, radius, space, type } from "../../theme/tokens";

export const ScoreBadge = ({ score, showLabel = false, size = "md", style }) => {
  const band = bandFor(score);
  const small = size === "sm";
  return (
    <View
      style={[styles.row, style]}
      accessible
      accessibilityLabel={`Eco score ${score}, ${band.label.toLowerCase()}`}
    >
      <View style={[styles.badge, small && styles.badgeSmall, { backgroundColor: band.color }]}>
        <Text style={[styles.number, small && styles.numberSmall]}>{score}</Text>
      </View>
      {showLabel && <Text style={[styles.label, small && styles.labelSmall]}>{band.label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  badge: {
    minWidth: 44,
    height: 28,
    paddingHorizontal: space.sm,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeSmall: { minWidth: 36, height: 24 },
  number: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, color: colors.onPrimary },
  numberSmall: { fontSize: 12, lineHeight: 16 },
  label: { ...type.label, fontFamily: fonts.regular, marginLeft: space.sm },
  labelSmall: { fontSize: 12, lineHeight: 16, color: colors.muted },
});
