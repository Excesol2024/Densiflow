import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Image, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AntDesign from "@expo/vector-icons/AntDesign";
import { API } from '../../components/Protected/Api';
import { useRouter } from 'expo-router';
import { LoadingEffectsContext } from '../../context/Loadingeffect';

const Recommended = () => {
 
    const [recommendedPlaces, setRecommendedPlaces] = useState([])
    const router = useRouter();
    const { setMapLocation } = useContext(LoadingEffectsContext)
    const handleGetRecommendedPlaces = async () => {
        try {
          const response = await API.getRecommededPlaces();
          setRecommendedPlaces(response.data)
         
        } catch (error) {
          console.log(error)
        }
      }

      const handleSelectedPlacesToNavigate = (lat, long) =>{
        console.log(lat, long)
        setMapLocation({
          lat: lat,
          long: long
        })
        router.push('/Map')
      }


      useEffect(()=>{
        handleGetRecommendedPlaces();
      },[])

  return (
    <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-end p-3 h-20 mt-2">
        <TouchableOpacity className="flex-row items-center" onPress={() => router.push("/(tabs)/Home")}>
          <AntDesign name="arrowleft" size={30} color="black" />
        <Text className="ml-3 text-lg" style={{ fontFamily: "PoppinsMedium" }}>
        Recommended For You
        </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
          {Array.from({ length: Math.ceil(recommendedPlaces.length / 2) }, (_, rowIndex) => (
            <View key={rowIndex} className="flex-row justify-between mb-4">
              {recommendedPlaces.slice(rowIndex * 2, rowIndex * 2 + 2).map((place, index) => (
                <Pressable  onPress={()=>handleSelectedPlacesToNavigate(place.location.lat, place.location.lng)} key={index} className="w-1/2 p-2">
                  <View className="rounded-xl overflow-hidden h-28">
                    <Image source={{ uri: place.image_url }} className="w-full h-full" />
                  </View>
                  <View className="flex pl-2 mt-2">
                    <Text
                      style={{ fontFamily: "PoppinsBold", width: "100%" }}
                      className="text-md"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {place.name}
                    </Text>
                    <View className="flex flex-row gap-1 items-center mt-1">
                      <Text style={{ fontFamily: "PoppinsMedium" }} className="text-sm text-gray-400">
                        {place.kilometers}km
                      </Text>
                      <View className="h-2 w-2 bg-gray-300 rounded-full ml-1"></View>
                      <View
                        className={`h-3 rounded-full ${
                          place.crowd_status === "high"
                            ? "bg-red-500 w-20"
                            : place.crowd_status === "medium"
                            ? "bg-yellow-300 w-14"
                            : place.crowd_status === "low"
                            ? "bg-green-500 w-8"
                            : ""
                        } ml-1`}
                      />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Recommended