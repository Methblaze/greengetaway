// "Log a visit" replaces the 2023 Add screen. In 2023 the attraction was free
// text, the date was one shared value that every entry overwrote, the photo
// went into a separate list, and there was no save step at all, so nothing
// told the user whether anything had been recorded. Here a visit is one
// record that is saved on purpose.
import React, { useEffect } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAttraction } from "../data/attractions";
import { colors, fonts, radius, space, type } from "../theme/tokens";
import { useVisits } from "../services/visits/visits.context";
import { useToast } from "../services/toast/toast.context";
import { Field } from "../components/form/Field";
import { AttractionPicker } from "../components/form/AttractionPicker";
import { DateField } from "../components/form/DateField";
import { Button } from "../components/ui/Button";
import { LogoutButton } from "../components/LogoutButton";

export const Add = ({ navigation, route }) => {
  const { draft, updateDraft, saveDraft } = useVisits();
  const { showToast } = useToast();
  const prefill = route.params && route.params.attractionId;

  // "Log a visit here" on a detail sheet opens this screen with the
  // attraction already chosen.
  useEffect(() => {
    if (!prefill) return;
    updateDraft({ attractionId: prefill });
    navigation.setParams({ attractionId: undefined });
  }, [prefill]);

  const save = () => {
    const visit = saveDraft();
    if (!visit) return;
    showToast(`Visit to ${getAttraction(visit.attractionId).name} saved`);
    navigation.navigate("Profile");
  };

  const canSave = !!draft.attractionId;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.titleRow}>
          <Text style={styles.title} accessibilityRole="header">
            Log a visit
          </Text>
          <LogoutButton />
        </View>
        <Text style={styles.lede}>Keep track of the green places you have been.</Text>

        <Field label="Attraction" labelId="visit-attraction-label">
          <AttractionPicker
            value={draft.attractionId}
            onChange={(attractionId) => updateDraft({ attractionId })}
            labelId="visit-attraction-label"
          />
        </Field>

        <Field label="Date" labelId="visit-date-label">
          <DateField value={draft.date} onChange={(date) => updateDraft({ date })} labelId="visit-date-label" />
        </Field>

        <Field label="Photo" hint="(optional)" labelId="visit-photo-label">
          {draft.photoUri ? (
            <View style={styles.photoRow}>
              <Image source={{ uri: draft.photoUri }} style={styles.photo} accessibilityLabel="Photo for this visit" />
              <View style={styles.photoActions}>
                <Button title="Retake" variant="secondary" icon="camera-outline" onPress={() => navigation.navigate("Camera")} />
                <Button title="Remove" variant="secondary" icon="trash-outline" onPress={() => updateDraft({ photoUri: null })} />
              </View>
            </View>
          ) : (
            <Button
              title="Take a photo"
              variant="secondary"
              icon="camera-outline"
              onPress={() => navigation.navigate("Camera")}
              style={styles.photoButton}
            />
          )}
        </Field>

        <Button title="Save visit" icon="checkmark" onPress={save} disabled={!canSave} style={styles.save} />
        {!canSave && <Text style={styles.saveHint}>Choose an attraction to save your visit.</Text>}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: space.lg, paddingTop: space.xl, paddingBottom: space.xxl },
  titleRow: { flexDirection: "row", alignItems: "center" },
  title: { ...type.title, flex: 1, marginRight: space.md },
  lede: { ...type.body, color: colors.muted, marginTop: space.xs },
  photoButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.field,
    backgroundColor: colors.surface,
    minHeight: 48,
  },
  photoRow: { flexDirection: "row", alignItems: "center" },
  photo: { width: 96, height: 96, borderRadius: radius.card, backgroundColor: colors.line },
  photoActions: { marginLeft: space.md, alignItems: "flex-start" },
  save: { marginTop: space.xxl },
  saveHint: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.muted, marginTop: space.sm, textAlign: "center" },
});
