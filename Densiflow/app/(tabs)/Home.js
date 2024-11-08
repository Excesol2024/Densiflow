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
  ActivityIndicator,
  Modal,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import NextSvg from "../../components/svg/next";
import * as Location from 'expo-location';
import { API } from "../../components/Protected/Api";
import Notif from "../../components/svg/Notif"

import { AuthenticatedContext } from "../../context/Authenticateduser";
import { LoadingEffectsContext } from "../../context/Loadingeffect";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";




const Home =  () => {
  const [searchText, setSearchText] = useState("");
  const [userCity, setUserCity] = useState('');
  const [userSubregion, setUserSubregion] = useState('');
  const [dateToday, setDateToday] = useState('')
  const [celcius, setCelcius] = useState('')
  const [weatherStatus, setWeatherStatus] = useState('')
  const {   handleLoggedInUser, setSubscribed, currentUser } = useContext(AuthenticatedContext);
  
  const getCurrentDate = () => {
    const today = new Date();
    const options = { weekday: 'long', month: 'long', day: '2-digit' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    setDateToday(formattedDate)
    return formattedDate;
  };

  const [popularPlaces, setPopularPlaces] = useState([])
  const [recommendedPlaces, setRecommendedPlaces] = useState([])

  const handleGetPopularPlaces = async () => {
    try {
      const response = await API.getPopularPlacess();
      setPopularPlaces(response.data)
     
    } catch (error) {
      console.log(error)
    }
  }

  const handleGetRecommendedPlaces = async () => {
    try {
      const response = await API.getRecommededPlaces();
      setRecommendedPlaces(response.data)
     
    } catch (error) {
      console.log(error)
    }
  }

  const getUserCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied');
      return;
    }
  
    let { coords } = await Location.getCurrentPositionAsync();
    
    if (coords) {
      const { latitude, longitude } = coords;
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
        setWeatherStatus(response.data.weather[0].main)
        handleLoggedInUser();
        const tempKelvin = response.data.main.temp;
        const tempCelsius = Math.round(tempKelvin - 273.15);
        setCelcius(tempCelsius);

      }
    
    } catch (error) {
      console.log("Error fetching weather:", error);
    }
  };

  const handleIsSelectingGender = () =>{
    if (currentUser?.user.gender === "male") {
      setIsSelectingGender(true)
    } else {
      console.log("FEMALE")
    }
  }

useEffect(()=>{
  handleIsSelectingGender();
 getUserCurrentLocation();
 getCurrentDate();
},[])

useEffect(()=>{
  // handleGetPopularPlaces();
  // handleGetRecommendedPlaces();
updatePlaceBasedOnTime();
},[])

