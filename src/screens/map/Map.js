// iOS and Android map. The browser uses Map.web.js, built on Leaflet, with
// the same pins, legend, detail sheet and controls.
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ATTRACTIONS, bandFor } from "../../data/attractions";
import { colors, fonts, space } from "../../theme/tokens";
import { AttractionSheet } from "../../components/AttractionSheet";
import { MapLegend } from "../../components/MapLegend";
import { IconButton } from "../../components/ui/IconButton";
import { Toast } from "../../components/ui/Toast";
import { LocationContext } from "../../services/location/location.context";

// ITU's coordinates, as in 2023.
const INITIAL_REGION = {
  latitude: 55.6596,
  longitude: 12.591,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const firstLine = (address) => address.split("\n")[0];

// The pin is the score itself, a badge in the band colour with the number in
// white, so the map can be scanned without colour vision.
const Pin = ({ attraction }) => (
  <View style={[styles.pin, { backgroundColor: attraction.pin }]}>
    <Text style={styles.pinText}>{attraction.score}</Text>
  </View>
);

export const Map = ({ navigation }) => {
  const [hybrid, setHybrid] = useState(false);
  const [showsUserLocation, setShowsUserLocation] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  // Custom marker views must be drawn once before tracking is switched off,
  // or Android can show them blank. Off afterwards keeps panning smooth.
  const [trackPins, setTrackPins] = useState(true);
  const { address } = useContext(LocationContext);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const t = setTimeout(() => setTrackPins(false), 800);
    return () => clearTimeout(t);
  }, []);

  // The 2023 "Your Location" button opened a modal with the address. The
  // address now arrives as a short message when the position is shown.
  useEffect(() => {
    if (!showsUserLocation) return;
    setToast(address && address !== "N/A" ? `You're near ${firstLine(address)}` : "Finding your location…");
  }, [address, showsUserLocation]);

  const logVisit = (a) => {
    setSelected(null);
    navigation.navigate("Add", { screen: "Add", params: { attractionId: a.id } });
  };

  return (
    <View style={styles.screen}>
      <MapView
        initialRegion={INITIAL_REGION}
        style={StyleSheet.absoluteFill}
        mapType={hybrid ? "hybrid" : "standard"}
        showsUserLocation={showsUserLocation}
        showsMyLocationButton={false}
        accessibilityLabel="Map of attractions in Copenhagen by eco score"
      >
        {ATTRACTIONS.map((a) => (
          <Marker
            key={a.id}
            coordinate={a.coordinates}
            onPress={() => setSelected(a)}
            tracksViewChanges={trackPins}
            // Amber and red pins on top where pins overlap, as on the web.
            zIndex={100 - a.score}
            accessibilityLabel={`${a.name}, eco score ${a.score}, ${bandFor(a.score).label.toLowerCase()}`}
          >
            <Pin attraction={a} />
          </Marker>
        ))}
      </MapView>

      <View style={[styles.controls, { top: insets.top + space.md }]}>
        <IconButton
          icon={hybrid ? "map-outline" : "layers-outline"}
          label={hybrid ? "Show map" : "Show satellite"}
          onPress={() => setHybrid(!hybrid)}
        />
        <IconButton
          icon="locate"
          label={showsUserLocation ? "Hide my location" : "Show my location"}
          active={showsUserLocation}
          onPress={() => setShowsUserLocation(!showsUserLocation)}
          style={styles.controlGap}
        />
      </View>

      <View style={styles.bottom} pointerEvents="box-none">
        <Toast message={toast} onHide={() => setToast(null)} style={styles.toast} />
        <MapLegend />
      </View>

      <AttractionSheet attraction={selected} onClose={() => setSelected(null)} onLogVisit={logVisit} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  pin: {
    minWidth: 40,
    height: 28,
    paddingHorizontal: space.sm,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  pinText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.onPrimary },
  controls: { position: "absolute", right: space.lg },
  controlGap: { marginTop: space.sm },
  bottom: { position: "absolute", left: space.lg, right: space.lg, bottom: space.lg },
  toast: { marginBottom: space.sm },
});
