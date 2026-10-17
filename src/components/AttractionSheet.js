// Attraction detail as a bottom sheet. It answers the next questions after
// "what is this": how do I get there, and can I save that I went.
import React from "react";
import { View, Text, Pressable, Linking, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { bandFor, directionsUrl } from "../data/attractions";
import { colors, fonts, radius, space, touch, type, hover, pressed as pressedStyle } from "../theme/tokens";
import { Sheet } from "./ui/Sheet";
import { ScoreBadge } from "./ui/ScoreBadge";
import { AttractionImage } from "./ui/AttractionImage";
import { Button } from "./ui/Button";

export const AttractionSheet = ({ attraction, onClose, onLogVisit }) => {
  // Keep the last attraction while the sheet animates out.
  const last = React.useRef(attraction);
  if (attraction) last.current = attraction;
  const a = last.current;

  return (
    <Sheet visible={!!attraction} onClose={onClose} title={a ? a.name : ""}>
      {a && (
        <>
          <Text style={styles.area}>{a.area}</Text>
          <AttractionImage key={a.id} sources={a.images} alt={`Photo of ${a.name}`} style={styles.photo} />
          <ScoreBadge score={a.score} showLabel style={styles.score} />
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={20} color={colors.muted} />
            <Text style={styles.address}>{a.address}</Text>
          </View>
          <Pressable
            onPress={() => Linking.openURL(directionsUrl(a))}
            accessibilityRole="link"
            accessibilityHint="Opens Google Maps"
            style={({ pressed, hovered }) => [styles.directions, hovered && hover.quiet, pressed && pressedStyle.surface]}
          >
            <Ionicons name="navigate-outline" size={20} color={colors.primary} />
            <Text style={styles.directionsText}>Get directions</Text>
            <Ionicons name="open-outline" size={16} color={colors.primary} />
          </Pressable>
          <Button title="Log a visit here" icon="add-circle-outline" onPress={() => onLogVisit(a)} style={styles.primary} />
        </>
      )}
    </Sheet>
  );
};

const styles = StyleSheet.create({
  area: { ...type.body, color: colors.muted, marginTop: -space.sm, marginBottom: space.md },
  photo: { width: "100%", height: 180, borderRadius: radius.card },
  score: { marginTop: space.lg },
  addressRow: { flexDirection: "row", alignItems: "flex-start", marginTop: space.md },
  address: { ...type.body, flex: 1, marginLeft: space.sm },
  directions: {
    minHeight: touch,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: space.xs,
    paddingRight: space.sm,
  },
  directionsText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.primary,
    marginHorizontal: space.sm,
    textDecorationLine: "underline",
  },
  primary: { marginTop: space.lg },
});
