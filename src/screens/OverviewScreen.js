import {React} from "react";
import {
  StyleSheet,
  View,
  Image
} from "react-native";
import { Text } from "react-native-paper";
import GoToButton from "../components/goToButton.component";

export const Overview = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Image
          source={require('../../assets/Logo.png')}
          style={{width: 100, height: 100, margin: 30}}
        />
      <Text style={styles.header}>Green Getaway</Text>
      <Text style={styles.text}>Discover eco-friendly destinations and travel responsibly with our Sustainable Travel and Tourism Guide app. 
        Explore a curated selection of environmentally-conscious travel options and eco-friendly activities.
        Make informed choices that minimize your carbon footprint while having memorable, sustainable adventures around the world.
      </Text>
      <View style={styles.container2}>
      <GoToButton text={"Find attractions"} goTo={() => navigation.navigate('Map')} buttonWidth={250} buttonHeight={50}/>
      </View>
    </View>
    
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ebe2d9",
    alignItems: "center",
    justifyContent: 'center',
    
  },

  container2:{
    marginBottom: 50
  },

  header:{
    fontSize: 30,
  },

  text:{
     margin: 30,
     fontSize: 17,
     textAlign: 'center'
  },

});