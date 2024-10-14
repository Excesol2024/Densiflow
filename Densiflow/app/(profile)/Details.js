import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native'
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useContext } from 'react'
import { useRouter } from 'expo-router'
import { AuthenticatedContext } from '../../context/Authenticateduser'
const Details = () => {
  const router = useRouter()
  const { currentUser, handleLogoutUser } = useContext(AuthenticatedContext)
  return (
    <View className="flex-1 p-4">
         <View className="mt-8 flex-row items-center">
        <TouchableOpacity className="flex-row items-center" onPress={() => router.push("/(tabs)/Settings")}>
          <AntDesign name="arrowleft" size={30} color="black" />
          <Text
          style={{ fontFamily: "PoppinsMedium" }}
          className="text-lg text-center ml-2"
        >
         Settings
        </Text>
        </TouchableOpacity>
      </View>

    <View className="flex-1 mt-10 items-center">
    <View className="flex justify-center items-center w-44">
   
    <Image source={{ uri: currentUser.user.photo_url }} className="h-36 w-36 rounded-full border-2 border-secondary" />
    
    <Pressable>
      <Text style={{fontFamily: "PoppinsMedium"}} className="text-secondary mt-1">set Picture</Text>
    </Pressable>
      <Text style={{fontFamily: "PoppinsBold"}} className="border-b-2 mb-2 w-full border-gray-300 text-center text-secondary p-1 text-lg">{currentUser.user.name}</Text>
      <Text style={{fontFamily: "PoppinsMedium"}} className="text-gray-400 text-md">username</Text>
    </View>
    </View>

    <View className="flex-2 items-center h-44">
    <View className="w-56">
    <TouchableOpacity
        className="bg-secondary p-4 rounded-xl shadow-2xl shadow-primary"
        onPress={handleLogoutUser}
      >
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-white text-center text-lg tracking-widest">
          LOG OUT
        </Text>

      </TouchableOpacity>
      <TouchableOpacity
        className="bg-red-600 p-4 rounded-xl shadow-2xl shadow-primary mt-4"
        onPress={()=>{router.push('/Account')}}
      >
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-white text-center text-lg tracking-widest">
          DELETE ACCOUNT
        </Text>

      </TouchableOpacity>
    </View>
   </View>

    </View>
  )
}

export default Details