import { View, Text, ScrollView, TouchableOpacity, TextInput, Pressable, Alert } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import Lock from "../../components/svg/Lock";
import { API } from "../../components/Protected/Api";
import { AuthenticatedContext } from "../../context/Authenticateduser";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Account = () => {
  const router = useRouter();
  const { currentUser } = useContext(AuthenticatedContext)
  const [password, setPassword] = useState('')

  const handleDeleteAccount = async () =>{
    const email = await AsyncStorage.getItem('Email');
    const body = {
      email: email,
       password: password
   }

    try {
     const response = await API.deleteAccount(body)
     console.log("DELETION", response.data.status)
     if(response.data.status === "success"){
      Alert.alert("SUCCESFFULLY DELETED ACCOUNT")
      await AsyncStorage.clear()
      setTimeout(() => {
        router.push('/')
      }, 2000);
     }
    } catch (error) {
      console.log(error)
     Alert.alert("INVALID PASSWORD")
    }
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row items-center p-3">
        <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
          <AntDesign name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
        <Text className="ml-3 text-lg" style={{ fontFamily: "PoppinsMedium" }}>
          Back
        </Text>
      </View>

      <View className="flex-1">
        <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
          <Text className="text-center text-secondary" style={{ fontFamily: "PoppinsMedium", fontSize: 24 }}>
            Delete Account
          </Text>
          <View className="p-6">
            <Text style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
              Are you sure you want to delete your Crodensify account? This action is permanent and cannot be undone.
              All your personal information, project contributions, and account history will be permanently erased.
            </Text>
            <Text className="mt-5" style={{ fontFamily: "PoppinsBold", fontSize: 16 }}>
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
            <Pressable onPress={handleDeleteAccount} className="bg-secondary flex-1 justify-center items-center p-3 rounded-2xl shadow-lg shadow-secondary mt-4">
              <Text className="text-white" style={{ fontFamily: "PoppinsBold", fontSize: 16 }}>DELETE</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Account;
