import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Pressable,
  ScrollView,
  Keyboard,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { API } from "../../components/Unprotected/Api";
import { AuthenticatedContext } from "../../context/Authenticateduser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Lodingscreen from "../../components/Modal";
import Lock from "../../components/svg/Lock";
import Email from "../../components/svg/Email";
import Eye from "../../components/svg/Eye";
import Arrowright from "../../components/svg/Arrowright";
import GoogleIcon from "../../components/svg/Google";
import FacebookIcon from "../../components/svg/Facebook";
import Toggle from "react-native-toggle-input";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import messaging from '@react-native-firebase/messaging';
import * as Location from 'expo-location';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setIsloggedIn } = useContext(AuthenticatedContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isToggle, setIsToggle] = useState(true);
  

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "401998714323-e76k10at7c8qm1e6fpm0n71kf01upj9q.apps.googleusercontent.com",
    });
    
  }, []);


  const [firebaseToken, setFirebaseToken] = useState('')
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


  //PUSH NOTIFICATIONS
  const [expoPushToken, setExpoPushToken] = useState('');
 
  useEffect(() => {
    requestUserPermission();
    getUserToken();
    registerForPushNotificationsAsync()
      .then(token => {
        setExpoPushToken(token);
        console.log(token);
      })
      .catch((error) => setExpoPushToken(`${error}`));

  }, []);

  // Function to register for push notifications
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
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("expo token", token)
  } catch (error) {
    console.error('Error fetching push token:', error);
  }
  return token;
}



  const onFacebookButtonPress = async () => {
    setIsLoading(true);
    try {
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);

      if (result.isCancelled) {
        throw "User cancelled the login process";
      }

      // Once signed in, get the user's AccessToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        console.log("ERROR ACCESSTOKEN");
        return;
      }

      console.log("Access Token:", data.accessToken);
      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken
      );

      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(
        facebookCredential
      );

      // Log the signed-in user's info
      if (userCredential) {
        handleManualSignedIn(userCredential);
      } else {
        console.log("NOTHING USER INFO");
      }
    } catch (error) {
      console.error("Facebook login error:", error);
    }
  };

  const onGoogleButtonPress = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const response = await GoogleSignin.signIn();
      const idToken = response.data.idToken; // Update this line
      console.log("ID Token:", idToken);

      if (!idToken) {
        console.log("ID token not received");
        return;
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userInfo = await auth().signInWithCredential(googleCredential);
      handleManualSignedIn(userInfo);
      // if(userInfo){
      //   router.push('/(tabs)/Home')
      // }
    } catch (error) {
      console.error("Error during Google Sign-in:", error.message);
      Alert.alert("Error", error.message); // Display the error to the user
    }
  };

  const handleManualSignedIn = async (user) => {
    const payload = {
      user: {
        email: user.user.email,
        password: user.user.uid,
      },
       expo_token: expoPushToken,
       firebase_token: firebaseToken
    };

    try {
      const response = await API.loginUser(payload);
      console.log(response.data);
      if (response.data.status === "ok") {
        setIsloggedIn({
          authUser: true,
        });
        const tokenWithBearer = response.headers.get("Authorization");
        const token = tokenWithBearer.split(" ")[1];
        await AsyncStorage.setItem("Authorization", JSON.stringify(token));
        await AsyncStorage.setItem("Email", email);
        setIsLoading(false);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setIsLoading(false);
        Alert.alert("Please Sign Up First Using Google");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Please Sign Up First Using Google or Facebook");
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const body = {
      user: {
        email: email,
        password: password,
      },
      expo_token: expoPushToken,
      firebase_token: firebaseToken
    };

    if (email === "") {
      Alert.alert("Email must not be empty");
      setIsLoading(false);
      return;
    } else if (password === "") {
      Alert.alert("Password must not be empty");
      setIsLoading(false);
      return;
    }
    try {
      const response = await API.loginUser(body);
      console.log(response.data);
      if (response.data.status === "ok") {
        setIsloggedIn({
          authUser: true,
        });
        const tokenWithBearer = response.headers.get("Authorization");
        const token = tokenWithBearer.split(" ")[1];
        await AsyncStorage.setItem("Authorization", JSON.stringify(token));
        await AsyncStorage.setItem("Email", email);
        setIsLoading(false);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setIsLoading(false);
        Alert.alert("Invalid Username or Password");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Invalid Username or Password");
      setIsLoading(false);
    }
  };

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      }
    );

    // Cleanup the listeners on unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flex: 1, height: 50 }}>
      <View className="flex-1 justify-center p-4 bg-white">
        <Lodingscreen isLoading={isLoading} />
        <View className="flex-1 justify-end">
          <Text
            style={{ fontFamily: "PoppinsMedium" }}
            className="text-2xl mb-4 text-start "
          >
            Sign In
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg p-3 mb-4">
            <Email className=" text-gray-400" />
            <TextInput
              placeholder="example@gmail.com"
              placeholderTextColor={"#747688"}
              className="ml-3 flex-1"
              style={{ fontFamily: "PoppinsMedium" }}
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View className="flex-row items-center border border-gray-300 rounded-lg p-3 mb-4">
            <Lock className=" text-gray-400 ml-1" />
            <TextInput
              placeholder="Your Password"
              placeholderTextColor={"#747688"}
              className="ml-3 flex-1"
              style={{ fontFamily: "PoppinsMedium" }}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Eye />
          </View>
          <View className="flex-row justify-between">
            <View className="flex-row">
              <Toggle
                toggle={isToggle}
                setToggle={setIsToggle}
                color={"#007AFF"}
                size={12}
                filled={true}
                circleColor={"white"}
                // onTrue={}
                // onFalse={}
              />
              <Text
                style={{ fontFamily: "PoppinsMedium" }}
                className="text-md mb-4 ml-1"
              >
                Remember Me
              </Text>
            </View>
            <Text
              onPress={() => router.push("/Forgotpassword")}
              style={{ fontFamily: "PoppinsMedium" }}
              className="text-md mb-4"
            >
              Forgot Password?
            </Text>
          </View>
          <View className=" ml-10 mr-10 mt-4">
            <TouchableOpacity
              className="bg-secondary p-3.5 rounded-xl shadow-2xl shadow-primary"
              onPress={handleLogin}
            >
              <Text
                style={{ fontFamily: "PoppinsMedium" }}
                className="text-white text-center text-lg tracking-widest"
              >
                SIGN IN
              </Text>
              <Text className="absolute top-5 right-3">
                {" "}
                <Arrowright />
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {isKeyboardVisible ? (
          ""
        ) : (
          <View className="flex-2 mt-5 mb-4">
            <Text
              style={{ fontFamily: "PoppinsMedium" }}
              className="text-center text-lg text-gray-400 mt-5"
            >
              OR
            </Text>
            <View className="flex-2 justify-center items-center">
              <Pressable onPress={onGoogleButtonPress}>
                <View className="flex flex-row p-3 bg-white shadow-md w-64 rounded-xl shadow-gray-400 justify-center items-center mt-1">
                  <GoogleIcon />
                  <Text
                    style={{ fontFamily: "PoppinsMedium" }}
                    className="ml-3"
                  >
                    Login with Google
                  </Text>
                </View>
              </Pressable>
              <Pressable onPress={onFacebookButtonPress}>
                <View className="flex flex-row p-3 bg-white shadow-md w-64 rounded-xl shadow-gray-400 justify-center items-center mt-2">
                  <FacebookIcon />
                  <Text
                    style={{ fontFamily: "PoppinsMedium" }}
                    className="ml-3"
                  >
                    Login with Facebook
                  </Text>
                </View>
              </Pressable>
            </View>
            <View className="flex-row items-center justify-center">
              <Text
                style={{ fontFamily: "PoppinsMedium" }}
                className="text-center text-md mt-7"
              >
                Don’t have an account?
              </Text>
              <Text
                style={{ fontFamily: "PoppinsMedium" }}
                onPress={() => router.push("/(auth)/Registration")}
                className="text-center text-md mt-7 text-secondary ml-2"
              >
                Sign Up
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

