import { View, Text, Image, Pressable, TextInput, ScrollView } from "react-native";
import React, { useState } from "react";
import Image1 from "../../assets/tabs/img1.png";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from '@expo/vector-icons/Fontisto';
import Checkbox from 'expo-checkbox';
import Kilometer from "../../components/svg/Kilometer";
import Bookmark from "../../components/svg/Bookmark";
import Alert from "../../components/svg/Alert";
import Plus from '../../components/svg/map/Plus'
import Minus from '../../components/svg/map/Minus'
import Mapview from '../../components/svg/map/Mapview'
import Locate from '../../components/svg/map/Locate'

const Map = () => {
  const [isChecked, setChecked] = useState(false);
  const [isAm, setIsAM] = useState(true)

  const handleSelectPm = () =>{
    setIsAM(false)
  }

  const handleSelectAm = () =>{
    setIsAM(true)
  }

  const places = [
    {
      name: "Cafes"
    },
    {
      name: "Restaurants"
    },
    {
      name: "Parks"
    },
    {
      name: "Museums"
    },
  ]

  const handleAddNotifications = async () => {
    try {
      
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View className="flex-1 ">
      <View className="flex-1 mt-10">
      <View className="flex-2 p-5 ">
     <View className="rounded-full bg-white shadow-lg shadow-gray-900">
      <View className="flex-row items-center bg-transparent rounded-full p-1">
              <AntDesign
                name="search1"
                size={27}
                color="gray"
                paddingLeft={5}
              
              />
              <TextInput
                style={{ fontFamily: "PoppinsThin" }}
                className="flex-1 pl-2 py-1 text-gray-50 text-sm"
                placeholderTextColor="gray"
                placeholder="Green Park Cafe"
          
              />
            </View>
      </View>

      <View className="flex-row  justify-center mt-4">
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
  {places.map((place, index)=>(
      <Pressable key={index} className="bg-white py-3 px-6 rounded-full shadow-md shadow-gray-300 mx-1">
      <Text style={{ fontFamily: "PoppinsMedium" }} className={place.name === "Cafes" ? 'text-secondary text-sm' : `text-gray-500 text-sm`}>
        {place.name}
      </Text>
    </Pressable>
  ))}
  </ScrollView>
      </View>

     

     </View>
     <View className="flex-1  w-full">
        <View className="right-1 absolute">
        <View className="bg-white w-10 flex justify-center items-center h-9 p-2 rounded-t-lg ">
          <Plus/>
        </View>
        <View className="bg-white w-10 h-9 items-center flex-1 justify-center  p-2 mt-0.5 rounded-b-lg ">
          <Minus/>
        </View>
        <View className="bg-white w-10 flex justify-center items-center mt-2 h-9 p-2 rounded-t-lg ">
          <Mapview/>
        </View>
        <View className="bg-white w-10 h-9 items-center flex-1 justify-center  p-2 mt-0.5 rounded-b-lg ">
          <Locate/>
        </View>
        </View>
      </View>
      </View>
    
      <View className="p-3 flex-1 justify-center items-center">
      <View className="flex flex-row gap-2 p-3 w-full bg-slate-50 absolute bottom-60 shadow-2xl shadow-gray-700 rounded-lg z-50">
         <View className="flex-1 mb-2">
          <Text style={{fontFamily: 'PoppinsMedium'}} className="text-md text-secondary text-center mb-5">
          Set alerts to get notified when your favorite spots reach your preferred crowd level
          </Text>

   

         <View className="flex-1 justify-center items-center">
       <View className="">
       <View className="flex-row gap-2">
          
          <TextInput style={{fontFamily: 'PoppinsMedium' }} className="rounded-md flex items-center w-20 bg-gray-200 p-1 pl-4 pr-4" placeholder="09:32"/>

            <View className="flex-row items-center rounded-md bg-gray-200 p-1.5 ">
              <Pressable onPress={handleSelectAm} className={isAm ? 'mr-2 p-1.5 rounded-md pl-4 pr-4 bg-white' : 'mr-2 p-1.5 rounded-md pl-4 pr-4'}><Text>AM</Text></Pressable>
              <Pressable onPress={handleSelectPm} className={!isAm ? 'mr-2 p-1.5 rounded-md pl-4 pr-4 bg-white' : 'mr-2 p-1.5 rounded-md pl-4 pr-4'}><Text>PM</Text></Pressable>
            </View>
   
          </View>
      
       </View>
         </View>
         <View className="flex-row justify-center mt-4">
          <Pressable className="bg-secondary p-1.5 pl-14 pr-14 rounded-md">
          <Text className="text-white" style={{fontFamily: 'PoppinsMedium' }}>Set</Text>
          </Pressable>
         </View>
         </View>
        </View>


        <View className="flex flex-row p-3 w-full bg-slate-50 absolute bottom-24 shadow-2xl shadow-gray-700 rounded-2xl z-50">
          <View className="absolute right-3 top-3">
          <Bookmark/>
          </View>
          <View className="absolute right-3 bottom-16">
          <Alert/>
          </View>
          <View> 
            <Image source={Image1} className="w-28 h-24 rounded-xl" />
          </View>

          <View className="ml-2">
            <Text style={{ fontFamily: "PoppinsBold", fontSize: 16 }} className="" >Green Park Cafe</Text>
            <Text style={{ fontFamily: "PoppinsThin" }} className="mb-1 text-sm">Antaro Mart, Metro Manila</Text>
            <View className="flex flex-row gap-1 items-center">
              <Kilometer/>
              <Text style={{ fontFamily: "PoppinsBold" }} className="text-secondary mt-1">3.6 Kilometer</Text>
            </View>

            <View className="flex flex-row gap-1 items-center">
              <FontAwesome name="dot-circle-o" size={14} color="#68D391" />
              <Text style={{ fontFamily: "PoppinsBold" }} className="text-green-400 mt-1">Not Crowded (25%)</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Map;
