// Web build only (Metro picks this file over Map.js when bundling for the
// browser). react-native-maps has no browser implementation, so the map is
// rebuilt on Leaflet with the same attractions, pins, detail sheet, layer
// switch and location button as the native screen.
import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import L from "leaflet";

import leafletCss from "../../web/leafletCss";
import { ATTRACTIONS, bandFor } from "../../data/attractions";
import { colors, fonts, space, touch } from "../../theme/tokens";
import { AttractionSheet } from "../../components/AttractionSheet";
import { MapLegend } from "../../components/MapLegend";
import { IconButton } from "../../components/ui/IconButton";
import { Toast } from "../../components/ui/Toast";
import { LocationContext } from "../../services/location/location.context";
import { requestLocationOnce } from "../../services/location/location.service";

// ITU, as in the native app's initial region.
const START = [55.6596, 12.591];
const START_ZOOM = 12;

// CARTO, used in 2023, now needs an API key. These two need none.
const TILES = {
  standard: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' },
  },
  imagery: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    options: { maxZoom: 19, attribution: "Imagery &copy; Esri" },
  },
  labels: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    options: { maxZoom: 19, pane: "labels" },
  },
};

const EXTRA_CSS = `
.leaflet-container { font: inherit; background: ${colors.bg}; }
.leaflet-control-attribution { font-size: 10px; }
.gg-labels { pointer-events: none; }
.gg-pin-wrap { background: none; border: 0; }
.gg-pin {
  display: flex; align-items: center; justify-content: center; box-sizing: border-box;
  min-width: 40px; height: 28px; padding: 0 8px; border-radius: 999px;
  border: 2px solid ${colors.surface}; outline: 1px solid rgba(31, 42, 34, 0.35);
  color: ${colors.onPrimary}; font-family: ${fonts.semibold}, system-ui, sans-serif; font-size: 13px; line-height: 1;
}
.gg-pin-wrap:focus { outline: none; }
.gg-pin-wrap:focus-visible .gg-pin { outline: 3px solid ${colors.ink}; outline-offset: 2px; }
.leaflet-touch .leaflet-bar a, .leaflet-bar a {
  width: ${touch}px; height: ${touch}px; line-height: ${touch}px; font-size: 22px; color: ${colors.ink};
}
.leaflet-touch .leaflet-bar, .leaflet-bar { border: 1px solid ${colors.field}; border-radius: 12px; overflow: hidden; }
`;

const ensureLeafletCss = () => {
  if (typeof document === "undefined" || document.getElementById("leaflet-css")) return;
  const style = document.createElement("style");
  style.id = "leaflet-css";
  style.textContent = leafletCss + EXTRA_CSS;
  document.head.appendChild(style);
};

// The pin is the score itself: a badge in the band colour with the number in
// white, so the map can be scanned without colour vision.
const pinIcon = (a) =>
  L.divIcon({
    className: "gg-pin-wrap",
    html: `<span class="gg-pin" style="background:${a.pin}">${a.score}</span>`,
    iconSize: [40, 28],
    iconAnchor: [20, 14],
  });

const firstLine = (address) => address.split("\n")[0];

