import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
  Pressable,
  Alert,
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import NextSvg from "../../components/svg/next";
import * as Location from "expo-location";
import { API } from "../../components/Protected/Api";
import Notif from "../../components/svg/Notif";

import { AuthenticatedContext } from "../../context/Authenticateduser";
import { LoadingEffectsContext } from "../../context/Loadingeffect";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { majorFestivals, nationalHoliday } from "../../components/events/Events";

const Home = () => {
  const [searchText, setSearchText] = useState("");
  const [userCity, setUserCity] = useState("");
  const [userSubregion, setUserSubregion] = useState("");
  const [dateToday, setDateToday] = useState("");
  const [celcius, setCelcius] = useState("");
  const [weatherStatus, setWeatherStatus] = useState("");
  const { handleLoggedInUser, setSubscribed, currentUser } =
    useContext(AuthenticatedContext);

//     const userCity = "Cebu City";
// const userSubregion = ""; // Add more specificity if needed
// const userLocation = `${userCity}${userSubregion ? `, ${userSubregion}` : ""}`;

    const userLocation = `${userCity}, ${userSubregion}`;
    const [filteredFestivals, setFilteredFestivals] = useState([]);
    const userAddress = 'Cebu City'

    const getCurrentDate = () => {
      const today = new Date();
      const options = { month: "long", day: "numeric" };
      return today.toLocaleDateString("en-US", options);
      // return "April 9";
    };

    useEffect(() => {
      const today = getCurrentDate();
      setDateToday(today);
  
      // Filter festivals based on user city and date
      const festivals = majorFestivals.filter((festival) => {
        const matchesCity = festival.location === userCity;
  
        const matchesDate =
          festival.date.includes(today) || // Direct match
          festival.date.includes(today.split(" ")[0]) || // Match month (e.g., "February")
          (festival.date.includes("-") && // Match ranges (e.g., "January 15-21")
            isDateInRange(today, festival.date));
  
        return matchesCity && matchesDate;
      });
  
      setFilteredFestivals(festivals);
    }, []);
  
    const isDateInRange = (today, dateRange) => {
      const [start, end] = dateRange.split("-").map((date) => date.trim());
      const currentDate = new Date(`${new Date().getFullYear()} ${today}`);
      const startDate = new Date(`${new Date().getFullYear()} ${start}`);
      const endDate = new Date(`${new Date().getFullYear()} ${end}`);
      return currentDate >= startDate && currentDate <= endDate;
    };
  
    // Filter holidays matching today's date
    const filteredHolidays = nationalHoliday.filter(
      (holiday) => holiday.date === dateToday
    );
    

  const [popularPlaces, setPopularPlaces] = useState([]);
  const [recommendedPlaces, setRecommendedPlaces] = useState([]);

  const handleGetPopularPlaces = async () => {
    try {
      const response = await API.getPopularPlacess();
      setPopularPlaces(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetRecommendedPlaces = async () => {
    try {
      const response = await API.getRecommededPlaces();
      setRecommendedPlaces(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied");
      return;
    }

    let { coords } = await Location.getCurrentPositionAsync();

    if (coords) {
      const { latitude, longitude } = coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      setUserCity(response[0].city);
      setUserSubregion(response[0].subregion);
    }
  };

  const getCurrentUserWeather = async () => {
    try {
      // Request the user's location
      let { coords } = await Location.getCurrentPositionAsync();
      if (coords) {
        const { latitude, longitude } = coords;

        // Create the body object with latitude and longitude
        const body = {
          longitude: longitude,
          latitude: latitude,
        };
        const response = await API.getCurrentUserWeather(body);
        setWeatherStatus(response.data.weather[0].main);
        handleLoggedInUser();
        const tempKelvin = response.data.main.temp;
        const tempCelsius = Math.round(tempKelvin - 273.15);
        setCelcius(tempCelsius);
      }
    } catch (error) {
      console.log("Error fetching weather:", error);
    }
  };

  const handleIsSelectingGender = () => {
    if (currentUser?.user.gender === "male") {
      setIsSelectingGender(true);
    } else {
      console.log("FEMALE");
    }
  };

  useEffect(() => {
    handleIsSelectingGender();
    getUserCurrentLocation();
    getCurrentDate();
  }, []);

  useEffect(() => {
    // handleGetPopularPlaces();
    // handleGetRecommendedPlaces();
    updatePlaceBasedOnTime();
  }, []);

  useEffect(() => {
    getCurrentUserWeather();
    handleDayOrNight();
  }, []);

  const [isPM, setIsPm] = useState(false);

  const handleDayOrNight = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const isAM = currentHour < 12;

    setIsPm(!isAM); // Set isPM based on whether it's AM or PM

    // const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    // const formattedTime = currentTime.toLocaleString('en-US', options);
  };

  const [currentCategory, setCurrentCategory] = useState("coffee");
  const [suggestedGoodPlace, setSuggestedGoodPlace] = useState([]);

  const updatePlaceBasedOnTime = async () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 3 && currentHour < 10) {
      setCurrentCategory("coffee");
    } else if (currentHour >= 10 && currentHour < 17) {
      setCurrentCategory("lunch");
    } else {
      setCurrentCategory("dinner");
    }
    try {
      const response = await API.getSuggestedPlaces();
      setSuggestedGoodPlace(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [locationsPermission, setLocationPermission] = useState(false);
  const [notificationsPermission, setNotificationsPermission] = useState(false);
  const [mapsPermission, setMapsPermission] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const { setMapLocation, setIsSelectingGender, setIsSearching } = useContext(
    LoadingEffectsContext
  );

  const handleSearchFocus = () => {
    setIsSearching(true);
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
    setMapLocation({
      lat: place.location.lat,
      long: place.location.lng,
    });
    router.push("/Map");
  };

  const handleSelectedSearchedPlaceToNavigate = (place) => {
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
      getRecentVisited();
    } catch (error) {
      console.error("Failed to save recent visit:", error);
    }
  };

  const [recentVisited, setRecentVisited] = useState([]);

  const getRecentVisited = async () => {
    try {
      const recentVisited = await AsyncStorage.getItem("recentVisited");
      if (recentVisited) {
        const visits = JSON.parse(recentVisited);
        console.log("RECENT VISITED", visits);
        setRecentVisited(visits);
      }
    } catch (error) {
      console.error("Failed to retrieve recent visits:", error);
    }
  };

  const [randomReviews, setRandomReviews] = useState([]);
  

  const handleGetRandomReviews = async () => {
    try {
      const response = await API.randomReviews({ location: userLocation });
      setRandomReviews(response.data);
      setFadeAnimValues(response.data.map(() => new Animated.Value(1)));
    } catch (error) {
      console.log(error);
    }
  };

  const [comments, setComments] = useState("");
  const [errorComments, setErrorComments] = useState("");

  const handleReviewsInputChange = (field, value) => {
    // Update the specific field's value
    if (field === "comments") {
      setComments(value);
    }

    // Clear the error for the specific field
    if (errorComments[field]) {
      setErrorComments((prevErrors) => ({ ...prevErrors, [field]: "" }));
    }
  };

  const createReviewsforPlace = async () => {
    if (comments === "") {
      setErrorComments("This field is required!");
      return;
    }
    const body = {
      review: {
        comments: comments,
        location: userLocation,
      },
    };
    console.log(body);
    try {
      const response = await API.createUserReviews(body);
      if (response.data) {
        setComments("");
        Alert.alert("Successfully added Reviews");
        handleGetRandomReviews();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [fadeAnimValues, setFadeAnimValues] = useState([]);

  const fadeOutAndMoveToEnd = () => {
    if (randomReviews.length > 0 && fadeAnimValues[0]) {
      Animated.timing(fadeAnimValues[0], {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Move the faded-out item to the end of the array
        setRandomReviews((prevReviews) => {
          const [fadedItem, ...remainingReviews] = prevReviews;
          return [...remainingReviews, fadedItem];
        });

        // Reset the opacity of the moved item and shift animation values
        setFadeAnimValues((prevAnimValues) => {
          const [fadedAnim, ...remainingAnims] = prevAnimValues;
          fadedAnim.setValue(1); // Reset opacity
          return [...remainingAnims, fadedAnim];
        });
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fadeOutAndMoveToEnd();
    }, 3000); // Trigger every 3 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [fadeAnimValues, randomReviews]);

  useEffect(() => {
    getRecentVisited();
    handleGetRandomReviews();
  }, []);

  const happeningToday = [
    {
      name: "New Year's Day",
      description:
        "The first day of the year, a time for family gatherings and celebrations, marking the start of the new calendar year.",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/exceproducts.appspot.com/o/n1.png?alt=media&token=1b760e14-65e7-4adb-aa26-ee5ddf2946fc",
    },
    {
      name: "New Year's Day",
      description:
        "The first day of the year, a time for family gatherings and celebrations, marking the start of the new calendar year.",
      image_url:
        "https://firebasestorage.googleapis.com/v0/b/exceproducts.appspot.com/o/n1.png?alt=media&token=1b760e14-65e7-4adb-aa26-ee5ddf2946fc",
    },
  ];

 
  

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* <LocationPermission visible={locationsPermission} />
      <Notifications visible={notificationsPermission}/>
      <Maps visible={mapsPermission}/>
      <MessageSent visible={messageSent}/> */}

      <View className="">
        <View className=" w-full pl-4 pr-4 mt-14">
          <View className="flex-row justify-between mb-2">
            <View className="flex-row items-center gap-2 mb-5">
              <Notif />
              <View className="flex">
                <View className="flex-row  gap-2">
                  <Text
                    style={{ fontFamily: "PoppinsThin" }}
                    className="text-black"
                  >
                    Current Location
                  </Text>
                  <AntDesign name="caretdown" size={13} color="gray" />
                </View>
                <Text
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-black "
                >
                  {userCity}, {userSubregion}
                </Text>
              </View>
            </View>
            <View className="bg-gray-200 shadow-xl shadow-gray-700 h-full w-16 justify-center items-center rounded-lg absolute right-3 top-[-10] p-2">
              {isPM ? (
                weatherStatus === "Rain" ? (
                  <Image
                    source={require("../../assets/weather/rain.png")}
                    className="w-10 h-8"
                  />
                ) : weatherStatus === "Clouds" ? (
                  <Image
                    source={require("../../assets/weather/moonlight.png")}
                    className="w-10 h-8"
                  />
                ) : weatherStatus === "Thunderstorm" ? (
                  <Image
                    source={require("../../assets/weather/thunder.png")}
                    className="w-10 h-8"
                  />
                ) : (
                  <Image
                    source={require("../../assets/weather/cloudy.png")}
                    className="w-10 h-8"
                  />
                )
              ) : weatherStatus === "Rain" ? (
                <Image
                  source={require("../../assets/weather/rainyday.png")}
                  className="w-10 h-8"
                />
              ) : weatherStatus === "Clouds" ? (
                <Image
                  source={require("../../assets/weather/cloudy.png")}
                  className="w-10 h-8"
                />
              ) : weatherStatus === "Thunderstorm" ? (
                <Image
                  source={require("../../assets/weather/thunder.png")}
                  className="w-10 h-8"
                />
              ) : (
                <Image
                  source={require("../../assets/weather/sunny.png")}
                  className="w-10 h-8"
                />
              )}
              <Text style={{ fontFamily: "PoppinsBold" }}>{celcius}°</Text>
            </View>
          </View>
          <View>
            <View className="rounded-full shadow-lg shadow-gray-900 bg-white">
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
                  placeholder="Where are you going to?"
                  onFocus={() => handleSearchFocus()}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-1 p-4 ">
        <ScrollView className="main-scrollview">
          <View className="mb-3">
            <Text
              style={{ fontFamily: "PoppinsBold" }}
              className="text-xl mt-3"
            >
              Today in your Area
            </Text>
              
            <View className="p-2">
  {filteredHolidays.length > 0 || filteredFestivals.length > 0 ? (
    <>
      {/* Render Holidays */}
      {filteredHolidays.map((item, index) => (
        <View
          key={`holiday-${index}`}
          className="flex-row bg-white rounded-xl p-3 mt-3 shadow-lg shadow-gray-700 items-center"
        >
          <Image
            className="w-24 h-28 rounded-xl"
            source={{
              uri: item.image_url || "https://via.placeholder.com/150",
            }}
          />
          <View className="ml-2 flex-1">
            <Text className="text-lg" style={{ fontFamily: "PoppinsBold" }}>
              {item.name}
            </Text>
            <Text style={{ fontFamily: "PoppinsMedium" }} numberOfLines={4}>{item.description}</Text>
          </View>
        </View>
      ))}

      {/* Render Festivals */}
      {filteredFestivals.map((item, index) => (
        <View
          key={`festival-${index}`}
          className="flex-row bg-white rounded-xl p-3 mt-3 shadow-lg shadow-gray-700 items-center"
        >
          <Image
            className="w-24 h-28 rounded-xl"
            source={{
              uri: item.image_url || "https://via.placeholder.com/150",
            }}
          />
          <View className="ml-2 flex-1">
            <Text className="text-lg" style={{ fontFamily: "PoppinsBold" }}>
              {item.name}
            </Text>
            <Text style={{ fontFamily: "PoppinsMedium" }}>{item.description}</Text>
          </View>
        </View>
      ))}
    </>
  ) : (
    <Text
      style={{ fontFamily: "PoppinsMedium" }}
      className="text-lg text-center mt-2 text-gray-400"
    >
      No events today, but your area has so much to offer! Try exploring some
      popular spots.
    </Text>
  )}
</View>
          
          </View>

          {/**POPULAR AND RECOMMENDED */}

          {/**POPULAR*/}
          <View className="mt-4">
            <View className="flex-row mb-1 justify-between">
              <Text className="text-lg" style={{ fontFamily: "PoppinsBold" }}>
                Popular Near you
              </Text>
              <Text
                onPress={() => router.push("/places/Poppular")}
                className="text-lg text-secondary"
                style={{ fontFamily: "PoppinsBold" }}
              >
                See all
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: "center" }}
            >
              {popularPlaces?.map((places, index) => (
                <Pressable
                  key={index}
                  className="mr-2 "
                  onPress={() => handleSelectedPlacesToNavigate(places)}
                >
                  <View className="rounded-xl overflow-hidden w-48 h-36">
                    <Image
                      source={{ uri: `${places.image_url}` }}
                      className="w-full h-full "
                    />
                  </View>
                  <View className=" flex pl-2">
                    <Text
                      style={{ fontFamily: "PoppinsBold", width: 140 }} // Adjust the width as needed
                      className="text-md mt-2"
                      numberOfLines={1} // Limit to one line
                      ellipsizeMode="tail" // Adds the ellipsis at the end
                    >
                      {places.name}
                    </Text>
                    <View className="flex flex-row gap-1 items-center">
                      <Text
                        style={{ fontFamily: "PoppinsMedium" }}
                        className="text-sm text-gray-400"
                      >
                        {places.kilometers}km
                      </Text>
                      <View className="h-2 w-2 bg-gray-300 rounded-full "></View>
                      <View
                        className={` h-3 rounded-full
${
  places.crowd_status === "high"
    ? "bg-red-500 w-20"
    : places.crowd_status === "medium"
    ? "bg-yellow-300 w-14"
    : places.crowd_status === "low"
    ? "bg-green-500 w-8"
    : ""
} ml-1`}
                      />
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/**RECOMMENDED*/}
          <View className="mt-3">
            <View className="flex-row mb-1 justify-between">
              <Text className="text-lg" style={{ fontFamily: "PoppinsBold" }}>
                Recommended
              </Text>
              <Text
                onPress={() => router.push("/places/Recommended")}
                className="text-lg text-secondary"
                style={{ fontFamily: "PoppinsBold" }}
              >
                See all
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: "center" }}
            >
              {recommendedPlaces?.map((places, index) => (
                <Pressable
                  key={index}
                  className="mr-2 "
                  onPress={() => handleSelectedPlacesToNavigate(places)}
                >
                  <View className="rounded-xl overflow-hidden w-48 h-36">
                    <Image
                      source={{ uri: `${places.image_url}` }}
                      className="w-full h-full "
                    />
                  </View>
                  <View className=" flex pl-2">
                    <Text
                      style={{ fontFamily: "PoppinsBold", width: 140 }} // Adjust the width as needed
                      className="text-md mt-2"
                      numberOfLines={1} // Limit to one line
                      ellipsizeMode="tail" // Adds the ellipsis at the end
                    >
                      {places.name}
                    </Text>
                    <View className="flex flex-row gap-1 items-center">
                      <Text
                        style={{ fontFamily: "PoppinsMedium" }}
                        className="text-sm text-gray-400"
                      >
                        {places.kilometers}km
                      </Text>
                      <View className="h-2 w-2 bg-gray-300 rounded-full "></View>
                      <View
                        className={` h-3 rounded-full
${
  places.crowd_status === "high"
    ? "bg-red-500 w-20"
    : places.crowd_status === "medium"
    ? "bg-yellow-300 w-14"
    : places.crowd_status === "low"
    ? "bg-green-500 w-8"
    : ""
} ml-1`}
                      />
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View className="flex-1 w-full mt-5 mb-5 ">
            <Text style={{ fontFamily: "PoppinsThin" }} className="text-xl">
              Recents Visited
            </Text>

            <View className="">
              {recentVisited.length > 0 ? (
                recentVisited?.map((recent, index) => (
                  <View
                    key={index}
                    className="flex flex-row mt-2 w-full justify-center"
                  >
                    <View className=" rounded-full justify-center">
                      <Image
                        source={require("../../assets/tabs/Location.png")}
                        className="h-10 w-10"
                      />
                    </View>
                    <View className="w-56 mt-2 ml-2 mr-2">
                      <Text
                        style={{ fontFamily: "PoppinsBold" }}
                        className="text-md"
                      >
                        {recent.name}
                      </Text>
                      <Text
                        style={{ fontFamily: "PoppinsThin" }}
                        className="text-sm"
                      >
                        {recent.address}
                      </Text>
                    </View>
                    <Text
                      style={{ fontFamily: "PoppinsThin" }}
                      className="text-md text-gray-400"
                    >
                      {recent.km} km
                    </Text>
                  </View>
                ))
              ) : (
                <Text
                  style={{ fontFamily: "PoppinsThin" }}
                  className="text-lg mt-3 mb-10 text-gray-400 text-center"
                >
                  You haven't visited any spots yet. Start exploring!
                </Text>
              )}
            </View>
          </View>

          {/**SUGGESTED PLACE */}
          <View key={currentCategory} className="flex-1">
         
            {currentCategory === "coffee" ?    <View className="flex-row items-center gap-4 flex-1 relative">
              <Image
                source={require("../../assets/tabs/cuate.png")}
                className="h-26"
              />
              <View>
                <Text
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-lg break-words text-secondary"
                >
                  “Quiet cafes for
                </Text>
                <Text
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-lg break-words text-secondary"
                >
                  your morning coffee”
                </Text>
              </View>
            </View> : currentCategory === "lunch" ?   <View className="flex-row items-center gap-4 flex-1 relative">
              <Image
                source={require("../../assets/tabs/pana.png")}
                className="h-26"
              />
              <View>
                <Text
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-lg break-words text-secondary"
                >
                 “Perfect lunch spots
                </Text>
                <Text
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-lg break-words text-secondary"
                >
                 with moderate crowds”
                </Text>
              </View>
            </View> : currentCategory === "dinner" ?    <View className="flex-row items-center gap-4 flex-1 relative">
              <Image
                source={require("../../assets/tabs/dinner.png")}
                className="h-26"
              />
              <View>
                <Text
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-lg break-words text-secondary"
                >
              “Popular dinner spots 
                </Text>
                <Text
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-lg break-words text-secondary"
                >
                 that fill up quickly”
                </Text>
              </View>
            </View> : ''}

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: "center" }}
              className="mt-2"
            >
              {suggestedGoodPlace?.map((places, index) => (
                <Pressable
                  key={index}
                  className="mr-2 "
                  onPress={() => handleSelectedPlacesToNavigate(places)}
                >
                  <View className="rounded-xl overflow-hidden w-48 h-36">
                    {/* <Image source={{uri: `${places.image_url}`}} className="w-full h-full " /> */}
                    <Image
                      source={{ uri: places.image_url }}
                      className="w-full h-full "
                    />
                  </View>
                  <View className=" flex pl-2">
                    <Text
                      style={{ fontFamily: "PoppinsBold", width: 140 }} // Adjust the width as needed
                      className="text-md mt-2"
                      numberOfLines={1} // Limit to one line
                      ellipsizeMode="tail" // Adds the ellipsis at the end
                    >
                      {places.name}
                    </Text>
                    <View className="flex flex-row gap-1 items-center">
                      <Text
                        style={{ fontFamily: "PoppinsMedium" }}
                        className="text-sm text-gray-400"
                      >
                        {places.kilometers}km
                      </Text>
                      <View className="h-2 w-2 bg-gray-300 rounded-full "></View>
                      <View
                        className={` h-3 rounded-full
${
  places.crowd_status === "high"
    ? "bg-red-500 w-20"
    : places.crowd_status === "medium"
    ? "bg-yellow-300 w-14"
    : places.crowd_status === "low"
    ? "bg-green-500 w-8"
    : ""
} ml-1`}
                      />
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View className=" flex-1 mb-20">
            <View className="flex-1 justify-center items-center mt-10">
              <Text
                className="text-lg text-secondary"
                style={{ fontFamily: "PoppinsBold" }}
              >
                Quick Review
              </Text>
              <View className="flex-1 w-full">
                <TextInput
                  style={{
                    fontFamily: "PoppinsThin",
                    textAlignVertical: "top", // Aligns text to the top
                    paddingTop: 10, // Adds space at the top
                    paddingLeft: 12, // Padding on the left
                    paddingRight: 8, // Padding on the right
                    paddingBottom: 8, // Padding at the bottom
                    height: 128, // Adjust height as needed
                  }}
                  className="border-2 border-secondary rounded-lg mt-2"
                  placeholderTextColor={`${errorComments ? "red" : "gray"}`}
                  placeholder={`${
                    errorComments
                      ? errorComments
                      : "“Share your tips or reviews about the spot!”"
                  }`}
                  value={comments}
                  onChangeText={(text) =>
                    handleReviewsInputChange("comments", text)
                  }
                />
                <Text className="absolute right-3 bottom-2">
                  {" "}
                  <Pressable onPress={() => createReviewsforPlace()}>
                    <NextSvg />
                  </Pressable>
                </Text>
              </View>
            </View>

            <View className="flex flex-col mt-1 ">
              <ScrollView>
                {randomReviews?.slice(0, 5).map((item, index) => (
                  <Animated.View
                    style={[{ opacity: fadeAnimValues[index] }]}
                    key={`${item.reviewer_name}-${index}`}
                    className="flex-row gap-2 mt-2"
                  >
                    <Text
                      style={{ fontFamily: "PoppinsThin" }}
                      className="absolute right-1 text-gray-500 text-md"
                    >
                      {item.date}
                    </Text>
                    <Image
                      source={{ uri: item.photo_url }}
                      className="w-14 h-14"
                    />
                    <View className="flex-1">
                      <Text
                        style={{ fontFamily: "PoppinsThin" }}
                        className="text-xl text-secondary w-48"
                        numberOfLines={1}
                      >
                        {item.reviewer_name}
                      </Text>
                      <Text
                        style={{ fontFamily: "PoppinsMedium" }}
                        className="text-md"
                      >
                        “{item.name} - {item.review_text}”
                      </Text>
                    </View>
                  </Animated.View>
                ))}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;
