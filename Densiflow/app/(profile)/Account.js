import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import Lock from "../../components/svg/Lock";
import { API } from "../../components/Protected/Api";
import { AuthenticatedContext } from "../../context/Authenticateduser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GoogleIcon from "../../components/svg/Google";
import FacebookIcon from "../../components/svg/Facebook";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import Loadingscreen from "../../components/Modal";

const Account = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthenticatedContext);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAccount = async () => {
    const email = await AsyncStorage.getItem("Email");
    const body = {
      email: email,
      password: password,
    };

    try {
      const response = await API.deleteAccount(body);
      console.log("DELETION", response.data.status);
      if (response.data.status === "success") {
        Alert.alert("SUCCESFFULLY DELETED ACCOUNT");
        await AsyncStorage.clear();
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("INVALID PASSWORD");
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "401998714323-e76k10at7c8qm1e6fpm0n71kf01upj9q.apps.googleusercontent.com",
    });
  }, []);

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
        handleDeleteSocialAccount(userCredential);
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

      if (userInfo) {
        handleDeleteSocialAccount(userInfo);
      }
    } catch (error) {
      console.error("Error during Google Sign-in:", error.message);
      Alert.alert("Error", error.message); // Display the error to the user
    }
  };

  const handleDeleteSocialAccount = async (user) => {
    const payload = {
      email: user.user.email,
      password: user.user.uid,
    };

    try {
      const response = await API.deleteAccount(payload);
      console.log("DELETION", response.data.status);
      if (response.data.status === "success") {
        Alert.alert("SUCCESFFULLY DELETED ACCOUNT");
        await AsyncStorage.clear();
        setIsLoading(false);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("INVALID ACCOUNT");
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <Loadingscreen isLoading={isLoading} />
      <View className="flex-row items-center p-3">
        <TouchableOpacity onPress={() => router.push("/(tabs)/Profile")}>
          <AntDesign name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
        <Text className="ml-3 text-lg" style={{ fontFamily: "PoppinsMedium" }}>
          Back
        </Text>
      </View>

      <View className="flex-1">
        <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
          <Text
            className="text-center text-secondary"
            style={{ fontFamily: "PoppinsMedium", fontSize: 24 }}
          >
            Delete Account
          </Text>
          <View className="p-6">
            <Text style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
              Are you sure you want to delete your Crodensify account? This
              action is permanent and cannot be undone. All your personal
              information, project contributions, and account history will be
              permanently erased.
            </Text>
            <Text
              className="mt-5"
              style={{ fontFamily: "PoppinsBold", fontSize: 16 }}
            >
              To confirm deletion, please enter your password below.
            </Text>

            {/* Input field with lock icon */}
            <View className="flex-row items-center border border-gray-300 rounded-lg p-2 mt-4">
              <Lock className="w-5 h-5 text-gray-400" />
              <TextInput
                placeholder="Enter your password"
                className="ml-3 flex-1"
                style={{ fontFamily: "PoppinsMedium" }}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <Pressable
              onPress={handleDeleteAccount}
              className="bg-secondary flex-1 justify-center items-center p-3 rounded-2xl shadow-lg shadow-secondary mt-4"
            >
              <Text
                className="text-white"
                style={{ fontFamily: "PoppinsBold", fontSize: 16 }}
              >
                DELETE
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>

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
              <Text style={{ fontFamily: "PoppinsMedium" }} className="ml-3">
                Delete with Google
              </Text>
            </View>
          </Pressable>
          <Pressable onPress={onFacebookButtonPress}>
            <View className="flex flex-row p-3 bg-white shadow-md w-64 rounded-xl shadow-gray-400 justify-center items-center mt-2">
              <FacebookIcon />
              <Text style={{ fontFamily: "PoppinsMedium" }} className="ml-3">
                Delete with Facebook
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Account;
