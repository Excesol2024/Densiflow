import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  Pressable,
  Animated,
} from "react-native";
import React, { useEffect, useState, useContext, useRef } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import LocationSvg from "../../components/svg/location";
import MiniSvg from "../../components/svg/mini";
import { API } from "../../components/Protected/Api";
import { LoadingEffectsContext } from "../../context/Loadingeffect";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { useRouter } from "expo-router";

const Saved = () => {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isSaved } = useContext(LoadingEffectsContext);
  const router = useRouter();
  // Fetch saved places from the API
  const fetchSavedPlaces = async () => {
    try {
      // Fetch the saved places from the API
      const response = await API.getSavedPlaces();
      const places = response.data.updated_places;
  
      // Log the retrieved saved places (optional for debugging)
      console.log("SAVEDPLACES", places);
  
      // Sort the places in descending order by created_at
      const sortedFiltered = places.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA; // Descending: newest to oldest
      });
  
      // Update the state with the sorted places
      setSavedPlaces(sortedFiltered);
      setFilteredPlaces(sortedFiltered); // Initialize filteredPlaces with all places
    } catch (error) {
      // Log any errors for debugging
      console.error("Error fetching saved places:", error);
    }
  };

  // Filter the places based on search query and sort by created_at (ascending)
  const handleSearch = (query) => {
    setSearchQuery(query);
    // Filter the places by name and sort them by created_at in ascending order
    const filtered = savedPlaces.filter((place) =>
      place.name.toLowerCase().includes(query.toLowerCase())
    );
    const sortedFiltered = filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateA - dateB; // Sort in ascending order of created_at
    });
    setFilteredPlaces(sortedFiltered);
  };

  useEffect(() => {
    fetchSavedPlaces();
  }, [isSaved]);

  const deletePlace = async (placeID, id) => {
    console.log(placeID);
    const arr = [...filteredPlaces];
    const index = arr.findIndex((item) => item.id === id);
    arr.splice(index, 1); // Remove the item from the array
    setFilteredPlaces(arr);
    try {
      const response = await API.deletePlace({ query: placeID });
      console.log(response.data);
      if (response.data) {
        fetchSavedPlaces();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { setMapLocation } = useContext(LoadingEffectsContext);

  const handleSelectedPlaceToNavigate = (place) => {
    const body = {
      name: place.name,
      vicinity: place.address,
      crowd_status: place.crowd_status,
      image_url: place.image_url,
      opening_hours: place.opening_hours,
      place_id: place.placeID,
      location: {
        lat: place.lat,
        lng: place.long,
      },
    };
    console.log(body);
    setMapLocation(body)
    router.push('/Map')
  };

  const RightSwipe = (placeID, id) => {
    return (
      <Pressable
        onPress={() => deletePlace(placeID, id)}
        className="flex-row  justify-end items-center bg-red-500 shadow-lg shadow-gray-900 mb-3 p-3"
      >
        <AntDesign name="delete" size={24} color="white" />
        <Text style={{ fontFamily: "PoppinsBold" }} className="text-white ml-2">
          Delete
        </Text>
      </Pressable>
    );
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-white">
        <View className="flex-row top-11 gap-3 items-center p-3">
          <AntDesign name="arrowleft" size={30} color="black" />
          <Text style={{ fontFamily: "PoppinsBold" }} className="text-xl">
            Saved Places
          </Text>
        </View>

        {filteredPlaces.length > 0 ? (
          <View className="flex-1 p-3 mt-8 mb-20">
            <View className="rounded-full shadow-lg shadow-gray-900 bg-white mb-3">
              <View className="flex-row items-center bg-transparent rounded-full p-2">
                <AntDesign
                  name="search1"
                  size={27}
                  color="gray"
                  paddingLeft={5}
                />
                <TextInput
                  style={{ fontFamily: "PoppinsThin" }}
                  className="flex-1 pl-2 py-1 text-black text-sm"
                  placeholderTextColor="gray"
                  placeholder="Search here"
                  value={searchQuery} // Bind the input value to searchQuery state
                  onChangeText={(text) => handleSearch(text)} // Update search query
                />
              </View>
            </View>

            <ScrollView className="flex-1">
              {filteredPlaces.length === 0 ? (
                <View className="flex-1 items-center justify-center p-4">
                  <Text
                    style={{ fontFamily: "PoppinsThin" }}
                    className="text-xl text-secondary mt-1"
                  >
                    No places match your search.
                  </Text>
                </View>
              ) : (
                filteredPlaces.map((places) => (
                  <Swipeable
                    animationOptions={true}
                    friction={1}
                    key={places.id}
                    overshootRight={false}
                    renderRightActions={() =>
                      RightSwipe(places.placesID, places.id)
                    }
                  >
                    <Pressable
                      onPress={() => handleSelectedPlaceToNavigate(places)}
                      className="flex-row items-center p-3 mb-3  bg-white shadow-lg  shadow-gray-950 relative"
                    >
                      <View
                        className={`w-3 h-3 absolute rounded-full top-3 right-3 ${
                          places.crowd_status === "high"
                            ? "bg-red-500"
                            : places.crowd_status === "medium"
                            ? "bg-yellow-300"
                            : places.crowd_status === "low"
                            ? "bg-green-500"
                            : ""
                        } ml-1`}
                      ></View>
                      <Image
                        source={{ uri: places.image_url }}
                        className="rounded-2xl w-20 h-20"
                      />
                      <View className="flex-1 pl-2">
                        <Text
                          numberOfLines={2}
                          style={{ fontFamily: "PoppinsBold" }}
                          className="text-lg pl-1"
                        >
                          {places.name}
                        </Text>

                        <View className="flex-row gap-1">
                          <MiniSvg />
                          <Text
                            numberOfLines={1}
                            style={{ fontFamily: "PoppinsThin", fontSize: 12 }}
                          >
                            {places.address}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  </Swipeable>
                ))
              )}
            </ScrollView>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center p-4">
            <View className="flex-1 items-center justify-center p-4">
              <LocationSvg />
              <Text
                style={{ fontFamily: "PoppinsThin" }}
                className="text-xl text-secondary mt-1"
              >
                No Saved Places
              </Text>

              <Text
                style={{ fontFamily: "PoppinsThin" }}
                className="text-center text-lg mt-2"
              >
                You haven’t saved any places yet. Start adding your favorites to
                keep track of them here!
              </Text>
            </View>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default Saved;
