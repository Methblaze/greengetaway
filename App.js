import React from "react";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
} from "@expo-google-fonts/dm-sans";

import { AuthenticationContextProvider } from "./src/services/authentication/authentication.context";
import { Navigation } from "./src/infrastructure/navigation";
import { CameraContextProvider } from "./src/services/camera/camera.context";
import { LocationContextProvider } from "./src/services/location/location.context";
import { SharedStateProvider } from "./src/infrastructure/navigation/SharedStateProvider";


export default function App() {
  const [fontsLoaded] = useFonts({ DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold });

  // Hold the first frame until DM Sans is ready, so text never jumps from the
  // system font to DM Sans after it has rendered.
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <SharedStateProvider>
        <CameraContextProvider>
          <LocationContextProvider>
            <AuthenticationContextProvider>
              <Navigation />
            </AuthenticationContextProvider>
          </LocationContextProvider>
          </CameraContextProvider>
        </SharedStateProvider>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
