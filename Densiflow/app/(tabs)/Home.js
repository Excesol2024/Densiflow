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

const Home = () => {
  const [searchText, setSearchText] = useState("");
  const [userCity, setUserCity] = useState("");
  const [userSubregion, setUserSubregion] = useState("");
  const [dateToday, setDateToday] = useState("");
  const [celcius, setCelcius] = useState("");
  const [weatherStatus, setWeatherStatus] = useState("");
  const { handleLoggedInUser, setSubscribed, currentUser } =
    useContext(AuthenticatedContext);

  const getCurrentDate = () => {
    const today = new Date();
    const options = { weekday: "long", month: "long", day: "2-digit" };
    const formattedDate = today.toLocaleDateString("en-US", options);
    setDateToday(formattedDate);
    return formattedDate;
  };

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

  const [goodPlace, setGoodPlace] = useState([]);
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




  const reviewsRandom = [
    {
      date: "12 Jul",
      location: {
        lat: 8.116361,
        lng: 122.6654672,
      },
      name: "Folk's Coffee & Tea Shop",
      photo_url:
        "https://lh3.googleusercontent.com/a/ACg8ocKm453w1H-9pdg60ldcbUq2utQxP1OOOux6cu2NSx_KC3FljQ=s128-c0x00000000-cc-rp-mo",
      place_id: "ChIJe59Qefu_UzIR4rht9LerHU4",
      review_text: "JD jbdujjsjjf DJ",
      reviewer_name: "Sandy Alib",
    },
    {
      date: "02 Jul",
      location: {
        lat: 8.119416599999997,
        lng: 122.6667346,
      },
      name: "Arlene's Cafe",
      photo_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjWiiXh3RJ4oENpNil0IzkqO72VwImIIy4uDUibMEYDRac8iiOO4=s128-c0x00000000-cc-rp-mo-ba3",
      place_id: "ChIJQ8Xr0AC_UzIRKSNkr_ler4I",
      review_text:
        "We ordered Fried Chicken, Eggloo Waffle and Frapp. It was delicious. The staff are nice and friendly. We will definitely  coming back. Highly recommended 👌",
      reviewer_name: "Analyn Heasley",
    },
    {
      date: "07 Jul",
      location: {
        lat: 8.119416599999997,
        lng: 122.6667346,
      },
      name: "Arlene's Cafe",
      photo_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjWdjcQJEGg8GDVX87__QxKrN-ceIY45U20j6s6aEVQhQ-iZ7EBI=s128-c0x00000000-cc-rp-mo",
      place_id: "ChIJQ8Xr0AC_UzIRKSNkr_ler4I",
      review_text:
        "Visited from Auckland New Zealand. Fantastic, mouthwatering food and superlative service and great prices. World class experience! A must visit Cafe.",
      reviewer_name: "murray heasley",
    },
    {
      date: "25 Jun",
      location: {
        lat: 8.119416599999997,
        lng: 122.6667346,
      },
      name: "Arlene's Cafe",
      photo_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjWmCsVy2R5ujxaMtXleVM-85bQBNUclQrz5-hfx6RwcYlVmqQAj=s128-c0x00000000-cc-rp-mo",
      place_id: "ChIJQ8Xr0AC_UzIRKSNkr_ler4I",
      review_text:
        "I Have A Fun Time The Service Crew Was Kind Food Was Great 👍 But The Man Name Rex Was Very Chaka Anyway Good Service Would Definitely Recommend 😁",
      reviewer_name: "Kim.Roldan Flogio",
    },
    {
      date: "05 Aug",
      location: {
        lat: 8.119416599999997,
        lng: 122.6667346,
      },
      name: "Arlene's Cafe",
      photo_url:
        "https://lh3.googleusercontent.com/a/ACg8ocKvtiaaTlaKdBF-lb7NeKUpM1zYbCDQqbmvdATrqo2Og7QxBw=s128-c0x00000000-cc-rp-mo",
      place_id: "ChIJQ8Xr0AC_UzIRKSNkr_ler4I",
      review_text: "Their frappe and waffle combos are the best.",
      reviewer_name: "Merlyn Maribojoc",
    },
    {
      date: "06 Sep",
      location: {
        lat: 8.120186900000002,
        lng: 122.6688904,
      },
      name: "C-Tea Pearls Milktea",
      photo_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjUB1ZfbT-gMVxrsRp0mk3PWJxSKIjEL3kgRIIU34OJ_u1JLg223=s128-c0x00000000-cc-rp-mo",
      place_id: "ChIJI-wdIeK_UzIRy3QbBwsghvw",
      review_text: "Taste good",
      reviewer_name: "Crystelyn Baylon",
    },
    {
      date: "12 May",
      location: {
        lat: 8.120186900000002,
        lng: 122.6688904,
      },
      name: "C-Tea Pearls Milktea",
      photo_url:
        "https://lh3.googleusercontent.com/a/ACg8ocJqGhUlUXoRwA9h3mEddGuoY1EaSQe2QqwOQFe2KY3ELfP6eA=s128-c0x00000000-cc-rp-mo-ba3",
      place_id: "ChIJI-wdIeK_UzIRy3QbBwsghvw",
      review_text: "Lami Cheap Pure milk tea",
      reviewer_name: "Benj Kho",
    },
    {
      date: "11 Sep",
      location: {
        lat: 8.1194746,
        lng: 122.678467,
      },
      name: "Wiry Internet Cafe",
      photo_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjVL7tpDajvfRXmNiMDOWOq6Z6FkBVzdvpMkta3YSAnLUbnB7MgA3g=s128-c0x00000000-cc-rp-mo",
      place_id: "ChIJ_Wk3f2S-UzIRr6rLXxSly20",
      review_text: "ok",
      reviewer_name: "JULITO ELUMBA",
    },
    {
      date: "24 Nov",
      location: {
        lat: 8.1164045,
        lng: 122.6652805,
      },
      name: "CUBES & BUCKET",
      photo_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjW4z7tgvqxUUAWWI1SUeVG6HgE3zoD-6KmHOr_IBh2_r1DC59br=s128-c0x00000000-cc-rp-mo",
      place_id: "ChIJmcLO1w2_UzIRb5EGDajbqrQ",
      review_text: "perfect",
      reviewer_name: "DELL TIJAMO",
    },
    {
      date: "24 May",
      location: {
        lat: 8.1186584,
        lng: 122.6651732,
      },
      name: "Mely's Eatery",
      photo_url:
        "https://lh3.googleusercontent.com/a-/ALV-UjWov3DMQ7nSVIwdLn6r7SPi7rE4aTHbQq_6XJTxHArgRaHWN1M0=s128-c0x00000000-cc-rp-mo-ba2",
      place_id: "ChIJ95sTVR-_UzIRFBd5_kZCCZQ",
      review_text: "👍",
      reviewer_name: "Sonny Calabroso",
    },
    {
      date: "24 Mar",
      location: {
        lat: 8.1202952,
        lng: 122.6659272,
      },
      name: "Griller's Hangout",
      photo_url:
        "https://lh3.googleusercontent.com/a/ACg8ocLYTWBNp2lzkpJGa1aJX4cm3GSae1N990olj9RYSre-IKxCQA=s128-c0x00000000-cc-rp-mo",
      place_id: "ChIJaZ7iQm-_UzIRMJRO4J0brdQ",
      review_text:
        "I and my friends dine here once or twice per week. Love the alfresco and wide space. They cook the food after you order which we love the most. ❤️",
      reviewer_name: "Melannie Jade Aguiles",
    },
  ];

  const [randomReviews, setRandomReviews] = useState([]);
  const userLocation = `${userCity}, ${userSubregion}`;

  const handleGetRandomReviews = async () => {
    try {
      const response = await API.randomReviews({ location: userLocation });
      setRandomReviews(response.data);
      setFadeAnimValues(response.data.map(() => new Animated.Value(1)));
    } catch (error) {
      console.log(error);
    }
  };

  const [comments, setComments] = useState('')
  const [errorComments, setErrorComments] = useState('');

 
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

  const createReviewsforPlace = async () =>{
    if(comments === "") {
      setErrorComments('This field is required!')
      return
    }
    const body = {
      review: {
        comments: comments,
        location: userLocation
      }
    }
    console.log(body)
    try {
      const response = await API.createUserReviews(body)
      if(response.data){
        setComments('')
        Alert.alert("Successfully added Reviews");
        handleGetRandomReviews();
      }
    } catch (error) {
      console.log(error)
    }
  }



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
            {/**ANNOUCEMENTS */}
            <LinearGradient
              colors={["#006de4", "#3D50DF"]} // Use two colors for a clean gradient
              className="w-full h-40 mt-2 rounded-xl overflow-hidden shadow-gray-900"
            >
              <View className="flex-1 pl-5 justify-center">
                <Text
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-white text-lg"
                >
                  Welcome Everyone!
                </Text>
                <Text
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-white text-lg"
                >
                  Our Website is ready!
                </Text>
                <Pressable className="bg-black w-24 items-center p-2 mt-2  rounded-full">
                  <Text
                    style={{ fontFamily: "PoppinsMedium" }}
                    className="text-white "
                  >
                    Visit Now
                  </Text>
                </Pressable>
              </View>

              <View className="absolute flex-row  justify-center items-center bg-white w-24 h-7 bottom-3 right-3 rounded-full">
                <View className="w-5 h-1.5 rounded-full bg-secondary"></View>
                <View className="w-5 h-1.5 rounded-full bg-gray-300 ml-1 mr-1"></View>
                <View className="w-5 h-1.5 rounded-full bg-gray-300"></View>
              </View>
            </LinearGradient>
          </View>

          {/**POPULAR AND RECOMMENDED */}

          {/**POPULAR*/}
          <View className="mt-3">
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

          {goodPlace.length > 0 && (
            <View key={currentCategory} className="flex-1 mt-4 mb-8">
              <View className="flex-row items-center gap-4 flex-1 relative">
                <Image source={goodPlace[0].image} className="h-26" />
                <View>
                  <Text
                    onPress={() => console.log(goodPlace)}
                    style={{ fontFamily: "PoppinsBold" }}
                    className="text-lg break-words text-secondary"
                  >
                    {goodPlace[0].title}
                  </Text>
                  <Text
                    style={{ fontFamily: "PoppinsBold" }}
                    className="text-lg break-words text-secondary"
                  >
                    {goodPlace[0].subtitle}
                  </Text>
                </View>
              </View>

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
          )}

          <View className=" flex-1 mb-20">
            <Text style={{ fontFamily: "PoppinsMedium" }} className="text-xl">
              Today in your Area
            </Text>

            <Text
              style={{ fontFamily: "PoppinsMedium" }}
              className="text-lg text-center mt-4 text-gray-400 hidden"
            >
              No events today, but your area has so much to offer! Try exploring
              some popular spots.
            </Text>

            <View className="flex-1">
              <View className="rounded-3xl flex-row gap-2 p-2 mt-4 bg-white shadow-lg shadow-gray-700">
                <Image
                  source={require("../../assets/tabs/n1.png")}
                  style={{ borderRadius: 16, height: "90%" }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                    className="text-secondary"
                  >
                    1st January
                  </Text>
                  <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
                    Networking & Sharing Club
                  </Text>
                  <Text
                    style={{ fontFamily: "PoppinsThin", fontSize: 14 }}
                    className=""
                  >
                    The first day of the year, a time for family gatherings and
                    celebrations, marking the start of the new calendar year.
                  </Text>
                </View>
              </View>

              <View className="rounded-3xl flex-row gap-2 p-2 mt-4 bg-white shadow-lg shadow-gray-700">
                <Image
                  source={require("../../assets/tabs/n1.png")}
                  style={{ borderRadius: 16, height: "90%" }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}
                    className="text-secondary"
                  >
                    1st January
                  </Text>
                  <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
                    Networking & Sharing Club
                  </Text>
                  <Text
                    style={{ fontFamily: "PoppinsThin", fontSize: 14 }}
                    className=""
                  >
                    The first day of the year, a time for family gatherings and
                    celebrations, marking the start of the new calendar year.
                  </Text>
                </View>
              </View>
            </View>

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
                  placeholderTextColor={`${errorComments ? 'red' : 'gray'}`}
                  placeholder={`${errorComments ? errorComments : '“Share your tips or reviews about the spot!”'}`}
                  value={comments}
                  onChangeText={(text) => handleReviewsInputChange("comments", text)}
                />
                <Text className="absolute right-3 bottom-2">
                  {" "}
                  <Pressable onPress={()=> createReviewsforPlace()}>
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
