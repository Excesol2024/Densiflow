import { View, Image } from 'react-native'
import React from 'react'
import Logo from "../assets/newlogo.png"
const splashscreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-secondary">
       <Image source={Logo} className=""/>
    </View>
  )
}

export default splashscreen