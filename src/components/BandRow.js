// One eco score band as colour, range and label.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts, radius, space, type } from "../theme/tokens";

export const BandRow = ({ band, last }) => (
  <View style={[styles.row, last && styles.rowLast]} accessible accessibilityLabel={`${band.range}, ${band.label.toLowerCase()}`}>
    <View style={[styles.pill, { backgroundColor: band.color }]}>
      <Text style={styles.pillText}>{band.range}</Text>
    </View>
    <Text style={styles.label}>{band.label}</Text>
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: space.sm },
  rowLast: { paddingBottom: space.md },
  pill: {
    width: 88,
    height: 28,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: colors.onPrimary },
  label: { ...type.body, marginLeft: space.md },
});
