// iOS and Android date field: shows the chosen date, and opens the platform
// date picker on tap. The browser uses DateField.web.js.
import React, { useState } from "react";
import { Text, Pressable, Platform, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { colors, fonts, space } from "../../theme/tokens";
import { formatVisitDate } from "../../utils/date";
import { fieldBox } from "./Field";

export const DateField = ({ value, onChange, labelId }) => {
  const [open, setOpen] = useState(false);

  const onPick = (event, date) => {
    if (Platform.OS === "android") setOpen(false);
    if (event.type === "set" && date) onChange(date);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(!open)}
        accessibilityRole="button"
        aria-labelledby={labelId}
        accessibilityHint="Opens the date picker"
        style={({ pressed }) => [styles.field, pressed && styles.pressed]}
      >
        <Ionicons name="calendar-outline" size={20} color={colors.muted} />
        <Text style={styles.value}>{formatVisitDate(value)}</Text>
        <Text style={styles.change}>Change</Text>
      </Pressable>
      {open && (
        <DateTimePicker
          value={value}
          mode="date"
          maximumDate={new Date()}
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={onPick}
          accentColor={colors.primary}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  field: { ...fieldBox, flexDirection: "row", alignItems: "center" },
  pressed: { opacity: 0.8 },
  value: { flex: 1, marginLeft: space.sm, fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, color: colors.ink },
  change: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, color: colors.primary, textDecorationLine: "underline" },
});
