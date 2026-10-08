import React from "react";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";

import { AuthenticationContextProvider } from "./src/services/authentication/authentication.context";
import { Navigation } from "./src/infrastructure/navigation";
import { CameraContextProvider } from "./src/services/camera/camera.context";
import { LocationContextProvider } from "./src/services/location/location.context";
import { VisitsContextProvider } from "./src/services/visits/visits.context";
import { ToastProvider } from "./src/services/toast/toast.context";
import { AppFrame } from "./src/components/AppFrame";


// The three weights the app uses, required by file. The package's own index
// requires all 18 DM Sans files, and Metro would copy every one into the build.
const FONTS = {
  DMSans_400Regular: require("@expo-google-fonts/dm-sans/400Regular/DMSans_400Regular.ttf"),
  DMSans_500Medium: require("@expo-google-fonts/dm-sans/500Medium/DMSans_500Medium.ttf"),
  DMSans_600SemiBold: require("@expo-google-fonts/dm-sans/600SemiBold/DMSans_600SemiBold.ttf"),
};

export default function App() {
  const [fontsLoaded] = useFonts(FONTS);

  // Hold the first frame until DM Sans is ready, so text never jumps from the
  // system font to DM Sans after it has rendered.
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AppFrame>
        <CameraContextProvider>
          <LocationContextProvider>
            <AuthenticationContextProvider>
              <VisitsContextProvider>
                <ToastProvider>
                  <Navigation />
                </ToastProvider>
              </VisitsContextProvider>
            </AuthenticationContextProvider>
          </LocationContextProvider>
        </CameraContextProvider>
      </AppFrame>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
