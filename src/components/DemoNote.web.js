// Web build only. The browser demo skips Firebase, so any details get in.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, fonts, radius, space } from "../theme/tokens";

export const DemoNote = ({ style }) => (
  <View style={[styles.note, style]}>
    <Ionicons name="information-circle-outline" size={20} color={colors.ink} />
    <Text style={styles.text}>Demo: any email and password work</Text>
  </View>
);

const styles = StyleSheet.create({
  note: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.card,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
  },
  text: { flex: 1, marginLeft: space.sm, fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.ink },
});
