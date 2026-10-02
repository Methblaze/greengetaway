// Web build only (Metro picks this file over Map.js when bundling for the
// browser). react-native-maps has no browser implementation, so the same map
// screen is rebuilt on Leaflet: same attractions, same pins, same detail card,
// same layer and location buttons. iOS and Android keep using Map.js.
import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, View, Modal, Text, Pressable } from "react-native";
import { PaperProvider, FAB, Snackbar } from "react-native-paper";
import { BlurView } from "expo-blur";
import { Asset } from "expo-asset";
import { useIsFocused } from "@react-navigation/native";
import L from "leaflet";

import leafletCss from "../../web/leafletCss";
import AttractionDetail from "../../components/attractionDetail.component";
import { LocationContext } from "../../services/location/location.context";
import { requestLocationOnce } from "../../services/location/location.service";

const PINS = {
  green: require("../../../assets/Green_Pin.png"),
  yellow: require("../../../assets/Yellow_Pin.png"),
  red: require("../../../assets/Red_Pin.png"),
};

// Mirrors the list in Map.js, so the web map shows exactly the same places.
const POINTS_OF_INTEREST = [
  { pin: "green", coordinates: { latitude: 55.69269516489231, longitude: 12.594401456560474 }, name: "Kastellet", score: 99, address: "Gl. Hovedvagt, Kastellet 1, 2100 København", image1: "https://media.lex.dk/media/148200/standard_compressed_scanpixId20200618-192745-4", image2: "https://media.lex.dk/media/148200/standard_compressed_scanpixId20200618-192745-4" },
  { pin: "green", coordinates: { latitude: 55.65346745093697, longitude: 12.577147786658136 }, name: "Amager Fælled", score: 98, address: "Artillerivej 73B, 2300 København", image1: "https://naturibyen.com/wp-content/uploads/2017/06/Koebenhavn_S_20120808_TH_0049_web.jpg", image2: "https://media-cdn.tripadvisor.com/media/photo-s/05/bf/34/72/amager-faelled.jpg" },
  { pin: "green", coordinates: { latitude: 55.68932350079579, longitude: 12.567072701450753 }, name: "Søerne", score: 99, address: "Øster Søgade, 1357 København", image1: "https://2.bp.blogspot.com/-shMUZ2HD4KE/Tx_hl0KfwkI/AAAAAAAAAR4/svYxIDciARA/s1600/IMG_0897.JPG", image2: "https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX35258857.jpg" },
  { pin: "green", coordinates: { latitude: 55.67479738955379, longitude: 12.581137072338239 }, name: "Bibliotekshaven", score: 98, address: "Proviantpassagen 1, 1218 København", image1: "https://files.guidedanmark.org/files/382/153466__MG_5033.jpg", image2: "https://migogkbh.dk/wp-content/uploads/2020/08/Bibliotekshaven.jpg" },
  { pin: "green", coordinates: { latitude: 55.665404205576166, longitude: 12.573790195349881 }, name: "Havnestads Havnepark (Bryggen)", score: 95, address: "Islands Brygge 22, 2300 København", image1: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Islandsbrygge_waterfront.jpg", image2: "http://www.christianshavnernet.dk/Christianshavn/Bryggen/Islands_brygge/IMG_3910.jpg" },
  { pin: "green", coordinates: { latitude: 55.702300779373026, longitude: 12.567884842266832 }, name: "Fælledparken", score: 94, address: "Trianglen, 2100 København", image1: "https://www.kk.dk/sites/default/files/styles/hero_desktop/public/2021-05/F%C3%A6lledparken%201920x552.jpg?itok=nhfv49eP", image2: "https://graenseforeningen.dk/sites/graenseforeningen.dk/files/styles/article_width_680/public/2021-08/F%C3%A6lledparken.nu_.jpg?itok=sSZx9ihY" },
  { pin: "green", coordinates: { latitude: 55.69295792626929, longitude: 12.59920029526256 }, name: "The Little Mermaid", score: 93, address: "Langelinie, 2100 København Ø", image1: "https://usercontent.one/wp/www.rundtidanmark.dk/wp-content/uploads/2021/06/KMO_9949.jpg", image2: "https://a.cdn-hotels.com/gdcs/production103/d1630/806328d2-1333-4996-a51b-39d34be73bee.jpg" },
  { pin: "green", coordinates: { latitude: 55.685138307213016, longitude: 12.589543670252091 }, name: "Vor Frue Kirke", score: 93, address: "Nørregade 8, 1165 København", image1: "https://media.lex.dk/media/148242/standard_scanpixId20190412-115426-4", image2: "https://media.lex.dk/media/148240/standard_compressed_scanpixId20200612-093400-2" },
  { pin: "green", coordinates: { latitude: 55.67937896150321, longitude: 12.572147968274647 }, name: "Frederiks Kirke (Marmorkirken)", score: 93, address: "Frederiksgade 4, 1265 København", image1: "https://a.cdn-hotels.com/gdcs/production179/d681/f13169e0-f7ac-4607-ad20-45c02f4ed486.jpg?impolicy=fcrop&w=800&h=533&q=medium", image2: "https://a.cdn-hotels.com/gdcs/production7/d60/ac6ebd76-fb78-4879-af62-9e7e7c9dfe4a.jpg" },
  { pin: "yellow", coordinates: { latitude: 55.67253027778619, longitude: 12.521315181767763 }, name: "Zoologisk Have København", score: 55, address: "Roskildevej 32, 2000 Frederiksberg", image1: "https://www.sciencestories.dk/sites/default/files/styles/large/public/2020-06/Zoo%20test_0.jpg?h=5c7d85c7&itok=IOQvi9CF", image2: "https://cdn.lorry.bazo.dk/images/eca5231d-2e72-4c9d-a1ff-83eb9025621a/d/4-3/s/2048" },
  { pin: "yellow", coordinates: { latitude: 55.67457812197257, longitude: 12.574676383616369 }, name: "National Museum of Denmark", score: 50, address: "Ny Vestergade 10, 1471 København K", image1: "https://media.lex.dk/media/4497/standard_Nationalmuseet.jpg", image2: "https://files.guidedanmark.org/files/382/172945_Nationalmuseet.jpg" },
  { pin: "red", coordinates: { latitude: 55.6738352545145, longitude: 12.568286556922459 }, name: "Tivoli", score: 15, address: "Vesterbrogade 3, 1630 København V", image1: "https://files.guidedanmark.org/files/382/382_8363.jpg", image2: "https://cdn.getyourguide.com/img/tour/deb003da0074a486.jpeg/99.jpg" },
  { pin: "red", coordinates: { latitude: 55.638610148608976, longitude: 12.655649397107624 }, name: "Den blå planet", score: 20, address: "Jacob Fortlingsvej 1, 2770 Kastrup", image1: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Den_Bl%C3%A5_Planet_%28Kastrup%29.JPG", image2: "https://denblaaplanet.dk/wp-content/uploads/2020/08/oceantunnel-scaled.jpg" },
];

// ITU, as in the native app's initial region.
const START = [55.6596, 12.591];
const START_ZOOM = 12;

const EXTRA_CSS = `
.leaflet-container { font: inherit; background: #e9e5dc; }
.leaflet-control-attribution { font-size: 9px; }
.gg-labels { pointer-events: none; }
`;

const ensureLeafletCss = () => {
  if (typeof document === "undefined" || document.getElementById("leaflet-css")) return;
  const style = document.createElement("style");
  style.id = "leaflet-css";
  style.textContent = leafletCss + EXTRA_CSS;
  document.head.appendChild(style);
};

const pinUrl = (key) => {
  const asset = Asset.fromModule(PINS[key]);
  return asset.uri;
};

export const Map = () => {
  const [mapType, setMapType] = useState("standard");
  const [showsUserLocation, setShowsUserLocation] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedPointOfInterest, setSelectedPointOfInterest] = useState(null);
  const { address } = useContext(LocationContext);
  const [isOpen, setIsOpen] = useState(false);
  const [locationProblem, setLocationProblem] = useState(null);
  const [snack, setSnack] = useState(null);

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

    L.control.zoom({ position: "bottomright" }).addTo(map);

    map.createPane("labels");
    map.getPane("labels").style.zIndex = 450;
    map.getPane("labels").classList.add("gg-labels");

    const standard = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        subdomains: "abcd",
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }
    );
    const imagery = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19, attribution: "Imagery &copy; Esri" }
    );
    const labels = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png",
      { subdomains: "abcd", maxZoom: 20, pane: "labels" }
    );
    standard.addTo(map);
    layersRef.current = { standard, imagery, labels };

    POINTS_OF_INTEREST.forEach((p) => {
      const icon = L.icon({ iconUrl: pinUrl(p.pin), iconSize: [30, 40], iconAnchor: [15, 40] });
      L.marker([p.coordinates.latitude, p.coordinates.longitude], { icon, title: p.name, alt: p.name })
        .on("click", () => {
          setSelectedPointOfInterest(p);
          setVisible(true);
        })
        .addTo(map);
    });

    mapRef.current = map;

    // Frame all attractions on load. Extra padding keeps pins clear of the
    // buttons at the top and the "Your Location" button at the bottom.
    const bounds = L.latLngBounds(
      POINTS_OF_INTEREST.map((p) => [p.coordinates.latitude, p.coordinates.longitude])
    );
    const fit = () =>
      map.fitBounds(bounds, { paddingTopLeft: [18, 70], paddingBottomRight: [18, 90], maxZoom: 14 });
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

  // Standard map or satellite with labels, the web stand-in for "hybrid".
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const { standard, imagery, labels } = layersRef.current;
    if (mapType === "hybrid") {
      map.removeLayer(standard);
      imagery.addTo(map);
      labels.addTo(map);
    } else {
      map.removeLayer(imagery);
      map.removeLayer(labels);
      standard.addTo(map);
    }
  }, [mapType]);

  // Show or hide the visitor's own position.
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
    requestLocationOnce()
      .then((position) => {
        if (cancelled) return;
        const here = [position.coords.latitude, position.coords.longitude];
        userMarkerRef.current = L.circleMarker(here, {
          radius: 8, color: "#ffffff", weight: 3, fillColor: "#2182BD", fillOpacity: 1,
        }).addTo(map);
        map.setView(here, Math.max(map.getZoom(), 14));
      })
      .catch(() => {
        if (cancelled) return;
        setShowsUserLocation(false);
        setSnack("Location is off. Allow location access in your browser to see yourself on the map.");
      });
    return () => {
      cancelled = true;
    };
  }, [showsUserLocation]);

  const closeAttractionModal = () => {
    setVisible(false);
    setSelectedPointOfInterest(null);
  };

  const handleLocationPress = () => {
    setLocationProblem(null);
    setIsOpen(true);
    if (address === "N/A") {
      requestLocationOnce().catch(() =>
        setLocationProblem("Allow location access in your browser to see where you are.")
      );
    }
  };

  const addressText =
    address !== "N/A" ? address : locationProblem || "Finding your location…";

  return (
    <PaperProvider>
      {selectedPointOfInterest && (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={closeAttractionModal}>
          <BlurView intensity={4} style={styles.centeredView}>
            <View style={styles.modalView}>
              <AttractionDetail
                name={selectedPointOfInterest.name}
                score={selectedPointOfInterest.score}
                address={selectedPointOfInterest.address}
                image1={selectedPointOfInterest.image1}
                image2={selectedPointOfInterest.image2}
                goBack={closeAttractionModal}
              />
            </View>
          </BlurView>
        </Modal>
      )}

      <View style={styles.mapView}>
        {React.createElement("div", {
          ref: containerRef,
          role: "region",
          "aria-label": "Map of sustainable attractions in Copenhagen",
          style: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, zIndex: 0 },
        })}
      </View>

      <FAB
        style={styles.layersButton}
        icon="layers"
        size="small"
        accessibilityLabel="Switch between map and satellite"
        onPress={() => setMapType(mapType === "hybrid" ? "standard" : "hybrid")}
      />
      <FAB
        style={styles.locationButton}
        icon="crosshairs-gps"
        size="small"
        accessibilityLabel="Show my location on the map"
        onPress={() => setShowsUserLocation(!showsUserLocation)}
      />
      <Pressable style={styles.coordinateButton} onPress={handleLocationPress}>
        <Text style={styles.text}>Your Location</Text>
      </Pressable>

      <Modal animationType="slide" transparent={true} visible={isOpen} onRequestClose={() => setIsOpen(false)}>
        <BlurView intensity={4} style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.addressText}>Your location:</Text>
            <Text style={styles.addressText}>{addressText}</Text>
            <Pressable style={styles.backButton} onPress={() => setIsOpen(false)}>
              <Text style={styles.text}>Go back</Text>
            </Pressable>
          </View>
        </BlurView>
      </Modal>

      <Snackbar visible={!!snack} onDismiss={() => setSnack(null)} duration={4500}>
        {snack || ""}
      </Snackbar>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  mapView: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#F5F1ED",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // Native positions this at a fixed 600px from the top for a phone screen;
  // in a browser the frame height varies, so it is anchored to the bottom.
  coordinateButton: {
    position: "absolute",
    width: 150,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#688A6F",
    bottom: 28,
    left: "50%",
    marginLeft: -75,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  addressText: {
    fontSize: 20,
  },
  backButton: {
    width: 150,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#688A6F",
    marginTop: 10,
  },
  layersButton: {
    position: "absolute",
    backgroundColor: "white",
    margin: 10,
    right: 10,
    marginTop: 10,
  },
  locationButton: {
    position: "absolute",
    backgroundColor: "white",
    margin: 10,
    right: 10,
    marginTop: 60,
  },
});
