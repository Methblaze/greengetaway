import {React, useContext} from "react";
import { StyleSheet, View, Image} from "react-native";
import { Text } from "react-native-paper";
import Divider from '../components/divider.component';
import { SharedState } from "../infrastructure/navigation/SharedStateProvider";
import PhotoList from "../components/photolist.component";


export const ProfileScreen = () => {
  const { attractionText, date } = SharedState();


  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Image
          source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/HCA_by_Thora_Hallager_1869.jpg/197px-HCA_by_Thora_Hallager_1869.jpg" }} // Replace with the actual URI
          style={styles.profilePicture}
        />
        <View style={styles.outlinedHeader}>
          <Text style={styles.descriptionText}>
          Hello! My name is Hans Christian, I love to write fairytales! Also  have a thing for sea-creatures.
          </Text> 
        </View>
      </View>
  
      <Divider thickness={3}/>
  
      <Text style={styles.visitedAttractionsText}> Your taken Photos</Text>
        {attractionText && date && (
          <>
            <Text style={styles.text}>Attraction: {attractionText}</Text>
            <Text style={styles.text}>Date you visited: {date.toDateString()}</Text>
          </>
        )}
        <PhotoList/>

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebe2d9",
  },

  header: {
    flexDirection: "row",
    padding: 10,
  },

  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10,
  },
  
  outlinedHeader: {
    flex: 1,
  },

  descriptionText: {
    marginBottom: 10,
  },

  ecoLevelText: {
    marginRight: 5,
  },
  
  visitedAttractionsText: {
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 30,
    fontSize: 17,
    color: "#000000", 
    fontWeight: 600
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
  photoListStyle: {
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  photoContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  photo: {
      height: 250,
      width: 150,
      marginBottom: 50,
        
  },

  text:{
    fontSize: 15,
    marginLeft: 10,
    marginBottom: 10

  }
});