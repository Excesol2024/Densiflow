import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from "../components/Protected/Api"
import { useRouter } from 'expo-router';
import messaging from '@react-native-firebase/messaging';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export const AuthenticatedContext = createContext({
  isloggedIn: {
    authUser: false,
  },
  setIsloggedIn: () => {},
});

export const AuthenticatedProvider = ({ children }) => {
  const [isloggedIn, setIsloggedIn] = useState({
    authUser: false,
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [subscribed, setSubscribed] = useState(false);

  const [firebaseToken, setFirebaseToken] = useState('')
  const [expoPushToken, setExpoPushToken] = useState('');

  const handleLoggedInUser = async () => {
    const token = await AsyncStorage.getItem('Authorization');
    console.log("TOKEN", token);
   if(token){
    const dataresponse = await API.getCurrentUser();
    setCurrentUser(dataresponse.data)
      setIsloggedIn({
        authUser: true
      })
    console.log("CURRENT USER", dataresponse.data)
   } else {
    handleLogoutUser();
    return
   }
  };

  useEffect(() => {
    handleLoggedInUser();
  }, []);

  useEffect(() => {
    if (!loading) {
      console.log('Updated Auth State:', isloggedIn);
    }
  }, [isloggedIn, loading]);

  const handleLogoutUser = async () => {
    await AsyncStorage.removeItem('Authorization');
    await AsyncStorage.removeItem('recentVisited');
    await AsyncStorage.removeItem('logged_in');
      setIsloggedIn({
        authUser: false,
      });
      router.push('/(auth)/Login')
  };

 

async function requestUserPermission() {
 const authStatus = await messaging().requestPermission();
 const enabled =
   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
   authStatus === messaging.AuthorizationStatus.PROVISIONAL;

 if (enabled) {
   console.log('Authorization status:', authStatus);
 }
}

const getUserToken = async () =>{
 const token = await messaging().getToken()
 console.log("firebase token", token)
 setFirebaseToken(token)
}

async function registerForPushNotificationsAsync() {
  let token;
  await Location.requestForegroundPermissionsAsync();
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  try {
    await AsyncStorage.setItem('NotificationPermission', "granted");
    await AsyncStorage.setItem('LocationPermission', "granted");
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("expo token", token)
  } catch (error) {
    console.error('Error fetching push token:', error);
  }
  return token;
}


 useEffect(() => {
   requestUserPermission();
   getUserToken();
   registerForPushNotificationsAsync()
     .then(token => {
       setExpoPushToken(token);
       console.log("EXPO TOKEN", token);
     })
     .catch((error) => setExpoPushToken(`${error}`));

 }, []);



  return (
    <AuthenticatedContext.Provider value={{ isloggedIn, setIsloggedIn, currentUser, handleLogoutUser, handleLoggedInUser, subscribed, setSubscribed, firebaseToken, expoPushToken }}>
      {children}
    </AuthenticatedContext.Provider>
  );
};

AuthenticatedProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
