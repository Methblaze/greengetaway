// Bottom sheet used for the attraction detail and the eco score explainer.
// Closes with the X button, a tap on the scrim, the Android back button, and
// Escape on the web. react-native-web's Modal traps focus while open and
// hands it back to the element that opened it (a map pin, a card) on close.
import React, { useEffect, useRef, useState } from "react";
import { Modal, View, Text, Pressable, ScrollView, Animated, Easing, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, shadow, space, touch, type } from "../../theme/tokens";
import { duration, useReducedMotion } from "../../theme/motion";

const useNativeDriver = Platform.OS !== "web";

export const Sheet = ({ visible, onClose, title, children }) => {
  const reduced = useReducedMotion();
  const insets = useSafeAreaInsets();
  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) setMounted(true);
    else if (mounted) {
      Animated.timing(progress, {
        toValue: 0,
        duration: reduced ? 0 : duration.exit,
        easing: Easing.in(Easing.cubic),
        useNativeDriver,
      }).start(() => setMounted(false));
    }
  }, [visible]);

  useEffect(() => {
    if (mounted && visible) {
      Animated.timing(progress, {
        toValue: 1,
        duration: reduced ? 0 : duration.enter,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }).start();
    }
  }, [mounted, visible]);

  if (!mounted) return null;

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [48, 0] });

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: progress }]}>
          {/* The scrim is a mouse and touch target only. Keyboard and screen
              reader users close the sheet with the X button or Escape. */}
          <Pressable style={[StyleSheet.absoluteFill, styles.scrim]} onPress={onClose} accessible={false} focusable={false} />
        </Animated.View>
        <Animated.View
          style={[styles.sheet, shadow, { paddingBottom: space.xl + insets.bottom, opacity: progress, transform: [{ translateY }] }]}
          accessibilityViewIsModal
          aria-modal
          role="dialog"
          aria-label={title}
        >
          <View style={styles.header}>
            <Text style={styles.title} accessibilityRole="header" numberOfLines={2}>
              {title}
            </Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={4}
              style={({ pressed }) => [styles.close, pressed && styles.closePressed]}
            >
              <Ionicons name="close" size={24} color={colors.ink} />
            </Pressable>
          </View>
          <ScrollView bounces={false} contentContainerStyle={styles.content}>
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  scrim: { backgroundColor: colors.scrim },
  sheet: {
    maxHeight: "88%",
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: space.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingLeft: space.lg,
    paddingRight: space.sm,
  },
  title: { ...type.heading, flex: 1, paddingTop: space.sm },
  close: { width: touch, height: touch, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  closePressed: { backgroundColor: colors.bg },
  content: { paddingHorizontal: space.lg, paddingTop: space.md },
});
