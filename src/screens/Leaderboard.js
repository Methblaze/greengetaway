import React, {useState} from "react";
import { StyleSheet, View, Image, Pressable, Alert, FlatList, Text, Modal } from "react-native";
import LeaderboardAtrraction from "../components/leaderboard.component";
import { BlurView } from 'expo-blur';
import AttractionDetail from "../components/attractionDetail.component";


export const Leaderboard = () => {
  const [attractionList, setattractionList] = useState([
    { id: '1', name: 'Kastellet', score: 99, address: "Gl. Hovedvagt, Kastellet 1, 2100 København", image1: "https://media.lex.dk/media/148200/standard_compressed_scanpixId20200618-192745-4", image2:"https://media.lex.dk/media/148200/standard_compressed_scanpixId20200618-192745-4" },
    { id: '2', name: 'Søerne', score: 99, address: "Øster Søgade, 1357 København", image1: "https://2.bp.blogspot.com/-shMUZ2HD4KE/Tx_hl0KfwkI/AAAAAAAAAR4/svYxIDciARA/s1600/IMG_0897.JPG", image2:"https://media-cdn.tripadvisor.com/media/photo-s/05/bf/34/72/amager-faelled.jpg"},
    { id: '3', name: 'Bibliotekshaven', score: 98, address: "Proviantpassagen 1, 1218 København", image1: "https://files.guidedanmark.org/files/382/153466__MG_5033.jpg", image2:"https://migogkbh.dk/wp-content/uploads/2020/08/Bibliotekshaven.jpg"},
    { id: '4', name: 'Amager Fællede', score: 98, address: "Artillerivej 73B, 2300 København", image1: "https://naturibyen.com/wp-content/uploads/2017/06/Koebenhavn_S_20120808_TH_0049_web.jpg", image2:"https://media-cdn.tripadvisor.com/media/photo-s/05/bf/34/72/amager-faelled.jpg"},
    { id: '5', name: 'Havnestads Havnepark', score: 95, address: "Islands Brygge 22, 2300 København", image1: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Islandsbrygge_waterfront.jpg", image2: "http://www.christianshavnernet.dk/Christianshavn/Bryggen/Islands_brygge/IMG_3910.jpg"},
    { id: '6', name: 'Fælledparken', score: 94, address: "Trianglen, 2100 København", image1: "https://www.kk.dk/sites/default/files/styles/hero_desktop/public/2021-05/F%C3%A6lledparken%201920x552.jpg?itok=nhfv49eP", image2: "https://graenseforeningen.dk/sites/graenseforeningen.dk/files/styles/article_width_680/public/2021-08/F%C3%A6lledparken.nu_.jpg?itok=sSZx9ihY"},
    { id: '7', name: 'The Little Mermaid', score: 93, address: "Langelinie, 2100 København Ø", image1: "https://usercontent.one/wp/www.rundtidanmark.dk/wp-content/uploads/2021/06/KMO_9949.jpg", image2: "https://a.cdn-hotels.com/gdcs/production103/d1630/806328d2-1333-4996-a51b-39d34be73bee.jpg"},
    { id: '8', name: 'Vor Frue Kirke', score: 93, address: "Nørregade 8, 1165 København", image1: "https://media.lex.dk/media/148242/standard_scanpixId20190412-115426-4", image2: "https://media.lex.dk/media/148240/standard_compressed_scanpixId20200612-093400-2" },
    { id: '9', name: 'Frederiks Kirke', score: 93, address: "Frederiksgade 4, 1265 København", image1: "https://a.cdn-hotels.com/gdcs/production179/d681/f13169e0-f7ac-4607-ad20-45c02f4ed486.jpg?impolicy=fcrop&w=800&h=533&q=medium", image2: "https://a.cdn-hotels.com/gdcs/production7/d60/ac6ebd76-fb78-4879-af62-9e7e7c9dfe4a.jpg"},
  ]);
  const [visible, setVisible] = React.useState(false);
  const [selectedPointOfInterest, setSelectedPointOfInterest] = useState(null);

  const seeDetails = (item) => {
    setSelectedPointOfInterest(item);
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setSelectedPointOfInterest(null);
  };

  return (
    
    <View style={styles.container}>
      {selectedPointOfInterest && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            closeModal();
          }}>
          <BlurView intensity={4} style={styles.centeredView}>
            <View style={styles.modalView}>
              <AttractionDetail
                name={selectedPointOfInterest.name}
                score={selectedPointOfInterest.score}
                address={selectedPointOfInterest.address}
                image1={selectedPointOfInterest.image1}
                image2={selectedPointOfInterest.image2}
                goBack={closeModal}
              />
            </View>
          </BlurView>
        </Modal>
      )}
      <Text style={styles.header}>The most green activities you can do in the city</Text>
      <FlatList
            data={attractionList}
            renderItem = {({item}) => (
              <LeaderboardAtrraction
                id={item.id}
                name={item.name}
                score={item.score}
                seeDetails={() => seeDetails(item)}
              />
            )}
            keyExtractor={item => item.id}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebe2d9", // Updated background color
  },

  header: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
    fontWeight: '500'
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
 
});
