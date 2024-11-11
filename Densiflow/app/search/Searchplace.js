import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Pressable,
  ActivityIndicator ,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Clock from "../../components/svg/Clock";
import Notif from "../../components/svg/Notif";
import Back from "../../components/svg/Back";
import { API } from "../../components/Protected/Api";
import { LoadingEffectsContext } from "../../context/Loadingeffect";

const Searchplace = () => {
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const [isTyping, setIsTyping] = useState(false)
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([])

  const {setIsSearching} = useContext(LoadingEffectsContext)

  useEffect(() => {
    if (searchText === "") {
      setSearchResults([]);
      return;
    } 
  
    const timeoutId = setTimeout(() => {
        setIsTyping(true)
      handleSearchPlaces();
    }, 2000);
  
    return () => clearTimeout(timeoutId); 
  }, [searchText]);

  
  const handleSearchPlaces = async () => {
    console.log("IS TYPING")
    setIsTyping(true)
    try {
      const response = await API.getSearchedPlaces({ query: searchText });
      setSearchResults(response.data)
      console.log(response.data)
      if(response.data){
        console.log(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleBack = () => {
    setIsSearching(false)
    setSearchResults([])
    setIsTyping(false)
  }

  const isLoading = !searchResults || searchResults.length === 0;

  return (
   <Modal  
    animationType="slide" // or 'fade' or 'none'
    transparent={true} // Makes the background semi-transparent
   >
     <View className="flex-1 bg-white">
   <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
   <View className="flex-1  p-5">
        <View className="rounded-full border border-gray-400 bg-white">
          <View className="flex-row items-center bg-transparent rounded-full p-1.5">
            {isTyping ?  <Pressable onPress={()=> handleBack()}><Back/></Pressable> : <AntDesign name="search1" size={27} color="gray" paddingLeft={5} />}
            <TextInput
              ref={inputRef}
              style={{ fontFamily: "PoppinsThin" }}
              className="flex-1 pl-2 py-1 text-black text-sm"
              placeholderTextColor="gray"
              placeholder="Where are you going to?"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        <View className="mt-4 flex-1 ml-2">
      
        {!isTyping ?  <View className="">
            <Text
              className="text-lg mb-2"
              style={{ fontFamily: "PoppinsBold" }}
            >
              Recent Searches
            </Text>
            <View className="flex-row items-center gap-5 mb-2">
              <Clock />
              <Text className="text-md" style={{ fontFamily: "PoppinsMedium" }}>
                Ocean Park
              </Text>
            </View>
            <View className="flex-row items-center gap-5 mb-2">
              <Clock />
              <Text className="text-md" style={{ fontFamily: "PoppinsMedium" }}>
                Ocean Park
              </Text>
            </View>
          </View> :      <ScrollView>
      {isLoading ? (
        <View className="flex-1 items-center justify-center mt-1">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ fontFamily: "PoppinsThin" }}>No search results found</Text>
        </View>
      ) : (
        searchResults.map((place, index) => (
          <View key={index} className="flex-row gap-2 items-center mb-2">
            <Notif />
            <View>
              <Text className="" style={{ fontFamily: "PoppinsBold" }}>{place.name}</Text>
              <Text
                className="w-60"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ fontFamily: "PoppinsThin" }}
              >
                {place.subname}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView> }
         
        </View>

        {isTyping ? '' : 
          <View className=" flex-1 justify-center ml-2">
          <Text className="text-lg mb-2" style={{ fontFamily: "PoppinsBold" }}>
            Find Nearby
          </Text>
          <View className="flex-row gap-1 items-center">
            <View className="bg-secondary flex-1 justify-center p-1.5 items-center rounded-full">
              <Text
                className="text-xs text-white"
                style={{ fontFamily: "PoppinsThin" }}
              >
                Coffee shops
              </Text>
            </View>
            <View className="bg-secondary flex-1 justify-center p-1.5 items-center rounded-full">
              <Text
                className="text-xs text-white"
                style={{ fontFamily: "PoppinsThin" }}
              >
                Restaurants
              </Text>
            </View>
            <View className="bg-secondary flex-1 justify-center p-1.5 items-center rounded-full">
              <Text
                className="text-xs text-white"
                style={{ fontFamily: "PoppinsThin" }}
              >
                Shopping Malls
              </Text>
            </View>
          </View>
          <View className="flex-row gap-1 mt-1.5 items-center">
            <View className="bg-secondary flex-1 justify-center p-1.5 items-center rounded-full">
              <Text
                className="text-xs text-white"
                style={{ fontFamily: "PoppinsThin" }}
              >
                Pharmacies
              </Text>
            </View>
            <View className="bg-secondary flex-1 justify-center p-1.5 items-center rounded-full">
              <Text
                className="text-xs text-white"
                style={{ fontFamily: "PoppinsThin" }}
              >
                Hotels
              </Text>
            </View>
            <View className="bg-secondary flex-1 justify-center p-1.5 items-center rounded-full">
              <Text
                className="text-xs text-white"
                style={{ fontFamily: "PoppinsThin" }}
              >
                Stores
              </Text>
            </View>
          </View>
          <View className="flex-row gap-1 mt-1.5 items-center">
            <View className="bg-secondary flex-1 justify-center p-1.5 items-center rounded-full">
              <Text
                className="text-xs text-white"
                style={{ fontFamily: "PoppinsThin" }}
              >
                Gas Stations
              </Text>
            </View>
            <View className="bg-secondary flex-1 justify-center p-1.5 items-center rounded-full">
              <Text
                className="text-xs text-white"
                style={{ fontFamily: "PoppinsThin" }}
              >
                Bakery
              </Text>
            </View>
            <View className="bg-secondary flex-1 justify-center p-1.5 items-center rounded-full">
              <Text
                className="text-xs text-white"
                style={{ fontFamily: "PoppinsThin" }}
              >
                Parks
              </Text>
            </View>
          </View>
        </View>}
      
      </View>
   </TouchableWithoutFeedback>
    </View>
   </Modal>
  );
};

export default Searchplace;
