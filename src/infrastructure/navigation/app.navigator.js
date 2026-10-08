import React from "react";
import { Text, View, Platform } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

import { colors, fonts, shadow } from "../../theme/tokens";

import { HomeScreen } from "../../screens/HomeScreen";
import { Map } from "../../screens/map/Map";
import { Leaderboard } from "../../screens/Leaderboard";
import { ProfileScreen } from "../../screens/ProfileScreen";
import { Add } from "../../screens/Add";
import { CameraScreen } from "../../screens/camera/camera.screen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AddStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Add" component={Add} />
    <Stack.Screen name="Camera" component={CameraScreen} />
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

// Visible tab labels, where they differ from the route name.
const TAB_LABEL = {
  Add: "Log visit",
  Leaderboard: "Ranking",
};

const tabBarIcon = (iconName) => ({ focused, size, color }) => (
  <Ionicons name={focused ? iconName : `${iconName}-outline`} size={size} color={color} />
);

// Each screen carries its own title. In 2023 every header repeated the tab
// name and showed a blue Logout link, so a session-ending action sat on every
// screen. Logout now lives on Profile.
const createScreenOptions = ({ route }) => {
  const label = TAB_LABEL[route.name] || route.name;
  const iconName = TAB_ICON[route.name];
  return {
    headerShown: false,
    tabBarIcon: iconName ? tabBarIcon(iconName) : undefined,
    // React Navigation switches to labels beside icons once the window is
    // 768 wide or more, which happens in a desktop browser. This is a phone
    // layout at every width, so labels always sit below the icons.
    tabBarLabelPosition: "below-icon",
    // Tab labels: muted is 6.0:1 and primary 6.6:1 on the white bar.
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
      <Text style={{ fontSize: 12, lineHeight: 16, fontFamily: focused ? fonts.semibold : fonts.regular, color }}>{label}</Text>
    ),
    tabBarAccessibilityLabel: label,
  };
};

// Primary green with a white plus: 6.6:1, where the 2023 pink and white was
// 1.58:1.
const AddButton = () => (
  <View
    style={{
      width: 52,
      height: 52,
      backgroundColor: colors.primary,
      borderRadius: 26,
      borderWidth: 4,
      borderColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: Platform.OS == "android" ? 40 : 24,
    }}
  >
    <Feather name="plus" size={26} color={colors.onPrimary} />
  </View>
);

export const AppNavigator = () => (
  <Tab.Navigator screenOptions={createScreenOptions}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Map" component={Map} />
    <Tab.Screen name="Add" component={AddStack} options={{ tabBarIcon: AddButton, tabBarAccessibilityLabel: "Log a visit" }} />
    <Tab.Screen name="Leaderboard" component={Leaderboard} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);
