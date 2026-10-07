// The three eco score bands plus the way into the "How eco score works" sheet.
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BAND_ORDER } from "../data/attractions";
import { colors, fonts, radius, space, touch } from "../theme/tokens";
import { BandRow } from "./BandRow";
import { EcoScoreSheet } from "./EcoScoreSheet";

export const ScoreLegend = ({ style }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.card, style]}>
      {BAND_ORDER.map((band, i) => (
        <BandRow key={band.key} band={band} last={i === BAND_ORDER.length - 1} />
      ))}
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
      >
        <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
        <Text style={styles.linkText}>How eco score works</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.primary} />
      </Pressable>
      <EcoScoreSheet visible={open} onClose={() => setOpen(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.card,
    paddingHorizontal: space.lg,
    paddingTop: space.md,
  },
  link: {
    minHeight: touch,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.line,
    marginHorizontal: -space.lg,
    paddingHorizontal: space.lg,
  },
  linkPressed: { backgroundColor: colors.bg },
  linkText: { flex: 1, fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, color: colors.primary, marginLeft: space.sm },
});
