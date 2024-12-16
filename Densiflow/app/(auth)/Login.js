import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Pressable,
  ScrollView,
  Keyboard,
  SafeAreaView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { API } from "../../components/Unprotected/Api";
import { AuthenticatedContext } from "../../context/Authenticateduser";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import * as Notifications from 'expo-notifications';
import { LoadingEffectsContext } from "../../context/Loadingeffect";
import Unhide from "../../components/svg/Unhide";
import { WEBCLIENTID } from '@env'

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
  const [passwordHidden, setPasswordHidden] = useState(true)
  const router = useRouter();
  const { setIsloggedIn } = useContext(AuthenticatedContext);
  const [isToggle, setIsToggle] = useState(false);
  const { setEffectLoading } = useContext(LoadingEffectsContext);
  const {firebaseToken, expoPushToken} = useContext(AuthenticatedContext);
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  })

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
      WEBCLIENTID,
    });
    
  }, []);

  useEffect(() => {
    // Check AsyncStorage for existing "remember_me" value on component mount
    const getRememberMeStatus = async () => {
      const storedValue = await AsyncStorage.getItem("remember_me");
      if (storedValue === "true") {
        setIsToggle(true);
      }
    };
    getRememberMeStatus();
  }, []);

  const handleToggle = async () => {
    const newToggleState = !isToggle;
    setIsToggle(newToggleState);

    if (newToggleState) {
      // Save "remember_me: true" to AsyncStorage
      await AsyncStorage.setItem("remember_me", "true");
    } else {
      // Remove "remember_me" from AsyncStorage
      await AsyncStorage.removeItem("remember_me");
    }
  };


  // const [firebaseToken, setFirebaseToken] = useState('')
  // async function requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  // }

  // const getUserToken = async () =>{
  //   const token = await messaging().getToken()
  //   console.log("firebase token", token)
  //   setFirebaseToken(token)
  // }


  // //PUSH NOTIFICATIONS
  // const [expoPushToken, setExpoPushToken] = useState('');
 
  // useEffect(() => {
  //   requestUserPermission();
  //   getUserToken();
  //   registerForPushNotificationsAsync()
  //     .then(token => {
  //       setExpoPushToken(token);
  //       console.log(token);
  //     })
  //     .catch((error) => setExpoPushToken(`${error}`));

  // }, []);

//   // Function to register for push notifications
// async function registerForPushNotificationsAsync() {
//   let token;
//   await Location.requestForegroundPermissionsAsync();
//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;

//   if (existingStatus !== 'granted') {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }

//   if (finalStatus !== 'granted') {
//     alert('Failed to get push token for push notification!');
//     return;
//   }
//   try {
//     await AsyncStorage.setItem('NotificationPermission', "granted");
//     await AsyncStorage.setItem('LocationPermission', "granted");
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log("expo token", token)
//   } catch (error) {
//     console.error('Error fetching push token:', error);
//   }
//   return token;
// }



  const onFacebookButtonPress = async () => {
    setEffectLoading(true);
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
    setEffectLoading(true);
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
        setEffectLoading(false);
        setTimeout(() => {
          router.push("/(tabs)/Home");
        }, 1000);
      } else {
        setEffectLoading(false);
        Alert.alert("Please Sign Up First Using Google");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Please Sign Up First Using Google or Facebook");
      setEffectLoading(false);
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    setEffectLoading(true);
    const body = {
      user: {
        email: email,
        password: password,
      },
      expo_token: expoPushToken,
      firebase_token: firebaseToken
    };

    let newErrors = {}; 

    if (email === "") {
      newErrors.email = "Email should not be empty.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    
    if (password === "") {
     newErrors.password = "Password should not be empty.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setEffectLoading(false);
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
        console.log("LOGIN TOKEN", token)
        await AsyncStorage.setItem("Authorization", JSON.stringify(token));
        await AsyncStorage.setItem("Email", email);
        setEffectLoading(false);
        setTimeout(() => {
          router.push("/(tabs)/Home");
        }, 1000);
      } else {
        setEffectLoading(false);
        setErrors({email: "The email address you entered is incorrect.", 
                   password: "The password you entered is incorrect."
        })
      }
    } catch (error) {
      console.log(error.message);
      if(error.message === "User not found"){
        setErrors({email: "No account found with this email address.", 
  })
      } else{
        setErrors({email: "The email address you entered is incorrect.", 
          password: "The password you entered is incorrect."
  })
      }
      setEffectLoading(false);
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

  const handleInputChange = (field, value) => {
    // Update the specific field's value
    if (field === "email") {
      setEmail(value);
    } else if (field === "password") {
      setPassword(value);
    }
  
    // Clear the error for the specific field
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    }
  };

  return (
  <SafeAreaView className="flex-1  justify-center bg-white">
      <ScrollView contentContainerStyle={{ flex: 1, height: 50 }}>
  <View className="flex-1 justify-center p-4">
        <View className="">
          <Text
            style={{ fontFamily: "PoppinsMedium" }}
            className="text-2xl mb-4 text-start "
          >
            Login
          </Text>
          <View className="mb-4">
     <View className={`flex-row items-center border rounded-lg p-3 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}>
    <Email className="text-gray-400" />
    <TextInput
      placeholder="example@gmail.com"
      placeholderTextColor="#747688"
      className="ml-3 flex-1"
      style={{ fontFamily: "PoppinsMedium" }}
      value={email}
      onChangeText={(text) => handleInputChange("email", text)}
    />
  </View>
  {errors.email && (
    <Text style={{ fontFamily: "PoppinsMedium" }} className="text-sm text-start text-red-500 mt-0.5">
      {errors.email}
    </Text>
  )}
</View>

<View className="mb-4">
<View className={`flex-row items-center border rounded-lg p-3 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}>
  <Lock className="text-gray-400 ml-1" />
  <TextInput
    placeholder="Your Password"
    placeholderTextColor="#747688"
    className="ml-3 flex-1"
    style={{ fontFamily: "PoppinsMedium" }}
    value={password}
    onChangeText={(text) => handleInputChange("password", text)}
    secureTextEntry={passwordHidden}
  />
  {passwordHidden ?  <Pressable onPress={()=> setPasswordHidden(false)}>
  <Eye />
  </Pressable> :  <Pressable onPress={()=> setPasswordHidden(true)}>
  <Unhide />
  </Pressable>}
</View>
{errors.password && (
  <Text style={{ fontFamily: "PoppinsMedium" }} className="text-sm text-start text-red-500 mt-0.5">
    {errors.password}
  </Text>
)}
</View>

          <View className="flex-row justify-between">
            <View className="flex-row">
              <Toggle
                toggle={isToggle}
                setToggle={handleToggle}
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
          <View className="">
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
  </SafeAreaView>
  );
};

