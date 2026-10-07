import React, { useContext } from "react";
import { Text, TouchableOpacity, View, Platform } from "react-native";
import { Feather, Ionicons   } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';


import { AuthenticationContext } from "../../services/authentication/authentication.context";
import { colors, fonts, shadow } from "../../theme/tokens";

import { HomeScreen } from "../../screens/HomeScreen";
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

// Filled icon when active, outline otherwise, so the active tab is marked by
// shape as well as colour.
const TAB_ICON = {
  Home: "home",
  Map: "map",
  Leaderboard: "trophy",
  Profile: "person",
};

const tabBarIcon = (iconName) => ({ focused, size, color }) => (
  <Ionicons name={focused ? iconName : `${iconName}-outline`} size={size} color={color} />
);

const createScreenOptions = ({ route }) => {
  const iconName = TAB_ICON[route.name];
  const { onLogout } = useContext(AuthenticationContext);

  return {
    headerShown: true,
    tabBarIcon: iconName ? tabBarIcon(iconName) : undefined,
    // Tab labels: muted is 6.0:1 and primary 6.6:1 on the white bar.
    // React Navigation switches to labels beside icons once the window is
    // 768 wide or more, which happens in a desktop browser. This is a phone
    // layout at every width, so labels always sit below the icons.
    tabBarLabelPosition: "below-icon",
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.muted,
    tabBarStyle: {
      backgroundColor: colors.surface,
      borderTopColor: colors.line,
      height: Platform.OS === "web" ? 64 : undefined,
      paddingTop: 6,
      paddingBottom: Platform.OS === "web" ? 8 : undefined,
      ...shadow,
    },
    tabBarLabel: ({ focused, color }) => (
      <Text style={{ fontSize: 12, lineHeight: 16, fontFamily: focused ? fonts.semibold : fonts.regular, color }}>
        {route.name}
      </Text>
    ),
    // 2023 header, kept on the screens that have not been redesigned yet.
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
    <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
    {/* Full-bleed map: no header repeating the tab name, controls float. */}
    <Tab.Screen name="Map" component={Map} options={{ headerShown: false }} />
    <Tab.Screen name="Add" component={AddStack} options={{
      tabBarAccessibilityLabel: "Add",
      tabBarIcon: () => (
        // Primary green with a white plus: 6.6:1, where the 2023 pink and
        // white was 1.58:1.
        <View style={{
          width: 52,
          height: 52,
          backgroundColor: colors.primary,
          borderRadius: 26,
          borderWidth: 4,
          borderColor: colors.surface,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: Platform.OS == "android" ? 40 : 24
        }}>
          <Feather name="plus" size={26} color={colors.onPrimary} />
        </View>
      )
    }} />
    <Tab.Screen name="Leaderboard" component={Leaderboard}/>
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);
