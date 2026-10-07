// Choose one of the 13 attractions, with search. In 2023 the attraction was
// free text, so a typo created a new place and nothing linked to the data.
import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RANKED, getAttraction } from "../../data/attractions";
import { colors, fonts, radius, space, touch } from "../../theme/tokens";
import { Sheet } from "../ui/Sheet";
import { ScoreBadge } from "../ui/ScoreBadge";
import { AttractionImage } from "../ui/AttractionImage";
import { fieldBox } from "./Field";

// "faelled" finds Fælled, "soerne" finds Søerne, "bla planet" finds Blå.
const fold = (s) =>
  s
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "oe")
    .replace(/å/g, "aa")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
const matches = (a, q) => {
  const hay = fold(`${a.name} ${a.area}`);
  const loose = hay.replace(/oe/g, "o").replace(/aa/g, "a");
  return q.split(/\s+/).every((w) => hay.includes(w) || loose.includes(w));
};

export const AttractionPicker = ({ value, onChange, labelId }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const selected = value ? getAttraction(value) : null;

  const results = useMemo(() => {
    const q = fold(query.trim());
    return q ? RANKED.filter((a) => matches(a, q)) : RANKED;
  }, [query]);

  const choose = (a) => {
    onChange(a.id);
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        aria-labelledby={labelId}
        accessibilityHint={selected ? `${selected.name} chosen. Opens the list to change it.` : "Opens the list of attractions"}
        style={({ pressed }) => [styles.trigger, selected && styles.triggerChosen, pressed && styles.pressed]}
      >
        {selected ? (
          <>
            <AttractionImage sources={selected.images} style={styles.thumb} />
            <View style={styles.triggerText}>
              <Text style={styles.name} numberOfLines={1}>
                {selected.name}
              </Text>
              <Text style={styles.area}>{selected.area}</Text>
            </View>
            <ScoreBadge score={selected.score} size="sm" />
            <Text style={styles.change}>Change</Text>
          </>
        ) : (
          <>
            <Ionicons name="search" size={20} color={colors.muted} />
            <Text style={styles.placeholder}>Choose an attraction</Text>
            <Ionicons name="chevron-down" size={20} color={colors.ink} />
          </>
        )}
      </Pressable>

      <Sheet visible={open} onClose={() => setOpen(false)} title="Choose an attraction">
        <Text style={styles.searchLabel} nativeID="attraction-search-label">
          Search by name or area
        </Text>
        {/* Focus shows on the whole field (2px primary border, 6.6:1 on
            white) rather than as a ring inside it. */}
        <View style={[styles.search, searchFocused && styles.searchFocused]}>
          <Ionicons name="search" size={20} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={styles.searchInput}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            aria-labelledby="attraction-search-label"
            accessibilityLabel="Search by name or area"
          />
        </View>
        <View accessibilityRole="radiogroup" style={styles.list}>
          {results.map((a) => {
            const checked = a.id === value;
            return (
              <Pressable
                key={a.id}
                onPress={() => choose(a)}
                accessibilityRole="radio"
                accessibilityState={{ checked }}
                accessibilityLabel={`${a.name}, ${a.area}, eco score ${a.score}`}
                style={({ pressed }) => [styles.option, checked && styles.optionChecked, pressed && styles.pressed]}
              >
                <View style={styles.triggerText}>
                  <Text style={styles.name}>{a.name}</Text>
                  <Text style={styles.area}>{a.area}</Text>
                </View>
                <ScoreBadge score={a.score} size="sm" />
                <Ionicons
                  name={checked ? "checkmark-circle" : "ellipse-outline"}
                  size={22}
                  color={checked ? colors.primary : colors.field}
                  style={styles.check}
                />
              </Pressable>
            );
          })}
          {results.length === 0 && (
            <Text style={styles.empty}>No attraction matches "{query.trim()}". Try part of the name, such as "kirke".</Text>
          )}
        </View>
      </Sheet>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: { ...fieldBox, flexDirection: "row", alignItems: "center" },
  triggerChosen: { paddingLeft: space.sm, paddingVertical: space.sm },
  pressed: { opacity: 0.8 },
  placeholder: { flex: 1, marginLeft: space.sm, fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, color: colors.muted },
  thumb: { width: 48, height: 48, borderRadius: radius.card },
  triggerText: { flex: 1, marginHorizontal: space.md },
  name: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 24, color: colors.ink },
  area: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.muted },
  change: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, color: colors.primary, marginLeft: space.md, textDecorationLine: "underline" },
  searchLabel: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, color: colors.ink, marginBottom: space.sm },
  search: { ...fieldBox, flexDirection: "row", alignItems: "center" },
  // One pixel less padding offsets the extra border width, so nothing shifts.
  searchFocused: { borderWidth: 2, borderColor: colors.primary, paddingHorizontal: space.lg - 1 },
  searchInput: {
    flex: 1,
    minHeight: touch,
    marginLeft: space.sm,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.ink,
    outlineStyle: "none",
  },
  list: { marginTop: space.md, marginBottom: space.lg },
  option: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingRight: space.xs,
  },
  optionChecked: { backgroundColor: colors.bg },
  check: { marginLeft: space.md },
  empty: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, color: colors.muted, paddingVertical: space.lg },
});
