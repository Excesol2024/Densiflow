import { View, Text, Pressable } from 'react-native'
import React, { useContext } from 'react'
import { LinearGradient } from "expo-linear-gradient";
import Check from '../../components/svg/Check';
import Subscheck from '../../components/svg/Subscheck'
import { AuthenticatedContext } from '../../context/Authenticateduser';
const Subscribed = () => {
  const { subscribed, setSubscribed } = useContext(AuthenticatedContext)
  if (!subscribed) return null;

  return (
    <View className="mt-10 absolute z-50 h-screen w-full bg-slate-600 flex-1">
         <LinearGradient
    colors={["#006de4", "#013d80", "#000000", "#000000"]} // Use two colors for a clean gradient

    className=" w-full  shadow-gray-900 flex-1 absolute h-screen"
  >
    <View className="flex-1">
      <View className=" flex-row p-4 pl-6 pr-6 justify-between ">
      <Pressable onPress={() => setSubscribed(false)}>
        <Text style={{fontFamily: "PoppinsMedium"}} className="text-3xl text-white">x</Text>
        </Pressable>
        <Text style={{fontFamily: "PoppinsMedium"}} className="text-lg text-white">Restore</Text>
       </View>
       <View className="flex-3  items-center mt-4">
        <Text style={{fontFamily: "PoppinsMedium"}} className="text-white text-3xl">Unlock All Access</Text>
        <Text style={{fontFamily: "PoppinsMedium"}} className="text-white text-lg mt-2">Stay Ahead of the Crowd</Text>
        <Text style={{fontFamily: "PoppinsMedium"}} className="text-white text-lg">with Densiflow</Text>
       </View>
       <View className="flex-3 p-5 mt-4">
          <View className="flex-row gap-4">
            <Check/>
          <Text style={{fontFamily: "PoppinsMedium"}} className="text-white text-lg mb-1">Ad-Free Experience</Text>
          </View>
          <View className="flex-row gap-4">
            <Check/>
          <Text style={{fontFamily: "PoppinsMedium"}} className="text-white text-lg mb-1">Personalized Alerts</Text>
          </View>
          <View className="flex-row gap-4">
            <Check/>
          <Text style={{fontFamily: "PoppinsMedium"}} className="text-white text-lg mb-1">Priority Customer Support</Text>
          </View>
          <View className="flex-row gap-4">
            <Check/>
          <Text style={{fontFamily: "PoppinsMedium"}} className="text-white text-lg">Early access to new features</Text>
          </View>
       </View>

       <View className="flex-row  p-5 w-full space-x-4">
    <View className="border-2 border-secondary p-3 rounded-2xl w-1/2">
        <View className="absolute right-[-8] top-[-10]">
        <Subscheck/>
        </View>
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-secondary text-lg">Weekly</Text>
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-secondary text-3xl">$1.12</Text>
        <View className="flex-1 justify-end">
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-secondary text-md ">Billed Weekly</Text>
        </View>
    </View> 
    <View className="border-2 border-gray-600 p-3 rounded-2xl w-1/2">
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-white text-lg">Yearly</Text>
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-white text-3xl">$28.99</Text>
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-white text-md">saved 50%</Text>
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-white text-md mt-5">Free 1 Week Trial</Text>
    </View> 
</View>

      <View className="flex-row pl-5 pr-5 mb-3">
        <Pressable onPress={() => console.log("HELLLO")} className="bg-secondary p-4 rounded-full flex-1 items-center " ><Text style={{ fontFamily: "PoppinsMedium" }} className="text-white text-lg">Subcribed</Text></Pressable>
      </View>

      <View className="flex-1 items-center">
      <Text style={{ fontFamily: "PoppinsThin" }} className="text-white text-sm">By continuing, you agree to </Text>
      <View className="flex-row mt-2">
      <Text style={{ fontFamily: "PoppinsThin" }} className="text-gray-400 text-sm">Privacy Policy </Text>
      <Text style={{ fontFamily: "PoppinsThin" }} className="text-gray-50 text-sm">and </Text>
      <Text style={{ fontFamily: "PoppinsThin" }} className="text-gray-400 text-sm">Terms and Condition </Text>
      </View>
      <View className="flex-row mt-2 space-x-4">
    <Text style={{ fontFamily: "PoppinsThin" }} className="text-gray-400 text-sm border-b-2 border-gray-500">Terms of Use</Text>
    <Text style={{ fontFamily: "PoppinsThin" }} className="text-gray-400 text-sm border-b-2 border-gray-500">Privacy Policy</Text>
</View>

      </View>

    </View>
  </LinearGradient>
    </View>
  )
}

export default Subscribed