// Home replaces the 2023 Overview. Where Overview was a paragraph of generic
// copy and a button that repeated the Map tab, Home shows real content first:
// the greenest places, how the score works, and the way to log a visit.
import React, { useState } from "react";
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RANKED, bandFor } from "../data/attractions";
import { colors, fonts, radius, space, type } from "../theme/tokens";
import { ScoreBadge } from "../components/ui/ScoreBadge";
import { AttractionImage } from "../components/ui/AttractionImage";
import { Button } from "../components/ui/Button";
import { ScoreLegend } from "../components/ScoreLegend";
import { AttractionSheet } from "../components/AttractionSheet";

const PICKS = RANKED.slice(0, 3);

const PickCard = ({ attraction, onPress }) => {
  const band = bandFor(attraction.score);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${attraction.name}, ${attraction.area}, eco score ${attraction.score}, ${band.label.toLowerCase()}`}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <AttractionImage uri={attraction.images[0]} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={2}>
          {attraction.name}
        </Text>
        <Text style={styles.cardArea} numberOfLines={1}>
          {attraction.area}
        </Text>
        <ScoreBadge score={attraction.score} size="sm" showLabel style={styles.cardScore} />
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} style={styles.chevron} />
    </Pressable>
  );
};

export const HomeScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null);

  const logVisit = (attraction) => {
    setSelected(null);
    navigation.navigate("Add", { screen: "Add", params: attraction ? { attractionId: attraction.id } : undefined });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <View style={styles.brandRow}>
            <Image source={require("../../assets/Logo.png")} style={styles.logo} accessibilityIgnoresInvertColors />
            <Text style={styles.title} accessibilityRole="header">
              GreenGetaway
            </Text>
          </View>
          <Text style={styles.lede}>Find the greenest things to do in Copenhagen and keep track of where you've been.</Text>
        </View>

        <Text style={styles.heading} accessibilityRole="header">
          Greenest picks
        </Text>
        {/* Stacked, not a sideways scroller: a horizontal row hid the third
            pick from mouse users, who cannot drag-scroll it. */}
        <View style={styles.picks}>
          {PICKS.map((a) => (
            <PickCard key={a.id} attraction={a} onPress={() => setSelected(a)} />
          ))}
        </View>

        <Text style={styles.heading} accessibilityRole="header">
          Eco score
        </Text>
        <ScoreLegend />

        <View style={styles.logCard}>
          <Text style={styles.logTitle}>Been somewhere green?</Text>
          <Text style={styles.logText}>Save the place and the date, and add a photo if you like.</Text>
          <Button title="Log a visit" icon="add-circle-outline" onPress={() => logVisit(null)} style={styles.logButton} />
        </View>
      </ScrollView>

      <AttractionSheet attraction={selected} onClose={() => setSelected(null)} onLogVisit={logVisit} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: space.lg, paddingTop: space.xl, paddingBottom: space.xxl },
  intro: { marginBottom: space.xl },
  brandRow: { flexDirection: "row", alignItems: "center", marginBottom: space.md },
  logo: { width: 32, height: 32, marginRight: space.sm },
  title: type.title,
  lede: { ...type.body, color: colors.ink },
  heading: { ...type.heading, marginTop: space.lg, marginBottom: space.md },
  picks: { gap: space.md },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.card,
    padding: space.md,
  },
  cardPressed: { opacity: 0.85 },
  cardImage: { width: 88, height: 88, borderRadius: radius.card },
  cardBody: { flex: 1, marginLeft: space.md },
  chevron: { marginLeft: space.sm },
  cardName: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 24, color: colors.ink },
  cardArea: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.muted },
  cardScore: { marginTop: space.sm },
  logCard: {
    marginTop: space.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.card,
    padding: space.lg,
  },
  logTitle: { ...type.heading, fontSize: 16, lineHeight: 24 },
  logText: { ...type.body, color: colors.muted, marginTop: space.xs },
  logButton: { marginTop: space.lg },
});
