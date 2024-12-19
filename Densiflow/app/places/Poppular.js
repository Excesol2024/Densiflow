import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AuthenticatedContext } from "../../context/Authenticateduser";
import { API } from "../../components/Protected/Api";
import { useRouter } from "expo-router";
import { LoadingEffectsContext } from "../../context/Loadingeffect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SkeletonLoader from "../../components/SkeletonLoader";

const Poppular = () => {
  const router = useRouter();
  const [isPopularPlaceLoading, setIsPopularLoading] = useState(true);
  const { setMapLocation, popularNearPlaces } = useContext(LoadingEffectsContext);

  const handleGetPopularPlaces = async () => {
    setTimeout(() => {
      setIsPopularLoading(false)
    }, 2500);
  };

  const handleSelectedPlacesToNavigate = (place) => {
    console.log("SELECTD PLACE", place.kilometers);
    handleRecentVisited(
      place.name,
      place.vicinity,
      place.kilometers,
      place.location.lat,
      place.location.lng
    );
    setMapLocation(place);
    router.push("/Map");
  };

  useEffect(() => {
    handleGetPopularPlaces();
  }, [popularNearPlaces]);

  const handleRecentVisited = async (name, address, km, lat, long) => {
    try {
      // Retrieve the current list of recent visits from AsyncStorage
      const existingVisits = await AsyncStorage.getItem("recentVisited");
      let visits = existingVisits ? JSON.parse(existingVisits) : [];

      // Create a new visit object
      const newVisit = { name, address, km, lat, long };

      // Check if the visit is already in the list
      const isDuplicate = visits.some(
        (visit) =>
          visit.name === newVisit.name && visit.address === newVisit.address
      );

      // If it's a duplicate, do not add it to the list
      if (isDuplicate) {
        console.log("Visit already exists in recent visits");
        return;
      }

      // Add the new visit to the beginning of the list if it's not a duplicate
      visits.unshift(newVisit);

      // Limit the list to 4 items
      if (visits.length > 4) {
        visits.pop(); // Remove the last (oldest) visit
      }

      // Save the updated list back to AsyncStorage
      await AsyncStorage.setItem("recentVisited", JSON.stringify(visits));
      console.log("Recent visit saved successfully");
    } catch (error) {
      console.error("Failed to save recent visit:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row items-end p-3 h-20 mt-2">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => router.push("/(tabs)/Home")}
        >
          <AntDesign name="arrowleft" size={30} color="black" />
          <Text
            className="ml-3 text-lg"
            style={{ fontFamily: "PoppinsMedium" }}
          >
            Popular Near You
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          {isPopularPlaceLoading
            ? Array.from({ length: Math.ceil(10 / 2) }).map((_, rowIndex) => (
              <View key={rowIndex} className="flex-row justify-between">
                {Array.from({ length: 2 }).map((_, columnIndex) => (
                  <View key={columnIndex} className="w-1/2 p-2">
                    <View className="mt-1">
                      <View className="w-full">
                        <SkeletonLoader
                          width={'100%'}
                          height={120}
                           borderRadius={8}
                        />
                      </View>
                      <View className="mt-2">
                        <SkeletonLoader
                          width={120}
                          height={15}
                           borderRadius={8}
                        />
                        <View className="mt-1 w-full">
                          <SkeletonLoader
                          width={'100%'}
                            height={48}
                             borderRadius={8}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ))
            : Array.from(
                { length: Math.ceil(popularNearPlaces.length / 2) },
                (_, rowIndex) => (
                  <View
                    key={rowIndex}
                    className="flex-row justify-between mb-4"
                  >
                    {popularNearPlaces
                      .slice(rowIndex * 2, rowIndex * 2 + 2)
                      .map((place, index) => (
                        <Pressable
                          key={index}
                          onPress={() => handleSelectedPlacesToNavigate(place)}
                          className="w-1/2 p-2"
                        >
                          <View className="rounded-xl overflow-hidden h-28">
                            <Image
                              source={{ uri: place.image_url }}
                              className="w-full h-full"
                            />
                          </View>
                          <View className="flex pl-2 mt-2">
                            <Text
                              style={{
                                fontFamily: "PoppinsBold",
                                width: "100%",
                              }}
                              className="text-md"
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {place.name}
                            </Text>
                            <View className="flex flex-row gap-1 items-center mt-1">
                              <Text
                                style={{ fontFamily: "PoppinsMedium" }}
                                className="text-sm text-gray-400"
                              >
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
                )
              )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Poppular;