export const Map = ({ navigation }) => {
  const [hybrid, setHybrid] = useState(false);
  const [showsUserLocation, setShowsUserLocation] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const { address } = useContext(LocationContext);
  const insets = useSafeAreaInsets();

  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layersRef = useRef({});
  const userMarkerRef = useRef(null);
  const isFocused = useIsFocused();

  // Build the map once.
  useEffect(() => {
    ensureLeafletCss();
    const map = L.map(containerRef.current, {
      zoomControl: false,
      zoomSnap: 0.25, // lets the map frame all attractions on a narrow phone screen
      scrollWheelZoom: false, // keeps the host page scrollable when embedded
    }).setView(START, START_ZOOM);

    L.control.zoom({ position: "topleft" }).addTo(map);

    map.createPane("labels");
    map.getPane("labels").style.zIndex = 450;
    map.getPane("labels").classList.add("gg-labels");

    const layers = Object.fromEntries(Object.entries(TILES).map(([k, t]) => [k, L.tileLayer(t.url, t.options)]));
    layers.standard.addTo(map);
    layersRef.current = layers;

    ATTRACTIONS.forEach((a) => {
      const band = bandFor(a.score);
      const marker = L.marker([a.coordinates.latitude, a.coordinates.longitude], {
        icon: pinIcon(a),
        keyboard: true,
        title: a.name,
        // Where pins overlap in the city centre, the rarer amber and red pins
        // sit on top. There are nine greens, so one hidden green says less
        // than a hidden Tivoli.
        zIndexOffset: (100 - a.score) * 10,
      })
        .on("click", () => setSelected(a))
        .addTo(map);
      const el = marker.getElement();
      el.setAttribute("aria-label", `${a.name}, eco score ${a.score}, ${band.label.toLowerCase()}`);
      // Leaflet makes pins tab stops with role="button" but ignores Enter and
      // Space, so keyboard users could reach a pin and not open it.
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setSelected(a);
        }
      });
    });

    mapRef.current = map;

    // Frame all attractions, clear of the controls above and the legend below.
    const bounds = L.latLngBounds(ATTRACTIONS.map((a) => [a.coordinates.latitude, a.coordinates.longitude]));
    const fit = () => map.fitBounds(bounds, { paddingTopLeft: [24, 72], paddingBottomRight: [24, 120], maxZoom: 14 });
    fit();

    const resize = () => map.invalidateSize();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    if (observer) observer.observe(containerRef.current);
    // The container can have no size yet on the first pass, so fit again once
    // the layout has settled.
    const t = setTimeout(() => {
      resize();
      fit();
    }, 0);

    return () => {
      clearTimeout(t);
      if (observer) observer.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Tab screens are hidden while inactive; resize once the map is shown again.
  useEffect(() => {
    if (isFocused && mapRef.current) setTimeout(() => mapRef.current && mapRef.current.invalidateSize(), 0);
  }, [isFocused]);

  // Standard map, or satellite with place labels.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const { standard, imagery, labels } = layersRef.current;
    if (hybrid) {
      map.removeLayer(standard);
      imagery.addTo(map);
      labels.addTo(map);
    } else {
      map.removeLayer(imagery);
      map.removeLayer(labels);
      standard.addTo(map);
    }
  }, [hybrid]);

  // Show or hide the visitor's own position. Location is only requested here,
  // when the visitor asks for it, never on page load.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!showsUserLocation) {
      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
      return;
    }
    let cancelled = false;
    setToast("Finding your location…");
    requestLocationOnce()
      .then((position) => {
        if (cancelled) return;
        const here = [position.coords.latitude, position.coords.longitude];
        userMarkerRef.current = L.circleMarker(here, {
          radius: 8, color: colors.surface, weight: 3, fillColor: colors.ink, fillOpacity: 1,
        }).addTo(map);
        map.setView(here, Math.max(map.getZoom(), 14));
      })
      .catch(() => {
        if (cancelled) return;
        setShowsUserLocation(false);
        setToast("Location is off. Allow location access in your browser to see yourself on the map.");
      });
    return () => {
      cancelled = true;
    };
  }, [showsUserLocation]);

  // The 2023 "Your Location" button opened a modal with the address. The
  // address now arrives as a short message once the position is shown.
  useEffect(() => {
    if (showsUserLocation && address && address !== "N/A") setToast(`You're near ${firstLine(address)}`);
  }, [address, showsUserLocation]);

  const logVisit = (a) => {
    setSelected(null);
    navigation.navigate("Add", { screen: "Add", params: { attractionId: a.id } });
  };

  return (
    <View style={styles.screen}>
      {React.createElement("div", {
        ref: containerRef,
        role: "region",
        "aria-label": "Map of attractions in Copenhagen by eco score",
        style: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, zIndex: 0 },
      })}

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
  controls: { position: "absolute", right: space.lg, zIndex: 1 },
  controlGap: { marginTop: space.sm },
  // Sits above Leaflet's attribution line, which stays visible underneath.
  bottom: { position: "absolute", left: space.lg, right: space.lg, bottom: space.xl, zIndex: 1 },
  toast: { marginBottom: space.sm },
});
