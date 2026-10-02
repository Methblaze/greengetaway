import React, { useState, useContext } from "react";

import { StyleSheet, Pressable, FlatList, ScrollView, Platform, Image, View, Text } from "react-native";
import { TouchableOpacity, GestureHandlerRootView } from "react-native-gesture-handler";
import DateTimePacker from "../components/datePicker";
import { TextInput } from "react-native-paper";
import GoToButton from "../components/goToButton.component";
import { CameraContext, CameraContextProvider } from "../services/camera/camera.context";
import { SharedState } from "../infrastructure/navigation/SharedStateProvider";
import PhotoList from "../components/photolist.component";

export const Add = ({ navigation }) => {
  const { attractionText, setAttractionTextAndDate, date} = SharedState();
  // const [date, setDate] = useState(new Date());
  const [showDatePicker, setDatePicker] = useState(false);
  const [dateInput, setDateInput] = useState('');
  
  const { photoList } = useContext(CameraContext);
  
  const handleAttractionText = (text) => {
    setAttractionTextAndDate(text, date);
  };

  {/* show visibility */}
  const toggleDatePicker = () => {
    setDatePicker(!showDatePicker);
  };

  const onChange = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || date;
      setDateInput(currentDate.toDateString());
      setDatePicker(Platform.OS === "ios"); // Close the date picker on iOS

      // Assuming setAttractionTextAndDate is a function that updates both text and date
      setAttractionTextAndDate(attractionText, currentDate);
    } else if (event.type === "dismissed") {
      setDatePicker(false); // Close the date picker on Android
    }
  };

  const confirmIOSDate= () => {
    setDateInput(date.toDateString());
    toggleDatePicker();
  };

  const showDateSpinner = () => {
    if (showDatePicker) {
      return (
      Platform.OS === "ios" ? (
        <DateTimePacker
          style={style.dateSpinner}
          mode="date"
          display="spinner"
          value={date}
          onChange={onChange}
          placeholderTextColor="#11182744"
        />
      ) : (
        <DateTimePacker
          style={style.dateSpinner}
          mode="date"
          display="spinner"
          value={date}
          onChange={onChange}
          placeholderTextColor="#11182744"
        />
      )
    );
  };
  }

  const handleDatePickerPress = () => {
    setDatePicker(true);
  }

  const goTo = () => {
    navigation.navigate("Camera")
  }
  
  return (
    <>
      <GestureHandlerRootView style={{backgroundColor: "#ebe2d9", flex: 1}}>
      <ScrollView>
      <View>
      {/* Naming attraction */}
      <Text style={style.Atext}>Attraction</Text>
      <TextInput style={style.Ainput}
        placeholder="Name of attraction"
        onChangeText={handleAttractionText}
        value={attractionText}
      />

      {/* Naming date of the visited attraction */}
      <Text style={style.Dtext}>Date</Text>

      <Pressable onPress={toggleDatePicker} style={style.datePickerContainer}>
          <View style={{flexDirection: "row", alignItems: "center"}}> 
            <TextInput
            style={style.dateInput}
            value={dateInput}
            placeholder="Date you visited the attraction"
            onChangeText={setDateInput}
            editable={false}
            onTouchStart={handleDatePickerPress} />

          </View>
          {showDateSpinner()}
        </Pressable>
    


      {/* Cancel and Confirm button */}
      {showDatePicker && Platform.OS === "ios" && (
        <View style={styleButton.buttonContainer}>
          
          {/* Cancel button */}
          <TouchableOpacity 
            style={[styleButton.cancelButton, styleButton.pickerButton]} 
            onPress={toggleDatePicker}>
            <Text style={styleButton.buttonText}>Cancel</Text>
          </TouchableOpacity>

          {/* Confirm button */}
          <TouchableOpacity 
            style={[styleButton.confirmButton]} 
            onPress={confirmIOSDate}>
            <Text style={styleButton.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>

      )}

      <Text style={style.Dtext}>Add a photo</Text>
      <CameraContextProvider>
        <View style={styleButton.photoButton}>
          <GoToButton text={"Take a picture"} goTo={() => goTo()} buttonWidth={250} buttonHeight={50} />
        </View>

      </CameraContextProvider>
      
      {/* Display the taken photo */}
      <FlatList
        numColumns={2}
        data={[photoList[photoList.length - 1]]}
        renderItem={({ item }) => (
        <View style={style.photoContainer}>
          {item && item.uri && <Image source={{ uri: item.uri }} style={style.photo} />}
        </View>
      )}
      keyExtractor={(item) => (item ? item.uri.toString() : null)}
      contentContainerStyle={style.photoListStyle}
    />
    </View>
    </ScrollView>
    </GestureHandlerRootView>
    </>
  );
};


const styleButton = StyleSheet.create({
  photoButton: {
    marginBottom: 20,
    marginLeft: 30,
    marginTop: -20,
  },
  cancelButton: {
    fontSize: 17, 
    color: "#688A6F",
  },
  pickerButton: {
    backgroundColor: 'grey',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: -15,
    marginBottom: 50,
  },

  buttonText: {
    fontSize: 17,
    color: "#fff",
  },

  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  }
});


const style = StyleSheet.create({
  Atext: {
    fontSize: 17, 
    color: "#688A6F",
    fontWeight: "700", 
    marginTop: 50, 
    marginBottom: 50,
    marginLeft: 30,
  },
  Dtext: {
    fontSize: 17, 
    color: "#688A6F",
    fontWeight: "700", 
    marginTop: 50, 
    marginBottom: 50,
    marginLeft: 30,
  },
  Ainput: {
    fontSize: 15,
    height:50,
    width:300,
    marginTop: -40,
    marginLeft: 30,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "grey",
  },
  datePickerContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  dateInput: {
    fontSize: 15,
    height:50,
    width:300,
    marginTop: -40,
    marginLeft: 30,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "grey",
    placeholderTextColor: "#11182744"
  },
  
  dateSpinner: {
    height: 120,
    marginTop: -10,
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
});
