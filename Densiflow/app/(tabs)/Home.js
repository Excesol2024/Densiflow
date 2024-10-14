import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
  Pressable,
  Alert,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Image1 from "../../assets/tabs/img1.png";
import { LinearGradient } from "expo-linear-gradient";
import NextSvg from "../../components/svg/next";
import * as Location from 'expo-location';
import { API } from "../../components/Protected/Api";
import Moon from "../../components/svg/weather/night/Moon"
import MoonLight from "../../components/svg/weather/night/Moonlight"
import Mooncloud from "../../components/svg/weather/night/Mooncloud"

import Sun from "../../components/svg/weather/day/Sun"
import Light from "../../components/svg/weather/day/Light"
import Rain from "../../components/svg/weather/day/Rain"
import LocationPermission from "../../components/modal/androidpopup/LocationPermission";
import Notifications from "../../components/modal/androidpopup/Notifications";
import Maps from "../../components/modal/androidpopup/Maps";
import MessageSent from "../../components/modal/androidpopup/MessageSent";
import { AuthenticatedContext } from "../../context/Authenticateduser";

const Home =  () => {
  const [searchText, setSearchText] = useState("");
  const [popularPace, setPopularPlace] = useState(true);
  const [recommendedPlace, setRecommendedPlace] = useState(false);
  const [userCity, setUserCity] = useState('');
  const [userSubregion, setUserSubregion] = useState('');
  const [dateToday, setDateToday] = useState('')
  const [celcius, setCelcius] = useState('')
  const [weatherStatus, setWeatherStatus] = useState('')
  const {   handleLoggedInUser } = useContext(AuthenticatedContext);
  const getCurrentDate = () => {
    const today = new Date();
    const options = { weekday: 'long', month: 'long', day: '2-digit' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    console.log('Today is:', formattedDate);
    setDateToday(formattedDate)
    return formattedDate;
  };

  const getUserCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied');
      return;
    }
  
    let { coords } = await Location.getCurrentPositionAsync();
    
    if (coords) {
      const { latitude, longitude } = coords;
      console.log('Your position is', latitude, longitude);
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      })

  

      setUserCity(response[0].city)
      setUserSubregion(response[0].subregion)
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
          latitude: latitude
        };

        const response = await API.getCurrentUserWeather(body)
        console.log(response.data.weather[0].main)

        setWeatherStatus(response.data.weather[0].main)



        const tempKelvin = response.data.main.temp;
        const tempCelsius = Math.round(tempKelvin - 273.15);
        
        console.log("Temperature in Celsius:", tempCelsius);
        setCelcius(tempCelsius);

      }
    
    } catch (error) {
      console.log("Error fetching weather:", error);
    }
  };

useEffect(()=>{
 getUserCurrentLocation();
 getCurrentDate();
 handleLoggedInUser();
},[])

