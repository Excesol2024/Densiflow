import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import Image1 from "../../assets/rafiki.png"
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';

const stepthree = () => {

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

  const handleGesture = (event) => {
    const { translationX } = event.nativeEvent;

    if (translationX < -50) {
      console.log("swipe")
    } else if (translationX > 50) {
      router.replace('/(getstarted)/Steptwo')
    }
  };

  return (
    <GestureHandlerRootView className="flex-1">
    <PanGestureHandler onGestureEvent={handleGesture}>

    <View className="flex-1 justify-center items-center bg-secondary">
      <Text style={{ fontFamily: 'PoppinsBold' }} className="text-white text-2xl text-center">Never miss the</Text>
      <Text style={{ fontFamily: 'PoppinsBold' }} className="text-white text-2xl text-center">Perfect Moment</Text>
      <Image source={Image1} className="mt-5"/>
    <View className="w-60 mb-5 mt-4">
    <Text style={{ fontFamily: 'PoppinsThin' }} className="mt-3 font-[300] text-white text-center">Set custom alerts for your favorite locations and get notified when crowd levels match your preferences.</Text>
    </View>

      <View className="flex flex-row  gap-2">
        <View className="h-3 w-3 bg-white rounded-full"></View>
        <View className="h-3 w-3 bg-white rounded-full"></View>
        <View className="h-3 w-3 bg-primary rounded-full"></View>
      </View>

      <Pressable onPress={handleGetStarted} className="bg-primary p-2 mt-5 pl-10 pr-10 rounded-xl">
        <Text style={{ fontFamily: 'PoppinsMedium' }} className="text-white text-md">Get started</Text>
      </Pressable>
      <Text onPress={handleGetStarted}  style={{ fontFamily: 'PoppinsMedium' }} className="text-white text-md mt-4">Sign In</Text>
    </View>
</PanGestureHandler>
</GestureHandlerRootView>
  )
}

export default stepthree