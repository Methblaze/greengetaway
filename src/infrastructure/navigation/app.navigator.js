import React, { useContext } from "react";
import { Text, TouchableOpacity, View, Image, Platform } from "react-native";
import { Feather, Ionicons   } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';


import { AuthenticationContext } from "../../services/authentication/authentication.context";

import { Overview } from "../../screens/OverviewScreen";
import { Map } from "../../screens/map/Map";
import { Leaderboard } from "../../screens/Leaderboard";
import { ProfileScreen } from "../../screens/ProfileScreen";
import { Add }     from "../../screens/Add";
import { CameraScreen } from "../../screens/camera/camera.screen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AddStack = () => (
  <Stack.Navigator headerMode="none" >
    <Stack.Screen name="Add" component={Add}/>
    <Stack.Screen name="Camera" component={CameraScreen}/>
  </Stack.Navigator>
);

const TAB_ICON = {
  Overview: "eye-outline",
  Map: "map-outline",
  Leaderboard: "trophy-outline",
  Profile: "person-outline"
};

const tabBarIcon =(iconName) =>({ size, color }) =><Ionicons   name={iconName} size={size} color={color}/>;

const createScreenOptions = ({ route }) => {
  const iconName = TAB_ICON[route.name];
  const { onLogout } = useContext(AuthenticationContext);

  return {
    headerShown: true,
    tabBarIcon: tabBarIcon(iconName),
    tabBarActiveTintColor: "#688A6F",
    tabBarInactiveTintColor: "black",
    tabBarStyle: {
      backgroundColor: '#E9E9E9', // Set the background color of the bottom navigation bar
    },
    tabBarLabelStyle: {
      fontSize: 10, // Set the font size for the label
      fontWeight: route.state?.index === route.key ? 'bold' : 'normal', // Set font weight to bold when active
    },
    tabBarLabel: ({ focused, color }) => (
      <Text style={{ fontSize: 12, fontWeight: focused ? 'bold' : 'normal', color }}>
        {route.name}
      </Text>
    ),
    headerRight: () => (
      <TouchableOpacity onPress={onLogout} style={{ marginRight: 10 }}>
        <Text style={{ color: "#2182BD" }}>Logout</Text>
      </TouchableOpacity>
    ),
    headerStyle: {
      backgroundColor: '#ebe2d9', // Set the background color of the header
    
    },
    headerTintColor: '#688A6F', // Set the text color of the header buttons
    headerTitleStyle: {
      fontSize: 25, // Set the font size of the header title
    },
  };
};



export const AppNavigator = () => (
  <Tab.Navigator screenOptions={createScreenOptions}>
    <Tab.Screen name="Overview" component={Overview}/>
    <Tab.Screen name="Map" component={Map} />
    <Tab.Screen name="Add" component={AddStack} options={{
      tabBarIcon: ({ focused }) => (
        <View style={{
          width: 55,
          height: 55,
          backgroundColor: '#FFBAD7',
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: Platform.OS == "android" ? 50 : 30
        }}>
          <Feather name="plus" size={35} color="white" />
        </View>
      )
    }} />
    <Tab.Screen name="Leaderboard" component={Leaderboard}/>
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);