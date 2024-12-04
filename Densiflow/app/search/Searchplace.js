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
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Clock from "../../components/svg/Clock";
import Notif from "../../components/svg/Notif";
import Back from "../../components/svg/Back";
import { API } from "../../components/Protected/Api";
import { LoadingEffectsContext } from "../../context/Loadingeffect";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Searchplace = () => {
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const router = useRouter();

  const [isTyping, setIsTyping] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isNoResults, setIsNoResults] = useState(false)

  const { setIsSearching, setNearbyPlaceTypes, setMapLocation } = useContext(
    LoadingEffectsContext
  );

  const placesTypes = [
    { value: "cafe", name: "Coffee shops" },
    { value: "restaurant", name: "Restaurants" },
    { value: "shopping_mall", name: "Shopping Malls" },
  ];

  const placesTypes2 = [
    { value: "pharmacy", name: "Pharmacies" },
    { value: "hotel", name: "Hotels" },
    { value: "store", name: "Stores" },
  ];

  const placesTypes3 = [
    { value: "gas", name: "Gas Stations" },
    { value: "bakery", name: "Bakery" },
    { value: "park", name: "Parks" },
  ];

  useEffect(() => {
    if (searchText === "") {
      setSearchResults([]);
      setIsTyping(false);
      setIsNoResults(false)
      return;
    }
  }, [searchText]);


  const handleNavigateToMap = (place) => {
    router.push('/Map')
    setMapLocation(place)
    setIsSearching(false);
    setSearchResults([]);
    setIsTyping(false);
  }

  useEffect(() => {
    const loadRecentSearches = async () => {
      const storedSearches = await AsyncStorage.getItem("recentSearches");
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    };
    loadRecentSearches();
  }, [searchText]);

  const MAX_RECENT_SEARCHES = 5;

  const handleSearch = async () => {
    if (!searchText.trim()) return; // Prevent empty searches

    const newSearches = [
      searchText,
      ...recentSearches.filter((item) => item !== searchText),
    ]; // Remove duplicates and add new search
    if (newSearches.length > MAX_RECENT_SEARCHES) {
      newSearches.pop(); // Remove the oldest search if the limit is exceeded
    }

    await AsyncStorage.setItem("recentSearches", JSON.stringify(newSearches));
    setRecentSearches(newSearches);
  };

  const handleSearchPlaces = async () => {
    console.log("IS TYPING");
    setIsTyping(true);
    try {
      const response = await API.getSearchedPlaces({ query: searchText });
      if(response.data.length <= 0){
        setIsNoResults(true)
        handleSearch()
      } else {
        setSearchResults(response.data);
        handleSearch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickSearchPlaces = async (placeName) => {
    setSearchText(placeName)
    setIsTyping(true);
    try {
      const response = await API.getSearchedPlaces({ query: placeName });
      if(response.data.length <= 0){
        setIsNoResults(true)
        handleSearch()
      } else {
        setSearchResults(response.data);
        handleSearch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    setIsSearching(false);
    setSearchResults([]);
    setIsTyping(false);
  };

  const isLoading = !searchResults || searchResults.length === 0;

  const handleSelectedNearbyPlaceTypes = (placeName) => {
    console.log(placeName);
    setNearbyPlaceTypes(placeName);
    router.push("/Map");
    setIsSearching(false);
    setIsTyping(false);
  };

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
                {isTyping ? (
                  <Pressable onPress={() => handleBack()}>
                    <Back />
                  </Pressable>
                ) : (
                  <AntDesign
                    name="search1"
                    size={27}
                    color="gray"
                    paddingLeft={5}
                  />
                )}
                <TextInput
                  ref={inputRef}
                  style={{ fontFamily: "PoppinsThin" }}
                  className="flex-1 pl-2 py-1 text-black text-sm"
                  placeholderTextColor="gray"
                  placeholder="Where are you going to?"
                  value={searchText}
                  onChangeText={setSearchText}
                  onSubmitEditing={() => {
                    handleSearchPlaces();
                  }}
                />
              </View>
            </View>

            <View className="mt-4 flex-1 ml-2">
              {!isTyping ? (
                <View className="">
                  <Text
                    className="text-lg mb-2"
                    style={{ fontFamily: "PoppinsBold" }}
                  >
                    Recent Searches
                  </Text>
                  {recentSearches.length > 0 ? (
                    recentSearches.map((search, index) => (
                      <Pressable
                        key={index}
                        onPress={()=> handleClickSearchPlaces(search)}
                        className="flex-row items-center gap-5 mb-2"
                      >
                        <Clock />
                        <Text
                          className="text-md"
                          style={{ fontFamily: "PoppinsMedium" }}
                        >
                          {search}
                        </Text>
                      </Pressable>
                    ))
                  ) : (
                    <Text
                      className="text-md"
                      style={{ fontFamily: "PoppinsMedium" }}
                    >
                      No recent Searches
                    </Text>
                  )}
                </View>
              ) : (
                <ScrollView>
                  {isLoading ? (
                    <View className="flex-1 items-center justify-center mt-1">
                     {isNoResults ? <Text style={{ fontFamily: "PoppinsThin" }}>
                        No search results found
                      </Text> :  <ActivityIndicator size="large" color="#007AFF" />}
                    </View>
                  ) : (
                    searchResults.map((place, index) => (
                      <Pressable
                      onPress={()=> handleNavigateToMap(place)}
                        key={index}
                        className="flex-row gap-2 items-center mb-2"
                      >
                        <Notif />
                        <View>
                          <Text
                            className=""
                            style={{ fontFamily: "PoppinsBold" }}
                          >
                            {place.name}
                          </Text>
                          <Text
                            className="w-60"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={{ fontFamily: "PoppinsThin" }}
                          >
                            {place.subname}
                          </Text>
                        </View>
                      </Pressable>
                    ))
                  )}
                </ScrollView>
              )}
            </View>

            {isTyping ? (
              ""
            ) : (
              <View className=" flex-1 justify-center ml-2">
                <Text
                  className="text-lg mb-2"
                  style={{ fontFamily: "PoppinsBold" }}
                >
                  Find Nearby
                </Text>
                <View className="flex-row gap-1 items-center">
                  {placesTypes.map((item, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleSelectedNearbyPlaceTypes(item.value)}
                      className="bg-secondary flex-1 justify-center p-1.5 items-center rounded-full"
                    >
                      <Text
                        className="text-xs text-white"
                        style={{ fontFamily: "PoppinsThin" }}
                      >
                        {item.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <View className="flex-row gap-1 mt-1.5 items-center">
                  {placesTypes2.map((item, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleSelectedNearbyPlaceTypes(item.value)}
                      className="bg-secondary flex-1 justify-center p-1.5 items-center rounded-full"
                    >
                      <Text
                        className="text-xs text-white"
                        style={{ fontFamily: "PoppinsThin" }}
                      >
                        {item.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <View className="flex-row gap-1 mt-1.5 items-center">
                  {placesTypes3.map((item, index) => (
                    <Pressable
                      key={index}
                      onPress={() => handleSelectedNearbyPlaceTypes(item.value)}
                      className="bg-secondary flex-1 justify-center p-1.5 items-center rounded-full"
                    >
                      <Text
                        className="text-xs text-white"
                        style={{ fontFamily: "PoppinsThin" }}
                      >
                        {item.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

export default Searchplace;
