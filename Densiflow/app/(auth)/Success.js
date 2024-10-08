import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react'
import SuccessIcon from "../../components/svg/success";
import Arrowright from "../../components/svg/Arrowright";
import { useRouter } from 'expo-router';

const Success = () => {
    const router = useRouter();
  return (
    <View className="flex-1 justify-center items-center">
      <View className="flex-2">
        <View className="flex-2 items-center">
        <SuccessIcon className=""/>
        </View>
        <Text style={{ fontFamily: 'PoppinsMedium' }} className="text-3xl mb-3 mt-3 text-center">Password Changed</Text>
        <Text style={{ fontFamily: 'PoppinsMedium' }} className="mb-4 text-md">Your password has been changed succesfully</Text>
        <View className=" mt-4">
    <TouchableOpacity
        className="bg-secondary p-4 rounded-xl shadow-2xl shadow-primary"
        onPress={()=>{router.push('/login')}}
      >
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-white text-center text-lg tracking-widest">
          BACK TO SIGN IN
        </Text>
        <View className="absolute right-3 top-3 bg-primary p-2 rounded-full">
        <Arrowright className=""/>
        </View>
      </TouchableOpacity>
    </View>

      </View>
    </View>
  )
}

export default Success