useEffect(()=>{
  getCurrentUserWeather();
},[userCity, userSubregion])

  const handleShowPopularPlace = () =>{
    setPopularPlace(true);
    setRecommendedPlace(false)
  }

  const handleShowRecommendedPlace = () =>{
    setPopularPlace(false);
    setRecommendedPlace(true)
  }

  const popularPlaces = [
    {
      name: "Tartufo Ristorante",
      image: `${require("../../assets/tabs/img1.png")}`,
      km: "2.3 km",
      busyness: "red",
    },
    {
      name: "Tartufo Ristorante",
      image: `${require("../../assets/tabs/img2.png")}`,
      km: "2.3 km",
      busyness: "green",
    },
    {
      name: "Tartufo Ristorante",
      image: `${require("../../assets/tabs/img1.png")}`,
      km: "2.3 km",
      busyness: "red",
    },
  ];

  const popularPlaces2 = [
    {
      name: "Tartufo Ristorante",
      image: `${require("../../assets/tabs/img3.png")}`,
      km: "2.3 km",
      busyness: "yellow",
    },
    {
      name: "Tartufo Ristorante",
      image: `${require("../../assets/tabs/img4.png")}`,
      km: "2.3 km",
      busyness: "green",
    },
    {
      name: "Tartufo Ristorante",
      image: `${require("../../assets/tabs/img3.png")}`,
      km: "2.3 km",
      busyness: "yellow",
    },
  ];

  const recommendedPlaces = [
    {
      name: "Silent Cafe",
      image: `${require("../../assets/tabs/r1.png")}`,
      km: "1.3 km",
      busyness: "green",
    },
    {
      name: "GameZone",
      image: `${require("../../assets/tabs/r2.png")}`,
      km: "2.3",
      busyness: "green",
    },
    {
      name: "GameZone",
      image: `${require("../../assets/tabs/r1.png")}`,
      km: "2.3 km",
      busyness: "red",
    },
  ];

  const recommendedPlaces2 = [
    {
      name: "Manila Museum",
      image: `${require("../../assets/tabs/r3.png")}`,
      km: "2.3 km",
      busyness: "yellow",
    },
    {
      name: "Xaylo Club",
      image: `${require("../../assets/tabs/r4.png")}`,
      km: "2.3 km",
      busyness: "green",
    },
    {
      name: "Manila Museum",
      image: `${require("../../assets/tabs/r3.png")}`,
      km: "2.3 km",
      busyness: "yellow",
    },
  ];

  const recentPlaces = [
    {
      name: "Mall of Asia",
      address: "Antaro Mart, BSD City Tanggerang",
      distance: "1.7",
    },

    {
      name: "Starbucks Cafe",
      address: "Antaro Mart, BSD City Tanggerang",
      distance: "1.6",
    },
    {
      name: "Manila Museum",
      address: "Antaro Mart, BSD City Tanggerang",
      distance: "1.4",
    },
    {
      name: "Sky Library",
      address: "Antaro Mart, BSD City Tanggerang",
      distance: "1.3",
    },
  ];

  const goodPlaces = {
    coffee: [
      {
        title: "Quiet cafes for",
        subtitle: "your morning coffee",
        image: `${require("../../assets/tabs/cuate.png")}`,
        places: [
          // Changed from coffeePlace to coffeePlaces
          {
            name: "Forest Cafe",
            image: `${require("../../assets/tabs/c1.png")}`,
            km: "1.3",
            busyness: "green",
          },
          {
            name: "Green Coffee",
            image: `${require("../../assets/tabs/c2.png")}`,
            km: "5.3",
            busyness: "red",
          },
          {
            name: "Tartufo Ristorante",
            image: `${require("../../assets/tabs/img1.png")}`,
            km: "2.3",
            busyness: "red",
          },
        ],
      },
    ],
    lunch: [
      {
        title: "Perfect lunch spots",
        subtitle: "with moderate crowds",
        image: `${require("../../assets/tabs/pana.png")}`,
        places: [
          {
            name: "Foodbox Resto",
            image: `${require("../../assets/tabs/l1.png")}`,
            km: "1.3",
            busyness: "green",
          },
          {
            name: "Daff Pizza",
            image: `${require("../../assets/tabs/l2.png")}`,
            km: "5.3",
            busyness: "red",
          },
          {
            name: "Tartufo Ristorante",
            image: `${require("../../assets/tabs/img1.png")}`,
            km: "2.3",
            busyness: "red",
          },
        ],
      },
    ],
    dinner: [
      {
        title: "Popular dinner spots",
        subtitle: "that fill up quickly",
        image: `${require("../../assets/tabs/dinner.png")}`,
        places: [
          {
            name: "Happy Table",
            image: `${require("../../assets/tabs/d1.png")}`,
            km: "1.3",
            busyness: "green",
          },
          {
            name: "Smiley Dinner",
            image: `${require("../../assets/tabs/d2.png")}`,
            km: "5.3",
            busyness: "red",
          },
          {
            name: "Tartufo Ristorante",
            image: `${require("../../assets/tabs/img1.png")}`,
            km: "2.3",
            busyness: "red",
          },
        ],
      },
    ],
  };

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [goodPlace, setGoodPlace] = useState([]);
  const [isPM , setIsPm] = useState(false);

  const handleDayOrNight = () => {
    console.log("NICE");
    
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const isAM = currentHour < 12;
  
    setIsPm(!isAM); // Set isPM based on whether it's AM or PM
  
    // const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    // const formattedTime = currentTime.toLocaleString('en-US', options);
  }



  useEffect(() => {
    setGoodPlace(Object.values(goodPlaces)[currentCategoryIndex]);
    handleDayOrNight();
  }, [currentCategoryIndex]);

  const nextGoodPlaces = () => {
    const categories = Object.keys(goodPlaces);
    const lastIndex = categories.length - 1;
    if (currentCategoryIndex === lastIndex) {
      setCurrentCategoryIndex(0);
      return;
    } else {
      setCurrentCategoryIndex((prev) => prev + 1);
    }
  };

  const [locationsPermission, setLocationPermission] = useState(false);
  const [notificationsPermission, setNotificationsPermission] = useState(false);
  const [mapsPermission, setMapsPermission] = useState(false);
  const [messageSent, setMessageSent] = useState(false)

  return (
    <View className="flex-1 ">
      {/* <LocationPermission visible={locationsPermission} />
      <Notifications visible={notificationsPermission}/>
      <Maps visible={mapsPermission}/>
      <MessageSent visible={messageSent}/> */}
      <View className="">
        <View className=" w-full p-3 mt-14">
          <LinearGradient
            colors={["#007AFF", "#007AFF", "#1F41BB"]} // Use two colors for a clean gradient
            start={{ x: 0, y: 0 }} // Starting point of the gradient (left)
            end={{ x: 1, y: 0 }} // Ending point of the gradient (right)
            className="rounded-full shadow-lg shadow-gray-900"
          >
            <View className="flex-row items-center bg-transparent rounded-full p-1">
              <AntDesign
                name="search1"
                size={27}
                color="white"
                paddingLeft={5}
                onPress={getCurrentUserWeather}
              />
              <TextInput
                style={{ fontFamily: "PoppinsThin" }}
                className="flex-1 pl-2 py-1 text-gray-50 text-sm"
                placeholderTextColor="whitesmoke"
                placeholder="Where are you going to?"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </LinearGradient>
        </View>
      </View>

      <View className="flex-1 p-4 ">
        <ScrollView className="main-scrollview">
          <View className="mb-3">

           {/**DAY AND NIGHT */} 
          {isPM ?   
            <LinearGradient
              colors={["#536976", "#536976", "#292E49"]} // Use two colors for a clean gradient
              start={{ x: 0, y: 0 }} // Starting point of the gradient (left)
              end={{ x: 1, y: 0 }} // Ending point of the gradient (right)
              className="rounded-md shadow-lg shadow-gray-900"
            >
              <View className="flex-row justify-around items-center bg-transparent rounded-md p-2">
                <View>
                  <Text
                    style={{ fontFamily: "PoppinsThin" }}
                    className="text-white pl-1"
                  >
                    {dateToday}
                  </Text>
                  <View className="flex flex-row items-center gap-1">
                    <Entypo name="location-pin" size={14} color="white" />
                    <Text
                      style={{ fontFamily: "PoppinsThin" }}
                      className="text-white"
                    >
                      {userCity}, {userSubregion}
                    </Text>
                  </View>
                </View>

                <View className="mt-3">
                {weatherStatus === "Rain" ?  <Mooncloud/> : weatherStatus === "Clear" ?  <Moon/> :  <MoonLight/> }

                  <View className="relative mt-2">
                    <Text className="text-white text-4xl">{celcius}</Text>
                    <Image
                      className="absolute right-[-6] top-1"
                      source={require("../../assets/icons/cel.png")}
                    />
                  </View>
                </View>
              </View>
            </LinearGradient> :    
            <LinearGradient
              colors={["#6cabf8", "#6cabf8", "#7a91d9"]} // Use two colors for a clean gradient
              start={{ x: 0, y: 0 }} // Starting point of the gradient (left)
              end={{ x: 1, y: 0 }} // Ending point of the gradient (right)
              className="rounded-md shadow-lg shadow-gray-900"
            >
              <View className="flex-row justify-around items-center bg-transparent rounded-md p-2">
                <View>
                  <Text
                    style={{ fontFamily: "PoppinsThin" }}
                    className="text-white pl-1"
                  >
                    {dateToday}
                  </Text>
                  <View className="flex flex-row items-center gap-1">
                    <Entypo name="location-pin" size={14} color="white" />
                    <Text
                      style={{ fontFamily: "PoppinsThin" }}
                      className="text-white"
                    >
                      {userCity}, {userSubregion}
                    </Text>
                  </View>
                </View>

                <View className="mt-2"> 
                {weatherStatus === "Rain" ?  <Rain/> : weatherStatus === "Clear" ?  <Sun/> :  <Light/> }
                  <View className="relative mt-2">
                    <Text className="text-white text-4xl">{celcius}</Text>
                    <Image
                      className="absolute right-[-6] top-1"
                      source={require("../../assets/icons/cel.png")}
                    />
                  </View>
                </View>
              </View>
            </LinearGradient>}
         
          </View>

          {/**POPULAR AND RECOMMENDED */}
          <View className="flex flex-row gap-5 w-full mb-2">
            <Text
              style={{ fontFamily: "PoppinsMedium" }}
              className={`text-lg ${popularPace ? 'text-secondary' : ''}`}
              onPress={handleShowPopularPlace}
            >
              Popular Near you
            </Text>
            <Text onPress={handleShowRecommendedPlace} style={{ fontFamily: "PoppinsMedium" }}  className={`text-lg ${recommendedPlace ? 'text-secondary' : ''}`}>
              Recommended
            </Text>
          </View>

            {/**POPULAR*/}
        {popularPace ? 
          <View className="">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {popularPlaces.map((places, index) => (
              <View
                key={index}
                className="mr-2 rounded-3xl w-52 overflow-hidden"
              >
                <Image source={places.image} className="w-full h-32 " />
                <View className="bg-secondary flex flex-row justify-evenly py-2 rounded-b-2xl">
                  <Text
                    style={{ fontFamily: "PoppinsThin" }}
                    className="text-sm text-white"
                  >
                    {places.name}
                  </Text>
                  <View className="flex flex-row items-center">
                    <Text
                      style={{ fontFamily: "PoppinsThin" }}
                      className="text-sm text-white"
                    >
                      {places.km}
                    </Text>
                    <View
                      className={`w-3 h-3 rounded-full
${
  places.busyness === "red"
    ? "bg-red-500"
    : places.busyness === "yellow"
    ? "bg-yellow-300"
    : places.busyness === "green"
    ? "bg-green-500"
    : ""
} ml-1`}
                    />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "center" }}
            className="mt-2"
          >
            {popularPlaces2.map((places, index) => (
              <View
                key={index}
                className="mr-2 rounded-3xl w-52 overflow-hidden"
              >
                <Image source={places.image} className="w-full h-32 " />
                <View className="bg-secondary flex flex-row justify-evenly py-2 rounded-b-2xl">
                  <Text
                    style={{ fontFamily: "PoppinsThin" }}
                    className="text-sm text-white"
                  >
                    {places.name}
                  </Text>
                  <View className="flex flex-row items-center">
                    <Text
                      style={{ fontFamily: "PoppinsThin" }}
                      className="text-sm text-white"
                    >
                      {places.km}
                    </Text>
                    <View
                      className={`w-3 h-3 rounded-full
${
  places.busyness === "red"
    ? "bg-red-500"
    : places.busyness === "yellow"
    ? "bg-yellow-300"
    : places.busyness === "green"
    ? "bg-green-500"
    : ""
} ml-1`}
                    />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>: ''  
      }


            {/**RECOMMENDED*/}
          {recommendedPlace ? 
            <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: "center" }}
            >
              {recommendedPlaces.map((places, index) => (
                <View
                  key={index}
                  className="mr-2 rounded-3xl w-52 overflow-hidden"
                >
                  <Image source={places.image} className="w-full h-32 " />
                  <View className="bg-secondary flex flex-row justify-evenly py-2 rounded-b-2xl">
                    <Text
                      style={{ fontFamily: "PoppinsThin" }}
                      className="text-sm text-white"
                    >
                      {places.name}
                    </Text>
                    <View className="flex flex-row items-center">
                      <Text
                        style={{ fontFamily: "PoppinsThin" }}
                        className="text-sm text-white"
                      >
                        {places.km}
                      </Text>
                      <View
                        className={`w-3 h-3 rounded-full
  ${
    places.busyness === "red"
      ? "bg-red-500"
      : places.busyness === "yellow"
      ? "bg-yellow-300"
      : places.busyness === "green"
      ? "bg-green-500"
      : ""
  } ml-1`}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: "center" }}
              className="mt-2"
            >
              {recommendedPlaces2.map((places, index) => (
                <View
                  key={index}
                  className="mr-2 rounded-3xl w-52 overflow-hidden"
                >
                  <Image source={places.image} className="w-full h-32 " />
                  <View className="bg-secondary flex flex-row justify-evenly py-2 rounded-b-2xl">
                    <Text
                      style={{ fontFamily: "PoppinsThin" }}
                      className="text-sm text-white"
                    >
                      {places.name}
                    </Text>
                    <View className="flex flex-row items-center">
                      <Text
                        style={{ fontFamily: "PoppinsThin" }}
                        className="text-sm text-white"
                      >
                        {places.km}
                      </Text>
                      <View
                        className={`w-3 h-3 rounded-full
  ${
    places.busyness === "red"
      ? "bg-red-500"
      : places.busyness === "yellow"
      ? "bg-yellow-300"
      : places.busyness === "green"
      ? "bg-green-500"
      : ""
  } ml-1`}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View> : ''  
        }

          <View className="flex-1 w-full mt-5 ">
            <Text style={{ fontFamily: "PoppinsThin" }} className="text-xl">
              Recents Searches
            </Text>

            <View className="">
              {recentPlaces.map((recent, index) => (
                <View
                  key={index}
                  className="flex flex-row mt-2 w-full justify-center gap-3 py-3"
                >
                  <View className=" rounded-full justify-center">
                    <Image
                      source={require("../../assets/tabs/Location.png")}
                      className="h-10 w-10"
                    />
                  </View>
                  <View className="w-56">
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
                    style={{ fontFamily: "PoppinsBold" }}
                    className="text-md"
                  >
                    {recent.distance}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {goodPlace.length > 0 && (
            <View key={currentCategoryIndex} className="flex-1 mt-4 mb-8">
              <View className="flex-row items-center gap-4 flex-1 relative">
                <View className="absolute right-0 top-0">
                  <Pressable onPress={nextGoodPlaces}>
                    <AntDesign name="arrowright" size={26} color="#007AFF" />
                  </Pressable>
                </View>
                <Image source={goodPlace[0].image} className="h-26" />
                <View>
                  <Text
                    style={{ fontFamily: "PoppinsBold" }}
                    className="text-lg break-words text-secondary"
                  >
                    “{goodPlace[0].title}
                  </Text>
                  <Text
                    style={{ fontFamily: "PoppinsBold" }}
                    className="text-lg break-words text-secondary"
                  >
                    {goodPlace[0].subtitle}”
                  </Text>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: "center" }}
                className="mt-3"
              >
                {goodPlace[0].places.map((currentplace, idx) => (
                  <View
                    key={idx}
                    className="mr-2 rounded-3xl w-52 overflow-hidden"
                  >
                    <Image
                      source={currentplace.image}
                      className="w-full h-32 "
                    />
                    <View className="bg-secondary flex flex-row justify-between pl-4 pr-3 py-2 rounded-b-xl">
                      <Text
                        style={{ fontFamily: "PoppinsThin" }}
                        className="text-sm text-white"
                      >
                        {currentplace.name}
                      </Text>
                      <View className="flex flex-row items-center">
                        <Text
                          style={{ fontFamily: "PoppinsThin" }}
                          className="text-sm text-white"
                        >
                          {currentplace.km}
                        </Text>
                        <View
                          className={`w-3 h-3 rounded-full ${
                            currentplace.busyness === "red"
                              ? "bg-red-500"
                              : currentplace.busyness === "yellow"
                              ? "bg-yellow-300"
                              : currentplace.busyness === "green"
                              ? "bg-green-500"
                              : ""
                          } ml-1`}
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          <View className=" flex-1 mb-20">
            <Text style={{ fontFamily: "PoppinsThin" }} className="text-xl">
              Events Near You
            </Text>
            <View className="flex-1">
              <View className="rounded-3xl p-2 mt-4 bg-white shadow-lg shadow-gray-700">
                <View className="flex-row justify-around gap-3 items-center bg-transparent rounded-md p-2">
                  <Image
                    source={require("../../assets/tabs/n1.png")}
                    style={{ borderRadius: 16, height: 128 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{ fontFamily: "PoppinsMedium", fontSize: 12 }}
                      className="text-secondary"
                    >
                      1st May - Sat - 2:00 PM
                    </Text>
                    <Text style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
                      Networking & Sharing Club
                    </Text>
                  </View>
                </View>
              </View>
              <View className="rounded-3xl p-2 mt-4 bg-white shadow-lg shadow-gray-700">
                <View className="flex-row justify-around gap-3 items-center bg-transparent rounded-md p-2">
                  <Image
                    source={require("../../assets/tabs/n2.png")}
                    style={{ borderRadius: 16, height: 128 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{ fontFamily: "PoppinsMedium", fontSize: 12 }}
                      className="text-secondary"
                    >
                      24th June- Sun -1:00 PM
                    </Text>
                    <Text style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
                      Mobile Legends Championship
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View className="flex-1 justify-center items-center mt-10">
              <Text
                className="text-lg text-secondary"
                style={{ fontFamily: "PoppinsBold" }}
              >
                Community Picks: Tips & Reviews
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
                  placeholderTextColor="gray"
                  placeholder="“Share your tips or reviews about the spot!”"
                  onChangeText={setSearchText}
                />
               <Text className="absolute right-3 bottom-2"> <NextSvg /></Text>
              </View>
            </View>

            <View className="flex flex-col mt-1">
              <View className="flex-row gap-2 mt-2">
                <Text
                  style={{ fontFamily: "PoppinsThin" }}
                  className="absolute right-1 text-gray-500 text-md"
                >
                  20 Sept
                </Text>
                <Image source={require("../../assets/tabs/p1.png")} />
                <View className="flex-1">
                  <Text
                    style={{ fontFamily: "PoppinsThin" }}
                    className="text-xl text-secondary"
                  >
                    Samantha Smith
                  </Text>
                  <Text
                    style={{ fontFamily: "PoppinsMedium" }}
                    className="text-md"
                  >
                    “Sky Cafe - The food was good and the cafe has a great
                    ambiance!”
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-2 mt-2">
                <Text
                  style={{ fontFamily: "PoppinsThin" }}
                  className="absolute right-1 text-gray-500 text-md"
                >
                  10 June
                </Text>
                <Image source={require("../../assets/tabs/p2.png")} />
                <View className="flex-1">
                  <Text
                    style={{ fontFamily: "PoppinsThin" }}
                    className="text-xl text-secondary"
                  >
                    John Doe Rizzo
                  </Text>
                  <Text
                    style={{ fontFamily: "PoppinsMedium" }}
                    className="text-md"
                  >
                    “Sunset Park - Be sure to visit, you'll definitely enjoy the
                    sunset!”
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Home;
