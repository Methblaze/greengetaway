// "Your visits" replaces the 2023 Profile, which showed one overwritten entry
// and a loose grid of photos, with "You haven't taken any photos yet :(" as
// its empty state. Here the progress loop is visible: a summary, the visit
// history, and a clear way to log the first visit. Logout lives here now,
// instead of in every screen's header.
import React, { useContext, useMemo, useState } from "react";
import { View, Text, Image, Pressable, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getAttraction, bandFor } from "../data/attractions";
import { colors, fonts, radius, space, type, hover } from "../theme/tokens";
import { useVisits } from "../services/visits/visits.context";
import { AuthenticationContext } from "../services/authentication/authentication.context";
import { ScoreBadge } from "../components/ui/ScoreBadge";
import { AttractionImage } from "../components/ui/AttractionImage";
import { Button } from "../components/ui/Button";
import { AttractionSheet } from "../components/AttractionSheet";
import { formatVisitDate } from "../utils/date";

// The demo persona from 2023. If the portrait fails to load, initials show
// instead of a broken image.
const PERSONA = {
  name: "Hans Christian",
  bio: "Writes fairytales & Loves Sea creatures",
  photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/HCA_by_Thora_Hallager_1869.jpg/197px-HCA_by_Thora_Hallager_1869.jpg",
  initials: "HC",
};

const Avatar = () => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <View style={[styles.avatar, styles.initials]}>
        <Text style={styles.initialsText}>{PERSONA.initials}</Text>
      </View>
    );
  }
  return <Image source={{ uri: PERSONA.photo }} style={styles.avatar} onError={() => setFailed(true)} accessibilityIgnoresInvertColors />;
};

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

const VisitCard = ({ visit, onPress }) => {
  const a = getAttraction(visit.attractionId);
  const date = formatVisitDate(visit.date);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${a.name}, ${date}, eco score ${a.score}, ${bandFor(a.score).label.toLowerCase()}${visit.photoUri ? ", with your photo" : ""}`}
      style={({ pressed, hovered }) => [styles.card, hovered && hover.card, pressed && styles.pressed]}
    >
      {visit.photoUri ? (
        <Image source={{ uri: visit.photoUri }} style={styles.cardPhoto} />
      ) : (
        <AttractionImage sources={a.images} style={styles.cardPhoto} />
      )}
      <View style={styles.cardText}>
        <Text style={styles.cardName} numberOfLines={2}>
          {a.name}
        </Text>
        <Text style={styles.cardDate}>{date}</Text>
        <ScoreBadge score={a.score} size="sm" showLabel style={styles.cardScore} />
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </Pressable>
  );
};

// Defined once, so the list keeps the same separator between renders.
const CardGap = () => <View style={styles.separator} />;

export const ProfileScreen = ({ navigation }) => {
  const { visits } = useVisits();
  const { onLogout } = useContext(AuthenticationContext);
  const [selected, setSelected] = useState(null);

  // Newest first by visit date, then by when it was logged.
  const history = useMemo(
    () => [...visits].sort((x, y) => y.date - x.date || Number(y.id) - Number(x.id)),
    [visits]
  );
  const average = visits.length
    ? Math.round(visits.reduce((sum, v) => sum + getAttraction(v.attractionId).score, 0) / visits.length)
    : null;

  const logVisit = (a) => {
    setSelected(null);
    navigation.navigate("Add", { screen: "Add", params: a ? { attractionId: a.id } : undefined });
  };

  const header = (
    <View>
      <Text style={styles.title} accessibilityRole="header">
        Your visits
      </Text>
      <View style={styles.persona}>
        <Avatar />
        <View style={styles.personaText}>
          <Text style={styles.personaName}>{PERSONA.name}</Text>
          <Text style={styles.personaBio}>{PERSONA.bio}</Text>
        </View>
      </View>

      {visits.length > 0 && (
        <View style={styles.summary} accessible accessibilityLabel={`${plural(visits.length, "visit")}, average eco score ${average}, ${bandFor(average).label.toLowerCase()}`}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{visits.length}</Text>
            <Text style={styles.statLabel}>{visits.length === 1 ? "Visit" : "Visits"}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <ScoreBadge score={average} showLabel />
            <Text style={styles.statLabel}>Average eco score</Text>
          </View>
        </View>
      )}

      {visits.length > 0 && (
        <Text style={styles.heading} accessibilityRole="header">
          History
        </Text>
      )}
    </View>
  );

  const empty = (
    <View style={styles.empty}>
      <Ionicons name="leaf-outline" size={32} color={colors.primary} />
      <Text style={styles.emptyTitle}>No visits yet</Text>
      <Text style={styles.emptyText}>When you visit one of the places, log it here with the date and a photo.</Text>
      <Button title="Log your first visit" icon="add-circle-outline" onPress={() => logVisit(null)} style={styles.emptyButton} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={history}
        keyExtractor={(v) => v.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        renderItem={({ item }) => <VisitCard visit={item} onPress={() => setSelected(getAttraction(item.attractionId))} />}
        ItemSeparatorComponent={CardGap}
        ListFooterComponent={
          <Button title="Log out" variant="outline" icon="log-out-outline" onPress={onLogout} style={styles.logout} />
        }
      />
      <AttractionSheet attraction={selected} onClose={() => setSelected(null)} onLogVisit={logVisit} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: space.lg, paddingTop: space.xl, paddingBottom: space.xxl, flexGrow: 1 },
  title: type.title,
  persona: { flexDirection: "row", alignItems: "center", marginTop: space.lg },
  avatar: { width: 56, height: 56, borderRadius: radius.pill, backgroundColor: colors.line },
  initials: { alignItems: "center", justifyContent: "center" },
  initialsText: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 26, color: colors.ink },
  personaText: { flex: 1, marginLeft: space.md },
  personaName: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 24, color: colors.ink },
  personaBio: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.muted },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: space.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.card,
    paddingVertical: space.lg,
  },
  stat: { flex: 1, alignItems: "center" },
  statValue: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 26, color: colors.ink },
  statLabel: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.muted, marginTop: space.xs },
  statDivider: { width: 1, alignSelf: "stretch", backgroundColor: colors.line },
  heading: { ...type.heading, marginTop: space.xl, marginBottom: space.md },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.card,
    padding: space.md,
  },
  pressed: { opacity: 0.85 },
  cardPhoto: { width: 80, height: 80, borderRadius: radius.card, backgroundColor: colors.line },
  cardText: { flex: 1, marginHorizontal: space.md },
  cardName: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 24, color: colors.ink },
  cardDate: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.muted },
  cardScore: { marginTop: space.sm },
  separator: { height: space.md },
  empty: {
    alignItems: "center",
    marginTop: space.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.card,
    padding: space.xl,
  },
  emptyTitle: { ...type.heading, marginTop: space.md },
  emptyText: { ...type.body, color: colors.muted, textAlign: "center", marginTop: space.xs },
  emptyButton: { marginTop: space.lg, alignSelf: "stretch" },
  logout: { marginTop: space.xl },
});
