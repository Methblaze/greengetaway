// Remote attraction photos come from third-party sites and some of them no
// longer load. A failed image falls back to a neutral placeholder instead of
// leaving a blank hole.
import React, { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/tokens";

export const AttractionImage = ({ uri, alt, style }) => {
  const [failed, setFailed] = useState(!uri);
  if (failed) {
    return (
      <View style={[styles.placeholder, style]} accessible={!!alt} accessibilityLabel={alt ? `${alt}, no photo available` : undefined}>
        <Ionicons name="image-outline" size={28} color={colors.muted} />
      </View>
    );
  }
  return (
    <Image
      source={{ uri }}
      style={[styles.image, style]}
      resizeMode="cover"
      onError={() => setFailed(true)}
      accessible={!!alt}
      accessibilityLabel={alt}
    />
  );
};

const styles = StyleSheet.create({
  image: { backgroundColor: colors.line },
  placeholder: { backgroundColor: colors.line, alignItems: "center", justifyContent: "center" },
});
