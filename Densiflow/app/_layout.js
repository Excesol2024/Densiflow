import { Stack } from 'expo-router';
import { AuthenticatedProvider } from '../context/Authenticateduser';
import FontLoader from '../components/Fontloader';
import { SafeAreaView } from 'react-native';


const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="splashscreen" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 
      <Stack.Screen name="(getstarted)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="(profile)" options={{ headerShown: false }} /> */}
    </Stack>
  );
};

const RootLayout = () => {
  return <AuthenticatedProvider>
    <FontLoader>
    <SafeAreaView style={{ flex: 1 }}>
          <StackLayout />
        </SafeAreaView>
    </FontLoader>
  </AuthenticatedProvider>;
};

export default RootLayout;
