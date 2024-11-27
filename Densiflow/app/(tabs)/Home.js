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

  const nationalHoliday = [
    {
      "name": "New Year's Day",
      "date": "January 1",
      "day": "Wednesday",
      "description": "The first day of the year, a time for family gatherings and celebrations, marking the start of the new calendar year.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FNew%20Year.png?alt=media&token=d8967cad-9739-4084-9134-5113aa6307c5"
    },
    {
      "name": "Chinese New Year",
      "date": "January 29",
      "day": "Wednesday",
      "description": "Celebrated by the Filipino-Chinese community with dragon dances, fireworks, and family reunions. It follows the lunar calendar.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FChinese%20New%20Year.png?alt=media&token=8236007f-aaae-4979-a0f8-9002ef2446b4"
    },
    {
      "name": "EDSA Revolution Anniversary",
      "date": "February 25",
      "day": "Tuesday",
      "description": "Commemorates the 1986 People Power Revolution, which restored democracy in the Philippines after the Marcos dictatorship.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FEDSA%20Revolution%20Anniversary.png?alt=media&token=cafca55a-a8d5-44b9-94c4-160c4e47d5d1"
    },
    {
      "name": "Araw ng Kagitingan (Day of Valor)",
      "date": "April 9",
      "day": "Wednesday",
      "description": "Honors the bravery of Filipino and American soldiers who fought during World War II, especially in the Battle of Bataan.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FAraw%20ng%20Kagitingan.png?alt=media&token=f1af8115-ab59-4c00-ad3e-5634f340452d"
    },
    {
      "name": "Maundy Thursday",
      "date": "April 17",
      "day": "Thursday",
      "description": "Part of Holy Week, commemorating the Last Supper of Jesus Christ with His apostles.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FMaundy%20Thursday.png?alt=media&token=ab1ddc15-c438-464b-babe-30250222e1d1"
    },
    {
      "name": "Good Friday",
      "date": "April 18",
      "day": "Friday",
      "description": "The solemn day marking the crucifixion and death of Jesus Christ, observed with religious processions and devotions.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FGood%20Friday.png?alt=media&token=62305c30-3a8d-4a8e-bf9c-57fc3d1c2de3"
    },
    {
      "name": "Labor Day",
      "date": "May 1",
      "day": "Thursday",
      "description": "Honors workers and laborers, often marked with rallies and celebrations of workers' rights.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FLabor%20Day.png?alt=media&token=d6518fa7-d31a-41d6-94b8-0b992d9b6f37"
    },
    {
      "name": "Independence Day",
      "date": "June 12",
      "day": "Thursday",
      "description": "Commemorates the Philippine Declaration of Independence from Spain in 1898, celebrated with parades and flag-raising ceremonies.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FIndependence%20Day.png?alt=media&token=9df2e2d1-cdc3-4a4c-9b61-2b546ef6e28a"
    },
    {
      "name": "Ninoy Aquino Day",
      "date": "August 21",
      "day": "Thursday",
      "description": "Honors Senator Benigno 'Ninoy' Aquino Jr., a key figure in the fight for democracy, who was assassinated in 1983.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FNinoy%20Aquino%20Day.png?alt=media&token=c84fe5b0-603d-49e8-9d31-c0e615375a8b"
    },
    {
      "name": "National Heroes Day",
      "date": "August 25",
      "day": "Monday",
      "description": "A day to honor the country's national heroes, both known and unsung, who fought for the Philippines' independence and freedom.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FNational%20Heroes%20Day.png?alt=media&token=c65a461d-0306-4b96-908c-6753a2c0ec49"
    },
    {
      "name": "Bonifacio Day",
      "date": "November 30",
      "day": "Sunday",
      "description": "Celebrates the birth of Andres Bonifacio, a Filipino revolutionary leader and founder of the Katipunan, which led the struggle against Spanish colonization.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FBonifacio%20Day.png?alt=media&token=12061021-a7d5-4ae9-9b71-6ffa4671b9eb"
    },
    {
      "name": "Immaculate Conception",
      "date": "December 8",
      "day": "Monday",
      "description": "A Catholic feast day celebrating the belief in the Immaculate Conception of the Virgin Mary, a major religious holiday in the Philippines.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FImmaculate%20Conception.png?alt=media&token=d21b581f-5a53-44cc-8603-9a9c73aa1a2e"
    },
    {
      "name": "Christmas Day",
      "date": "December 25",
      "day": "Thursday",
      "description": "The most important Christian holiday celebrating the birth of Jesus Christ, marked by family reunions, gift-giving, and church services.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FChristmas%20Day.png?alt=media&token=8404a026-0132-4d9f-8c49-2e0aa5c129ff"
    },
    {
      "name": "Rizal Day",
      "date": "December 30",
      "day": "Tuesday",
      "description": "Honors Dr. Jose Rizal, the national hero of the Philippines, who was executed by Spanish colonial authorities in 1896 for his role in advocating reforms for Filipino rights.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FRizal%20Day.png?alt=media&token=70400596-5ede-4d51-b574-f6a518c273b1"
    }
  ]
  

  const majorFestivals = [
    {
      "name": "Sinulog Festival",
      "date": "January 19",
      "day": "Sunday",
      "location": "Cebu City",
      "description": "A cultural and religious festival honoring the Santo Niño.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FSinulog%20Festival.png?alt=media&token=33305a31-fe61-4b02-8fa5-879980636c7b",
      "other_information": [
        "Expect major road closures along Osmeña Boulevard on the weekend of the main festival day (January 19).",
        "Streets such as Mango Avenue and General Maxilom Avenue will be very busy with street vendors and spectators.",
        "Establishments may be open but expect long wait times due to the influx of visitors.",
        "Hotels and restaurants near Fuente Osmeña Circle are often fully booked.",
        "Suggested routes to avoid traffic include side streets leading away from Fuente Osmeña."
      ]
    },
    {
      "name": "Dinagyang Festival",
      "date": "January 26",
      "day": "Sunday",
      "location": "Iloilo City",
      "description": "Celebrates the arrival of Malay settlers and the Santo Niño.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FDinagyang%20Festival.png?alt=media&token=d2bfef18-2162-4217-99e5-bd82e28757e8",
      "other_information": [
        "Diversion Road and adjacent areas will be closed to traffic during the street parades.",
        "Traffic builds up around Mandurriao and City Proper districts.",
        "Establishments along the parade routes may have limited hours but remain open.",
        "Public transport reroutes during the parade; avoid major streets near Freedom Grandstand to save travel time."
      ]
    },
    {
      "name": "Panagbenga Festival",
      "date": "February (whole month)",
      "location": "Baguio City",
      "description": "Also known as the Flower Festival, it features floats and street parades.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FPanagbenga%20Festival.png?alt=media&token=b15dfdf8-aee7-4d9a-adce-337cd616a045",
      "other_information": [
        "Session Road is typically closed for the street parade and float parade, and heavy traffic extends to neighboring roads like Magsaysay Avenue.",
        "Expect all major hotels to be fully booked, and restaurants around Burnham Park and SM City Baguio to be packed with visitors.",
        "Parking is limited, so it’s recommended to avoid driving along Session Road and take public transportation."
      ]
    },
    {
      "name": "Ati-Atihan Festival",
      "date": "January 15-21",
      "location": "Kalibo, Aklan",
      "description": "A week-long celebration honoring the Santo Niño, with vibrant street dancing.",
      "image_url": "",
      "other_information": [
        "Road closures around Pastrana Park occur during street parades and religious processions.",
        "Streets like Martelino and Roxas Avenue get congested.",
        "Establishments generally remain open, though parking is difficult, especially near the Kalibo Cathedral area."
      ]
    },
    {
      "name": "Pahiyas Festival",
      "date": "May 15",
      "location": "Lucban, Quezon",
      "description": "A thanksgiving festival for a bountiful harvest, known for colorful decorated houses.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FAti-Atihan%20Festival.png?alt=media&token=06944d41-8e04-4d57-985d-97ff2cf19ed1",
      "other_information": [
        "Major streets such as Rizal and Quezon Avenue will be filled with stalls and decorated homes, so expect heavy foot traffic.",
        "Road closures are expected along the main route, particularly near Lucban Church.",
        "Establishments generally stay open but might experience higher-than-usual demand.",
        "Parking spaces are rare, and the town center is closed off to vehicles during the festivities."
      ]
    },
    {
      "name": "Kadayawan Festival",
      "date": "August 18-24",
      "location": "Davao City",
      "description": "Celebrates the bountiful harvest and the city's indigenous cultures.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FKadayawan%20Festival.png?alt=media&token=3d5b2731-20b6-467f-9cad-eaf5a1c3fa29",
      "other_information": [
        "Roxas Avenue and San Pedro Street will be closed for parades and cultural events, so alternate routes such as Quirino Avenue will be busy.",
        "Most establishments along the main routes remain open, but expect crowds and long waits.",
        "Public transportation reroutes are common. It is advisable to take public transport rather than driving."
      ]
    },
    {
      "name": "Araw ng Digos",
      "date": "September 8",
      "location": "Digos City, Davao del Sur",
      "description": "Commemorates the founding anniversary of Digos City with parades, sports, and cultural events.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FAraw%20ng%20Digos.png?alt=media&token=afa5b192-783b-41b7-86e8-56a376e3eb6e",
      "other_information": [
        "Road closures are minimal but expect high activity along Rizal Avenue due to parades and sports events.",
        "Establishments remain open but may close earlier than usual during the town celebrations.",
        "Consider avoiding Digos City Park, as this area is crowded with events throughout the day."
      ]
    },
    {
      "name": "MassKara Festival",
      "date": "October 19",
      "location": "Bacolod City",
      "description": "Known as the festival of smiles, it features street dancing with colorful masks.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FMassKara%20Festival.png?alt=media&token=42f5453e-de5e-4399-b340-105fa54e6ca8",
      "other_information": [
        "Lacson Street is closed for parades and street parties, often during the weekend closest to October 19.",
        "Establishments remain open, especially restaurants, which are typically filled with locals and tourists.",
        "Public transport and alternative routes around Lacson Street should be considered to avoid long delays."
      ]
    },
    {
      "name": "Pintados Festival",
      "date": "June 29",
      "location": "Tacloban City, Leyte",
      "description": "Celebrates the body-painting traditions of ancient Visayans, with parades and dances.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FPintados%20Festival.png?alt=media&token=55f9b645-2827-4252-af87-bb62c2026a6b",
      "other_information": [
        "The parade route includes major roads leading to Balyuan Park, so traffic diversions are common around the festival period.",
        "Establishments near the parade route remain open, but expect heavy crowds and limited parking availability.",
        "Consider using public transportation or walking within the city center."
      ]
    },
    {
      "name": "Giant Lantern Festival",
      "date": "December (varies, usually mid-month)",
      "location": "San Fernando, Pampanga",
      "description": "A festival featuring giant, colorful lanterns in a competition.",
      "image_url": "https://firebasestorage.googleapis.com/v0/b/densiflowapp.appspot.com/o/events%2FGiant%20Lantern%20Festival.png?alt=media&token=57b8bdbf-7b48-49f3-ad08-44bee3343697",
      "other_information": [
        "Traffic congestion is expected near Robinsons Starmills, where the festival is held.",
        "Traffic management is typically implemented, so avoid driving in the vicinity.",
        "Establishments within malls and nearby restaurants stay open, but seating is often limited due to the high number of visitors.",
        "Public transportation is recommended as parking space near the venue is very limited."
      ]
    }
  ]
  

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
              {happeningToday.length > 0 ? 
           happeningToday.map((item, index)=> (
            <View className="flex-row bg-white rounded-xl p-3 mt-3 shadow-lg shadow-gray-700 items-center">
            <Image
              className="w-24 h-28 rounded-xl"
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/exceproducts.appspot.com/o/n1.png?alt=media&token=1b760e14-65e7-4adb-aa26-ee5ddf2946fc",
              }}
            />
            <View className="ml-2 flex-1">
              <Text className="text-lg" style={{ fontFamily: "PoppinsBold" }}>
                New Year's Day
              </Text>
              <Text style={{ fontFamily: "PoppinsMedium" }}>
                The first day of the year, a time for family gatherings and
                celebrations, marking the start of the new calendar year.
              </Text>
            </View>
          </View>
           )) :        <Text
              style={{ fontFamily: "PoppinsMedium" }}
              className="text-lg text-center mt-4 text-gray-400"
            >
              No events today, but your area has so much to offer! Try exploring
              some popular spots.
            </Text>}
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
