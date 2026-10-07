import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BAND_ORDER, ECO_SCORE_EXPLAINER } from "../data/attractions";
import { colors, space, type } from "../theme/tokens";
import { Sheet } from "./ui/Sheet";
import { BandRow } from "./BandRow";

export const EcoScoreSheet = ({ visible, onClose }) => (
  <Sheet visible={visible} onClose={onClose} title={ECO_SCORE_EXPLAINER.title}>
    <Text style={styles.body}>{ECO_SCORE_EXPLAINER.intro}</Text>
    <View style={styles.bands}>
      {BAND_ORDER.map((band) => (
        <BandRow key={band.key} band={band} />
      ))}
    </View>
    {ECO_SCORE_EXPLAINER.method.map((p) => (
      <Text key={p} style={[styles.body, styles.muted]}>
        {p}
      </Text>
    ))}
  </Sheet>
);

const styles = StyleSheet.create({
  body: { ...type.body, marginBottom: space.md },
  muted: { color: colors.muted },
  bands: { marginBottom: space.lg },
});
