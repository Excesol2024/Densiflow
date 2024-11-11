import { View, Text, Image, ScrollView, TextInput } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import LocationSvg from "../../components/svg/location";
import MiniSvg from "../../components/svg/mini";
import { API } from "../../components/Protected/Api";
import { LoadingEffectsContext } from "../../context/Loadingeffect";

const Saved = () => {
  const [savedPlaces, setSavedPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isSaved } = useContext(LoadingEffectsContext);

  // Fetch saved places from the API
  const fetchSavedPlaces = async () => {
    try {
      const response = await API.getSavedPlaces();
      const places = response.data;
      const sortedFiltered = places.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA; // Sort in descending order of created_at
      });

      setSavedPlaces(sortedFiltered);
      setFilteredPlaces(sortedFiltered); // Initialize filteredPlaces with all places
    } catch (error) {
      console.log(error);
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
    console.log("PLACES REFRESHED", isSaved);
  }, [isSaved]);

  return (
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
              filteredPlaces.map((places, index) => (
                <View
                  key={index}
                  className="flex-row items-center p-3 mb-3 bg-white shadow-lg rounded-2xl shadow-gray-950 relative"
                >
                  <View
                    className={`w-3 h-3 absolute rounded-full top-3 right-3
${
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
                      style={{ fontFamily: "PoppinsBold" }}
                      className="text-lg pl-1"
                    >
                      {places.name}
                    </Text>

                    <View className="flex-row gap-1">
                      <MiniSvg />
                      <Text style={{ fontFamily: "PoppinsThin", fontSize: 12 }}>
                        {places.address}
                      </Text>
                    </View>
                  </View>
                </View>
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
  );
};

export default Saved;
