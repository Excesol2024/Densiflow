import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import Image1 from "../../assets/pana.png"
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Steptwo = () => {

  const router = useRouter();
  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem("history", "true");
      console.log("History set to true");
      router.replace('/(auth)/Login');
    } catch (error) {
      console.error("Error saving history:", error);
    }
  };

  return (

       <View className="flex-1 justify-center items-center bg-secondary">
      <Text style={{ fontFamily: 'PoppinsBold' }} className="text-white text-2xl text-center">Beat the Crowd,</Text>
      <Text style={{ fontFamily: 'PoppinsBold' }} className="text-white text-2xl text-center">Enjoy your Time</Text>
      <Image source={Image1} className="mt-5"/>
    <View className="w-60 mb-5 mt-4">
    <Text style={{ fontFamily: 'PoppinsThin' }} className="mt-3  text-white text-center">Green means quiet, yellow is comfortably busy, and red indicates peak hours.</Text>
    </View>

      <View className="flex flex-row  gap-2">
        <View className="h-3 w-3 bg-white rounded-full"></View>
        <View className="h-3 w-3 bg-primary rounded-full"></View>
        <View className="h-3 w-3 bg-white rounded-full"></View>
      </View>

      <Pressable onPress={()=>{router.replace('/(getstarted)/Stepthree')}} className="bg-primary p-2 mt-5 pl-10 pr-10 rounded-xl">
        <Text style={{ fontFamily: 'PoppinsMedium' }} className="text-white text-md">Next</Text>
      </Pressable>

      <Text onPress={handleGetStarted}  style={{ fontFamily: 'PoppinsMedium' }} className="text-white text-md mt-4">Sign In</Text>

    </View>
  )
}

export default Steptwo