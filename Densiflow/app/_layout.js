import { Stack } from 'expo-router';
import { AuthenticatedProvider } from '../context/Authenticateduser';
import FontLoader from '../components/Fontloader';
import { SafeAreaView } from 'react-native';
import Subscribed from './subscriptions/Subscribed';
import Lodingscreen from '../components/Modal';
import {  LoadingEffectsProvider } from '../context/Loadingeffect';
import { useContext } from 'react';
import Error from '../components/Error';

const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="splashscreen" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 
      <Stack.Screen name="(getstarted)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(profile)" options={{ headerShown: false }} />
      <Stack.Screen name={`places/Poppular`} options={{ headerShown: false }} />
      <Stack.Screen name={`places/Recommended`} options={{ headerShown: false }} />
    </Stack>
  );
};

const RootLayout = () => {



  return <AuthenticatedProvider>
 <LoadingEffectsProvider>
 <FontLoader>
    <SafeAreaView style={{ flex: 1 }}>
      {/* <Subscribed/> */}
      <Error/>
      <Lodingscreen/>
          <StackLayout />
        </SafeAreaView>
    </FontLoader>
 </LoadingEffectsProvider>
  </AuthenticatedProvider>;
};

export default RootLayout;
