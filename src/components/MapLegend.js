// Compact legend that floats over the map, so the pins can be read before
// anything is tapped. The info button opens "How eco score works".
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { BAND_ORDER } from "../data/attractions";
import { colors, fonts, radius, space } from "../theme/tokens";
import { IconButton } from "./ui/IconButton";
import { EcoScoreSheet } from "./EcoScoreSheet";

export const MapLegend = ({ style }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.card, style]}>
      <View style={styles.items}>
        {BAND_ORDER.map((band) => (
          <View key={band.key} style={styles.item} accessible accessibilityLabel={`${band.range}, ${band.label.toLowerCase()}`}>
            <View style={[styles.pill, { backgroundColor: band.color }]}>
              <Text style={styles.pillText}>{band.range}</Text>
            </View>
            <Text style={styles.label}>{band.label.replace(" impact", "")}</Text>
          </View>
        ))}
      </View>
      <IconButton icon="information-circle-outline" label="How eco score works" onPress={() => setOpen(true)} style={styles.info} />
      <EcoScoreSheet visible={open} onClose={() => setOpen(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.card,
    paddingVertical: space.sm,
    paddingLeft: space.md,
    paddingRight: space.sm,
  },
  items: { flex: 1, flexDirection: "row", justifyContent: "space-between", marginRight: space.sm },
  item: { alignItems: "center" },
  pill: { minWidth: 72, height: 24, paddingHorizontal: space.sm, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  pillText: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: colors.onPrimary },
  label: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, color: colors.ink, marginTop: space.xs },
  info: { borderColor: colors.line },
});
