import React, { useEffect, useState, useContext } from "react";
import {
  PaperProvider, FAB
} from "react-native-paper";

import {
  StyleSheet,
  View,
  Image,
  Modal,
  Alert,
  Text,
  Pressable
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { BlurView } from 'expo-blur';

import AttractionDetail from "../../components/attractionDetail.component";
import { LocationContext } from "../../services/location/location.context";

//Defining our own "type" called `pointOfInterest`.
class pointOfInterest {
  constructor(coordinates, image, name, score, address, image1, image2) {
    this.coordinates = coordinates; // Latitude and longitude.
    this.image = image; //Image source for the marker.
    this.name = name;
    this.score = score;
    this.address = address;
    this.image1 = image1;
    this.image2 = image2;
  }
}

export const Map = () => {
  const [mapType, setMapType] = useState("standard");
  const [showsUserLocation, setShowsUserLocation] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [selectedPointOfInterest, setSelectedPointOfInterest] = useState(null);
  const {address, location } = useContext(LocationContext);
  const [isOpen, setIsOpen] = useState(false);

  const greenPin = './../../../assets/Green_Pin.png'
  const yellowPin = './../../../assets/Yellow_Pin.png'
  const redPin = './../../../assets/Red_Pin.png'


  const pointsOfInterest = [
    //Green markers
    new pointOfInterest(
      { latitude: 55.69269516489231, longitude: 12.594401456560474},
      require(greenPin),
      "Kastellet",
      99,
      "Gl. Hovedvagt, Kastellet 1, 2100 København",
      "https://media.lex.dk/media/148200/standard_compressed_scanpixId20200618-192745-4",
      "https://media.lex.dk/media/148200/standard_compressed_scanpixId20200618-192745-4"
    ),
    new pointOfInterest(
      { latitude: 55.65346745093697, longitude: 12.577147786658136 },
      require(greenPin),
      "Amager Fælled",
      98,
      "Artillerivej 73B, 2300 København",
      "https://naturibyen.com/wp-content/uploads/2017/06/Koebenhavn_S_20120808_TH_0049_web.jpg",
      "https://media-cdn.tripadvisor.com/media/photo-s/05/bf/34/72/amager-faelled.jpg"
    ),
    
    new pointOfInterest(
      { latitude: 55.68932350079579, longitude: 12.567072701450753 },
      require(greenPin),
      "Søerne",
      99,
      "Øster Søgade, 1357 København",
      "https://2.bp.blogspot.com/-shMUZ2HD4KE/Tx_hl0KfwkI/AAAAAAAAAR4/svYxIDciARA/s1600/IMG_0897.JPG",
      "https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX35258857.jpg"
    ),
    
    new pointOfInterest(
      { latitude: 55.67479738955379, longitude: 12.581137072338239 },
      require(greenPin),
      "Bibliotekshaven",
      98,
      "Proviantpassagen 1, 1218 København",
      "https://files.guidedanmark.org/files/382/153466__MG_5033.jpg",
      "https://migogkbh.dk/wp-content/uploads/2020/08/Bibliotekshaven.jpg"
    ),
    
    new pointOfInterest(
      { latitude: 55.665404205576166, longitude: 12.573790195349881 },
      require(greenPin),
      "Havnestads Havnepark (Bryggen)",
      95,
      "Islands Brygge 22, 2300 København",
      "https://upload.wikimedia.org/wikipedia/commons/b/bd/Islandsbrygge_waterfront.jpg",
      "http://www.christianshavnernet.dk/Christianshavn/Bryggen/Islands_brygge/IMG_3910.jpg"
    ),
   
    new pointOfInterest(
      { latitude: 55.702300779373026, longitude: 12.567884842266832 },
      require(greenPin),
      "Fælledparken",
      94,
      "Trianglen, 2100 København",
      "https://www.kk.dk/sites/default/files/styles/hero_desktop/public/2021-05/F%C3%A6lledparken%201920x552.jpg?itok=nhfv49eP",
      "https://graenseforeningen.dk/sites/graenseforeningen.dk/files/styles/article_width_680/public/2021-08/F%C3%A6lledparken.nu_.jpg?itok=sSZx9ihY"
    ),
    
    new pointOfInterest(
      { latitude: 55.69295792626929, longitude: 12.59920029526256 },
      require(greenPin),
      "The Little Mermaid",
      93,
      "Langelinie, 2100 København Ø",
      "https://usercontent.one/wp/www.rundtidanmark.dk/wp-content/uploads/2021/06/KMO_9949.jpg",
      "https://a.cdn-hotels.com/gdcs/production103/d1630/806328d2-1333-4996-a51b-39d34be73bee.jpg"
    ),
 
    new pointOfInterest(
      { latitude: 55.685138307213016, longitude: 12.589543670252091 },
      require(greenPin),
      "Vor Frue Kirke",
      93,
      "Nørregade 8, 1165 København",
      "https://media.lex.dk/media/148242/standard_scanpixId20190412-115426-4",
      "https://media.lex.dk/media/148240/standard_compressed_scanpixId20200612-093400-2"
    ),

    new pointOfInterest(
      { latitude: 55.67937896150321, longitude: 12.572147968274647 },
      require(greenPin),
      "Frederiks Kirke (Marmorkirken)",
      93,
      "Frederiksgade 4, 1265 København",
      "https://a.cdn-hotels.com/gdcs/production179/d681/f13169e0-f7ac-4607-ad20-45c02f4ed486.jpg?impolicy=fcrop&w=800&h=533&q=medium",
      "https://a.cdn-hotels.com/gdcs/production7/d60/ac6ebd76-fb78-4879-af62-9e7e7c9dfe4a.jpg"
    ),

    //Yellow markers
    new pointOfInterest(
      { latitude: 55.67253027778619, longitude: 12.521315181767763 },
      require(yellowPin),
      "Zoologisk Have København",
      55,
      "Roskildevej 32, 2000 Frederiksberg",
      "https://www.sciencestories.dk/sites/default/files/styles/large/public/2020-06/Zoo%20test_0.jpg?h=5c7d85c7&itok=IOQvi9CF",
      "https://cdn.lorry.bazo.dk/images/eca5231d-2e72-4c9d-a1ff-83eb9025621a/d/4-3/s/2048"
    ),

    new pointOfInterest(
      { latitude: 55.67457812197257, longitude: 12.574676383616369},
      require(yellowPin),
      "National Museum of Denmark",
      50,
      "Ny Vestergade 10, 1471 København K",
      "https://media.lex.dk/media/4497/standard_Nationalmuseet.jpg",
      "https://files.guidedanmark.org/files/382/172945_Nationalmuseet.jpg"
    ),

    //Red markers
    new pointOfInterest(
      { latitude: 55.6738352545145, longitude: 12.568286556922459 },
      require(redPin),
      "Tivoli",
      15,
      "Vesterbrogade 3, 1630 København V",
      "https://files.guidedanmark.org/files/382/382_8363.jpg",
      "https://cdn.getyourguide.com/img/tour/deb003da0074a486.jpeg/99.jpg"
    ),

    new pointOfInterest(
      { latitude: 55.638610148608976, longitude: 12.655649397107624 },
      require(redPin),
      "Den blå planet",
      20,
      "Jacob Fortlingsvej 1, 2770 Kastrup",
      "https://upload.wikimedia.org/wikipedia/commons/b/ba/Den_Bl%C3%A5_Planet_%28Kastrup%29.JPG",
      "https://denblaaplanet.dk/wp-content/uploads/2020/08/oceantunnel-scaled.jpg"
    ), 
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }
    })();
  }, []);

  const handleMarkerPress = (pointOfInterest) => {
    setSelectedPointOfInterest(pointOfInterest);
    setVisible(true);
  };

  const handleLocationPress = () => {
    setIsOpen(true);
  };

  const closeAttractionModal = () => {
    setVisible(false);
    setSelectedPointOfInterest(null);
  };

  const closeLocationModal = () => {
    setIsOpen(false);
  };


  return (
    <PaperProvider>

{selectedPointOfInterest && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setVisible(!visible);
          }}>
          
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

      <MapView
        initialRegion={{
          // ITU's coordinates.
          latitude: 55.6596,
          longitude: 12.591,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={styles.mapView}
        mapType={mapType}
        showsUserLocation={showsUserLocation}
      >
        {pointsOfInterest.map((p, index) => (
          <Marker
            key={index}
            coordinate={p.coordinates}
            onPress={() => handleMarkerPress(p)}
          >
            <Image source={p.image} style={{ width: 30, height: 40, resizeMode: 'contain' }} />
          </Marker>
        ))}
      </MapView>
      <FAB
        style= {styles.layersButton}
        icon="layers"
        size="small"
        onPress={() => {
          setMapType(mapType === "hybrid" ? "standard" : "hybrid");
        }}
      />
      <FAB
        style= {styles.locationButton}
        icon="crosshairs-gps"
        size="small"
        onPress={() => {
          setShowsUserLocation(!showsUserLocation);
        }}
      />
      <Pressable style={styles.coordinateButton} onPress={() => handleLocationPress()}>
        <Text style={styles.text}>Your Location</Text>
      </Pressable>
      <Modal
          animationType="slide"
          transparent={true}
          visible={isOpen}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            closeLocationModal();
          }}>
            <BlurView intensity={4} style={styles.centeredView}>
              <View style={styles.modalView}>
              <Text style={styles.addressText}>Your location:</Text>
               <Text style={styles.addressText}>{address}</Text>
               <Pressable style={styles.backButton} onPress={() => closeLocationModal()}>
                  <Text style={styles.text}>Go back</Text>
                </Pressable>
              </View>
           </BlurView>
        </Modal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },

  mapView:{
    width: "100%",
    height: "100%"
  },
  modalView: {
    margin: 20,
    backgroundColor: '#F5F1ED',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  coordinateButton:{
    position: "absolute",
    width: 150,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#688A6F",
    marginTop: 600,
    left: 120
  },

  text:{
    color: "white",
    fontSize: 16,
    fontWeight: '600',
  },

  addressText: {
    fontSize: 20
  },

  backButton:{
    width: 150,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#688A6F",
    marginTop: 10
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
  }
});