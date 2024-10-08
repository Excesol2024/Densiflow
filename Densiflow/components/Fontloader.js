import React, { useEffect, useCallback } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const FontLoader = ({ children }) => {
  const [fontsLoaded] = useFonts({
    PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    PoppinsExtra: require('../assets/fonts/Poppins-ExtraBold.ttf'),
    PoppinsThin: require('../assets/fonts/Poppins-Light.ttf'),
  });

  useEffect(() => {
    // Prevent auto-hide of splash screen
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      // Hide the splash screen once fonts are loaded
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // While fonts are loading, keep the splash screen visible
  }

  return <>{children}</>;  // Render children once fonts are loaded
};

export default FontLoader;
