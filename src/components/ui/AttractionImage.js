// Remote attraction photos come from third-party sites and some of them no
// longer load. Each attraction has two, so a failed photo falls back to the
// next one, and only then to a neutral placeholder instead of a blank hole.
import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../theme/tokens";

export const AttractionImage = ({ sources = [], alt, style }) => {
  const list = sources.filter(Boolean);
  const [index, setIndex] = useState(0);
  const uri = list[index];

  if (!uri) {
    return (
      <View style={[styles.placeholder, style]} accessible={!!alt} accessibilityLabel={alt ? `${alt}, no photo available` : undefined}>
        <Ionicons name="image-outline" size={28} color={colors.muted} />
      </View>
    );
  }
  return (
    <Image
      key={uri}
      source={{ uri }}
      style={[styles.image, style]}
      resizeMode="cover"
      onError={() => setIndex(index + 1)}
      accessible={!!alt}
      accessibilityLabel={alt}
    />
  );
};

const styles = StyleSheet.create({
  image: { backgroundColor: colors.line },
  placeholder: { backgroundColor: colors.line, alignItems: "center", justifyContent: "center" },
});