useEffect(()=>{
  getCurrentUserWeather();
  handleDayOrNight();
},[])




 

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
            crowd_status: "low",
          },
          {
            name: "Green Coffee",
            image: `${require("../../assets/tabs/c2.png")}`,
            km: "5.3",
            crowd_status: "high",
          },
          {
            name: "Tartufo Ristorante",
            image: `${require("../../assets/tabs/img1.png")}`,
            km: "2.3",
            crowd_status: "medium",
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
            crowd_status: "low",
          },
          {
            name: "Daff Pizza",
            image: `${require("../../assets/tabs/l2.png")}`,
            km: "5.3",
            crowd_status: "high",
          },
          {
            name: "Tartufo Ristorante",
            image: `${require("../../assets/tabs/img1.png")}`,
            km: "2.3",
            crowd_status: "yellow",
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
            crowd_status: "low",
          },
          {
            name: "Smiley Dinner",
            image: `${require("../../assets/tabs/d2.png")}`,
            km: "5.3",
            crowd_status: "high",
          },
          {
            name: "Tartufo Ristorante",
            image: `${require("../../assets/tabs/img1.png")}`,
            km: "2.3",
            crowd_status: "medium",
          },
        ],
      },
    ],
  };


  const [isPM , setIsPm] = useState(false);

  const handleDayOrNight = () => {
   
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const isAM = currentHour < 12;
  
    setIsPm(!isAM); // Set isPM based on whether it's AM or PM
  
    // const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    // const formattedTime = currentTime.toLocaleString('en-US', options);
  }



  const [goodPlace, setGoodPlace] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("coffee");
  const [suggestedGoodPlace, setSuggestedGoodPlace] = useState([])
  
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
      setSuggestedGoodPlace(response.data)
    } catch (error) {
      console.log(error)
    }
  };

  
  useEffect(() => {
    setGoodPlace(goodPlaces[currentCategory]);
  }, [currentCategory]);




  const [locationsPermission, setLocationPermission] = useState(false);
  const [notificationsPermission, setNotificationsPermission] = useState(false);
  const [mapsPermission, setMapsPermission] = useState(false);
  const [messageSent, setMessageSent] = useState(false)
  const { setMapLocation, setIsSelectingGender, setIsSearching } = useContext(LoadingEffectsContext)
 
  const handleSearchFocus = () =>{
    setIsSearching(true)
  }

  const handleSelectedPlacesToNavigate = (place) =>{
    console.log("SELECTD PLACE", place.kilometers)
    handleRecentVisited(place.name, place.vicinity, place.kilometers,  place.location.lat,  place.location.lng)
    setMapLocation({
      lat: place.location.lat,
      long: place.location.lng
    })
    router.push('/Map')
   
  }





  const handleSelectedSearchedPlaceToNavigate = (place) =>{
    console.log("SELECTD PLACE", place.kilometers)
    handleRecentVisited(place.name, place.vicinity, place.kilometers,  place.location.lat,  place.location.lng)
   setMapLocation({
     lat: place.location.lat,
     long: place.location.lng
   })
   router.push('/Map')
  }


  const handleRecentVisited = async (name, address, km, lat, long) => {
    try {
      // Retrieve the current list of recent visits from AsyncStorage
      const existingVisits = await AsyncStorage.getItem('recentVisited');
      let visits = existingVisits ? JSON.parse(existingVisits) : [];
  
      // Create a new visit object
      const newVisit = { name, address, km, lat, long };
  
      // Check if the visit is already in the list
      const isDuplicate = visits.some(
        (visit) => visit.name === newVisit.name && visit.address === newVisit.address
      );
  
      // If it's a duplicate, do not add it to the list
      if (isDuplicate) {
        console.log('Visit already exists in recent visits');
        return;
      }
  
      // Add the new visit to the beginning of the list if it's not a duplicate
      visits.unshift(newVisit);
  
      // Limit the list to 4 items
      if (visits.length > 4) {
        visits.pop(); // Remove the last (oldest) visit
      }
  
      // Save the updated list back to AsyncStorage
      await AsyncStorage.setItem('recentVisited', JSON.stringify(visits));
      console.log('Recent visit saved successfully');
      getRecentVisited();
    } catch (error) {
      console.error('Failed to save recent visit:', error);
    }
  };

  const [recentVisited, setRecentVisited] = useState([])

  const getRecentVisited = async () => {
    try {
      const recentVisited = await AsyncStorage.getItem('recentVisited');
      if (recentVisited) {
        const visits = JSON.parse(recentVisited);
        console.log("RECENT VISITED", visits)
        setRecentVisited(visits)
      }
    } catch (error) {
      console.error('Failed to retrieve recent visits:', error);
    }
  };

  useEffect(()=>{
    getRecentVisited();
  },[])

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
            <Notif/>
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
              {isPM ? ( weatherStatus === "Rain" ?  <Image source={require('../../assets/weather/rain.png')} className="w-10 h-8"/> : 
              weatherStatus === "Clouds" ?  <Image source={require('../../assets/weather/moonlight.png')} className="w-10 h-8"/> : 
              weatherStatus === "Thunderstorm" ?  <Image source={require('../../assets/weather/thunder.png')} className="w-10 h-8"/> :  <Image source={require('../../assets/weather/cloudy.png')} className="w-10 h-8"/>  ) : 
              (weatherStatus === "Rain" ?  <Image source={require('../../assets/weather/rainyday.png')} className="w-10 h-8"/> : 
              weatherStatus === "Clouds" ?  <Image source={require('../../assets/weather/cloudy.png')} className="w-10 h-8"/> : 
              weatherStatus === "Thunderstorm" ?  <Image source={require('../../assets/weather/thunder.png')} className="w-10 h-8"/> :  <Image source={require('../../assets/weather/sunny.png')} className="w-10 h-8"/>  ) }
            <Text style={{fontFamily: "PoppinsBold"}}>{celcius}°</Text>
          </View>
       </View>
