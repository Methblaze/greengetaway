// All 13 attractions ranked by eco score, grouped by band. The 2023 list
// showed only the nine green places under "the most green activities", with
// a vague "See details" link on each row. Here every row is one tap target,
// and the low scorers stay visible, because knowing what to avoid helps too.
import React, { useMemo, useState } from "react";
import { View, Text, Pressable, SectionList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BAND_ORDER, RANKED } from "../data/attractions";
import { colors, fonts, radius, space, type } from "../theme/tokens";
import { ScoreBadge } from "../components/ui/ScoreBadge";
import { AttractionImage } from "../components/ui/AttractionImage";
import { AttractionSheet } from "../components/AttractionSheet";
import { LogoutButton } from "../components/LogoutButton";

// Ties share a rank (1, 1, 3, ...), so equal scores are not shown as better
// or worse than each other.
const withRanks = (list) =>
  list.map((a, i) => ({ ...a, rank: list.findIndex((b) => b.score === a.score) + 1 }));

const SECTIONS = (() => {
  const ranked = withRanks(RANKED);
  return BAND_ORDER.map((band) => ({ band, data: ranked.filter((a) => a.band === band.key) })).filter((s) => s.data.length);
})();

const plural = (n) => (n === 1 ? "1 place" : `${n} places`);

const SectionHeader = ({ band, count }) => (
  <View style={styles.sectionHeader} accessibilityRole="header" accessible accessibilityLabel={`${band.label}, ${band.range}, ${plural(count)}`}>
    <View style={[styles.pill, { backgroundColor: band.color }]}>
      <Text style={styles.pillText}>{band.range}</Text>
    </View>
    <Text style={styles.sectionTitle}>{band.label}</Text>
    <Text style={styles.sectionCount}>{plural(count)}</Text>
  </View>
);

const Row = ({ item, onPress }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`Rank ${item.rank}, ${item.name}, ${item.area}, eco score ${item.score}`}
    style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
  >
    <Text style={styles.rank}>{item.rank}</Text>
    <AttractionImage sources={item.images} style={styles.thumb} />
    <View style={styles.rowText}>
      <Text style={styles.name} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.area} numberOfLines={1}>
        {item.area}
      </Text>
    </View>
    <ScoreBadge score={item.score} size="sm" />
    <Ionicons name="chevron-forward" size={20} color={colors.muted} style={styles.chevron} />
  </Pressable>
);

export const Leaderboard = ({ navigation }) => {
  const [selected, setSelected] = useState(null);
  const sections = useMemo(() => SECTIONS, []);

  const logVisit = (a) => {
    setSelected(null);
    navigation.navigate("Add", { screen: "Add", params: { attractionId: a.id } });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.intro}>
            <View style={styles.titleRow}>
              <Text style={styles.title} accessibilityRole="header">
                Ranked by eco score
              </Text>
              <LogoutButton />
            </View>
            <Text style={styles.lede}>All 13 places, from the lowest impact to the highest.</Text>
          </View>
        }
        renderSectionHeader={({ section }) => <SectionHeader band={section.band} count={section.data.length} />}
        renderItem={({ item }) => <Row item={item} onPress={() => setSelected(item)} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        SectionSeparatorComponent={() => <View style={styles.sectionGap} />}
      />
      <AttractionSheet attraction={selected} onClose={() => setSelected(null)} onLogVisit={logVisit} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxl },
  intro: { paddingTop: space.xl, paddingBottom: space.sm },
  titleRow: { flexDirection: "row", alignItems: "center" },
  title: { ...type.title, flex: 1, marginRight: space.md },
  lede: { ...type.body, color: colors.muted, marginTop: space.xs },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg,
    paddingVertical: space.md,
  },
  pill: { minWidth: 72, height: 24, paddingHorizontal: space.sm, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  pillText: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, color: colors.onPrimary },
  sectionTitle: { ...type.heading, fontSize: 16, lineHeight: 24, marginLeft: space.sm, flex: 1 },
  sectionCount: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.muted },
  sectionGap: { height: space.sm },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 72,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.card,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
  },
  rowPressed: { opacity: 0.85 },
  rank: { width: 24, fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, color: colors.muted },
  thumb: { width: 56, height: 56, borderRadius: radius.card },
  rowText: { flex: 1, marginHorizontal: space.md },
  name: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 24, color: colors.ink },
  area: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.muted },
  chevron: { marginLeft: space.sm },
  separator: { height: space.sm },
});