<View>
<View 
            className="rounded-full shadow-lg shadow-gray-900 bg-white"
          >
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
                <Text style={{fontFamily: "PoppinsBold"}} className="text-white text-lg">Welcome Everyone!</Text>
                <Text style={{fontFamily: "PoppinsBold"}} className="text-white text-lg">Our Website is ready!</Text>
                <Pressable className="bg-black w-24 items-center p-2 mt-2  rounded-full">
                  <Text style={{fontFamily: "PoppinsMedium"}} className="text-white ">Visit Now</Text>
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
              <Text className="text-lg" style={{fontFamily: "PoppinsBold"}}>Popular Near you</Text>
              <Text onPress={()=> router.push('/places/Poppular')} className="text-lg text-secondary" style={{fontFamily: "PoppinsBold"}}>See all</Text>
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
                onPress={()=>handleSelectedPlacesToNavigate(places)}
              >
                <View className="rounded-xl overflow-hidden w-48 h-36">
                <Image source={{uri: `${places.image_url}`}} className="w-full h-full " />
                </View>
                <View className=" flex pl-2">
                <Text
  style={{ fontFamily: "PoppinsBold", width: 140 }}  // Adjust the width as needed
  className="text-md mt-2"
  numberOfLines={1}               // Limit to one line
  ellipsizeMode="tail"            // Adds the ellipsis at the end
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
              <Text className="text-lg" style={{fontFamily: "PoppinsBold"}}>Recommended</Text>
              <Text onPress={()=> router.push('/places/Recommended')} className="text-lg text-secondary" style={{fontFamily: "PoppinsBold"}}>See all</Text>
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
                onPress={()=>handleSelectedPlacesToNavigate(places)}
              >
                <View className="rounded-xl overflow-hidden w-48 h-36">
                <Image source={{uri: `${places.image_url}`}} className="w-full h-full " />
                </View>
                <View className=" flex pl-2">
                <Text
  style={{ fontFamily: "PoppinsBold", width: 140 }}  // Adjust the width as needed
  className="text-md mt-2"
  numberOfLines={1}               // Limit to one line
  ellipsizeMode="tail"            // Adds the ellipsis at the end
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
             {recentVisited.length > 0 ? 
              (recentVisited?.map((recent, index) => (
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
              ))) : <Text  style={{ fontFamily: "PoppinsThin" }}
              className="text-lg mt-3 mb-10 text-gray-400 text-center" >No recent Visited Places</Text> }
            </View>
          </View>

          {goodPlace.length > 0 && (
      <View key={currentCategory} className="flex-1 mt-4 mb-8">
        <View className="flex-row items-center gap-4 flex-1 relative">
          <Image source={goodPlace[0].image} className="h-26" />
          <View>
            <Text onPress={()=> console.log(goodPlace)}
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
                onPress={()=>handleSelectedPlacesToNavigate(places)}
              >
                <View className="rounded-xl overflow-hidden w-48 h-36">
                {/* <Image source={{uri: `${places.image_url}`}} className="w-full h-full " /> */}
                <Image source={{uri: places.image_url}} className="w-full h-full " />
                </View>
                <View className=" flex pl-2">
                <Text
  style={{ fontFamily: "PoppinsBold", width: 140 }}  // Adjust the width as needed
  className="text-md mt-2"
  numberOfLines={1}               // Limit to one line
  ellipsizeMode="tail"            // Adds the ellipsis at the end
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
                     The first day of the year, a time for family
gatherings and celebrations, marking
the start of the new calendar year.
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
    The first day of the year, a time for family
gatherings and celebrations, marking
the start of the new calendar year.
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
                  placeholderTextColor="gray"
                  placeholder="“Share your tips or reviews about the spot!”"
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
    </SafeAreaView>
  );
};

export default Home;
