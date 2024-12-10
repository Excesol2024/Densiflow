import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState, useContext, useEffect } from "react";
import Image1 from "../../assets/tabs/img1.png";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from "@expo/vector-icons/Fontisto";
import Checkbox from "expo-checkbox";
import Kilometer from "../../components/svg/Kilometer";
import Bookmark from "../../components/svg/Bookmark";
import Bookmarks from "../../components/svg/Bookmarks";
import Alert from "../../components/svg/Alert";
import Plus from "../../components/svg/map/Plus";
import Minus from "../../components/svg/map/Minus";
import Mapviews from "../../components/svg/map/Mapview";
import Locate from "../../components/svg/map/Locate";
import MapView, { Marker, Polygon } from "react-native-maps";
import axios from "axios";
import { AuthenticatedContext } from "../../context/Authenticateduser";
import { API } from "../../components/Protected/Api";
import { LoadingEffectsContext } from "../../context/Loadingeffect";
import RedNotif from "../../components/svg/RedNotif";
import Reviews from "../../components/svg/Reviews";
import Reviewed from "../../components/svg/Reviewed";
import { useRouter } from "expo-router";

const Map = () => {
  const mapRef = useRef(null);
  const { currentUser } = useContext(AuthenticatedContext);
  const [placeFocus, setPlacesFocus] = useState("");
  const [placesTypes, setPlacesTypes] = useState([]);
  const [isAlreadyNotify, setIsAlreadyNotify] = useState(false)

  const [isAlreadyReview, setIsAlreadyReview] = useState(false)
  const router = useRouter();

  const {
    mapLocation,
    setMapLocation,
    setIsSelectingMap,
    selectedMap,
    setIsSearching,
    isSearching,
    setIsSaved,
    nearbyPlaceTypes,
    setNearbyPlaceTypes,
    handleSelectedPlaceToNotif,
    setIsReviewing,
    handleSelectedPlaceToReview
  } = useContext(LoadingEffectsContext);

  const handleSettingUpReviews = (placedetails) =>{
    setIsReviewing(true)
    console.log(placedetails)
  }

  const newMapLat = parseFloat(mapLocation.location?.lat);
  const newMapLong = parseFloat(mapLocation.location?.lng);

  // Check if newMapLat and newMapLong are valid numbers
  const isValidLocation = !isNaN(newMapLat) && !isNaN(newMapLong);

  // Define boundary coordinates based on newMapLat and newMapLong if valid
  // const cityBoundaryCoordinates = isValidLocation ? [
  //   { latitude: newMapLat + 0.01, longitude: newMapLong + 0.01 },
  //   { latitude: newMapLat + 0.01, longitude: newMapLong - 0.01 },
  //   { latitude: newMapLat - 0.01, longitude: newMapLong - 0.01 },
  //   { latitude: newMapLat - 0.01, longitude: newMapLong + 0.01 },
  //   { latitude: newMapLat + 0.01, longitude: newMapLong + 0.01 }, // Close the loop
  // ] : [];

  const plainMapStyle = [
    {
      featureType: "poi", // Hides POI (points of interest) icons
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit.station", // Hides transit icons
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road", // Optionally, hide road icons
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
  ];

  const checkIfPlaceIsSavedAndNotify = async () => {
    console.log("CHECKING PLACE", mapLocation.place_id)
    try {
      const response = await API.findPlaceSavedNotifReview({ query: placesDetails.place_id})
      console.log("RESPONSE DATA", response.data.reviewed)
      setIsAlreadySaved(response.data.saved);
      setIsAlreadyNotify(response.data.in_notifications);
      setIsAlreadyReview(response.data.reviewed);
      setIsClicked(true);
      setSelectedPlaceTypes(placesDetails)
    } catch (error) {
      console.error("Error checking place and notifications:", error);
    }
  };

  useEffect(() => {
    if (isValidLocation) {
      checkIfPlaceIsSavedAndNotify()
      setIsClicked(true);
      setSelectedPlaceTypes(mapLocation);
      mapRef.current.animateToRegion(
        {
          latitude: newMapLat,
          longitude: newMapLong,
          latitudeDelta: 0.002, // Adjust for more zoom
          longitudeDelta: 0.002,
        },
        2000
      ); // 1 second animation
    } else {
      // If mapLocation is not set, run handleCurrentUserLocation
      handleCurrentUserLocation();
    }
  }, [mapLocation]);

  const typeOfPlaces = [
    { value: "amusement_park", name: "Amusement Park" },
    { value: "aquarium", name: "Aquarium" },
    { value: "art_gallery", name: "Art Gallery" },
    { value: "bakery", name: "Bakery" },
    { value: "bar", name: "Bar" },
    { value: "book_store", name: "Book Store" },
    { value: "bowling_alley", name: "Bowling Alley" },
    { value: "bus_station", name: "Bus Station" },
    { value: "cafe", name: "Cafe" },
    { value: "campground", name: "Campground" },
    { value: "casino", name: "Casino" },
    { value: "cemetery", name: "Cemetery" },
    { value: "church", name: "Church" },
    { value: "city_hall", name: "City Hall" },
    { value: "clothing_store", name: "Clothing Store" },
    { value: "convenience_store", name: "Convenience Store" },
    { value: "department_store", name: "Department Store" },
    { value: "drugstore", name: "Drugstore" },
    { value: "electronics_store", name: "Electronics Store" },
    { value: "florist", name: "Florist" },
    { value: "gas", name: "Gas Station" },
    { value: "hair_care", name: "Hair Care" },
    { value: "home_goods_store", name: "Home Goods Store" },
    { value: "hotel", name: "Hotel" },
    { value: "library", name: "Library" },
    { value: "movie_theater", name: "Movie Theater" },
    { value: "museum", name: "Museum" },
    { value: "night_club", name: "Night Club" },
    { value: "park", name: "Park" },
    { value: "pharmacy", name: "Pharmacy" },
    { value: "restaurant", name: "Restaurant" },
    { value: "rv_park", name: "RV Park" },
    { value: "shopping_mall", name: "Shopping Mall" },
    { value: "spa", name: "Spa" },
    { value: "stadium", name: "Stadium" },
    { value: "store", name: "Store" },
    { value: "supermarket", name: "Supermarket" },
    { value: "tourist_attraction", name: "Tourist Attraction" },
    { value: "zoo", name: "Zoo" },
  ];

  const handleSelectedPlacesTypes = async (placeName) => {
    setMapLocation([]);
    setPlacesFocus(placeName);
    setIsAlreadySaved(false);
    setIsClicked(false);
    const body = {
      establishment_type: placeName,
    };

    try {
      const response = await API.getPlacesTypes(body);
      setPlacesTypes(response.data);
      handleZoomOutPlacesTpyeLocation();
    } catch (error) {
      console.log(error);
    }
  };

  const handleNearbyPlaceTypes = async () => {
    setPlacesFocus(nearbyPlaceTypes);
    setIsAlreadySaved(false);
    setIsClicked(false);
    const body = {
      establishment_type: nearbyPlaceTypes,
    };

    try {
      const response = await API.getPlacesTypes(body);
      setPlacesTypes(response.data);
      handleZoomOutPlacesTpyeLocation();
      setNearbyPlaceTypes("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (nearbyPlaceTypes) {
      handleNearbyPlaceTypes();
      console.log("NEARBY TYPES IS", nearbyPlaceTypes);
    } else {
      console.log("NEARBY TYPES IS EMPTY");
    }
  }, [nearbyPlaceTypes]);

  const [region, setRegion] = useState({
    latitude: 8.1130595, // Example latitude
    longitude: 122.6678314, // Example longitude
    latitudeDelta: 0.005, // Initial zoom level
    longitudeDelta: 0.005, // Initial zoom level
  });

  const handleZoomIn = () => {
    const newLatitudeDelta = region.latitudeDelta / 2;
    const newLongitudeDelta = region.longitudeDelta / 2;

    mapRef.current.animateToRegion(
      {
        ...region,
        latitudeDelta: newLatitudeDelta,
        longitudeDelta: newLongitudeDelta,
      },
      1000
    );

    setRegion((prev) => ({
      ...prev,
      latitudeDelta: newLatitudeDelta,
      longitudeDelta: newLongitudeDelta,
    }));
  };

  const handleZoomOut = () => {
    const newLatitudeDelta = region.latitudeDelta * 2;
    const newLongitudeDelta = region.longitudeDelta * 2;

    mapRef.current.animateToRegion(
      {
        ...region,
        latitudeDelta: newLatitudeDelta,
        longitudeDelta: newLongitudeDelta,
      },
      1000
    );

    setRegion((prev) => ({
      ...prev,
      latitudeDelta: newLatitudeDelta,
      longitudeDelta: newLongitudeDelta,
    }));
  };

  const handleCurrentUserLocation = () => {
    mapRef.current.animateToRegion(
      {
        latitude: initialRegion.latitude,
        longitude: initialRegion.longitude,
        latitudeDelta: 0.002, // Adjust for more zoom
        longitudeDelta: 0.002, // Adjust for more zoom
      },
      1000
    );
  };

  const initialRegion = {
    latitude: 8.1130595, // Example latitude
    longitude: 122.6678314, // Example longitude
    latitudeDelta: 0.005, // Smaller value for more zoom
    longitudeDelta: 0.005, // Adjust for zoom level (smaller means more zoomed in)
  };

  const toggleMapType = () => {
    setIsSelectingMap(true);
  };

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const GOOGLE_API_KEY = process.env.GOOGLE_MAP_API_KEY;

  const fetchPlaceDetails = async (latitude, longitude) => {
    console.log("Fetching details for:", latitude, longitude);
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );

      console.log("API Response:", response.data); // Log the API response

      if (response.data.results.length > 0) {
        const place = response.data.results[0]; // Get the first result
        const placeId = place.place_id;

        // Fetch detailed place info using the Place ID
        const placeDetails = await getPlaceDetailsById(placeId);
        setSelectedPlace(placeDetails); // Store the place details
        setModalVisible(true); // Show modal with place details
      } else {
        Alert.alert("No place found at this location");
      }
    } catch (error) {
      console.error(
        "Error fetching place details:",
        error.response ? error.response.data : error.message
      );
      Alert.alert("Error", "Failed to fetch place details.");
    }
  };

  const getPlaceDetailsById = async (placeId) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,place_id,geometry&key=${GOOGLE_API_KEY}`
      );
      return response.data.result;
    } catch (error) {
      Alert.alert("Error", "Failed to get details by place ID");
      console.error(error);
      return null;
    }
  };
  const handleMapPress = (e) => {
    console.log("Map Pressed");
    const { latitude, longitude } = e.nativeEvent.coordinate;
    console.log("Coordinates:", latitude, longitude);
  };

  const handleMarkerPress = (place) => {
    console.log("Marker Pressed:", place);
  };

  // Example data for markers
  const maplaces = [
    {
      id: 1,
      title: "Place 1",
      description: "Description for Place 1",
      coordinate: { latitude: 37.78825, longitude: -122.4324 },
    },
    {
      id: 2,
      title: "Place 2",
      description: "Description for Place 2",
      coordinate: { latitude: 37.78845, longitude: -122.4325 },
    },
    // Add more places as needed
  ];

  const handleGetPlacesTpyeLocation = (lat, long) => {
    mapRef.current.animateToRegion(
      {
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.001, // Adjust for more zoom
        longitudeDelta: 0.001, // Adjust for more zoom
      },
      1000
    );
  };

  const handleZoomOutPlacesTpyeLocation = () => {
    mapRef.current.animateToRegion(
      {
        latitude: initialRegion.latitude,
        longitude: initialRegion.longitude,
        latitudeDelta: 0.052, // Adjust for more zoom
        longitudeDelta: 0.052, // Adjust for more zoom
      },
      1000
    );
  };

  const handleSearchFocus = () => {
    router.push('/search/Searchplace')
  };

  const handleSelectedSearchedPlaceToNavigate = (lat, long) => {
    console.log(lat, long);
    setIsSearching(false);
    setSearchResults([]);
    setSearchText("");
    setMapLocation({
      lat: lat,
      long: long,
    });
  };

  
  const [isClicked, setIsClicked] = useState(false);
  const [selectedPlaceTypes, setSelectedPlaceTypes] = useState([]);
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);

  const handleClickedSelectedPlacesTypes = async (placesDetails) => {
    console.log(placesDetails);
    try {
      const response = await API.findPlaceSavedNotifReview({ query: placesDetails.place_id})
      console.log("RESPONSE DATA", response.data)
      setIsAlreadySaved(response.data.saved);
      setIsAlreadyNotify(response.data.in_notifications);
      setIsAlreadyReview(response.data.reviewed);
      setIsClicked(true);
      setSelectedPlaceTypes(placesDetails)
    } catch (error) {
      console.error("Error checking place and notifications:", error);
    }
  };

  const handleSavedPlaces = async () => {
    const body = {
      savedplace: {
        name: selectedPlaceTypes.name,
        address: selectedPlaceTypes.vicinity,
        lat: selectedPlaceTypes.location.lat,
        long: selectedPlaceTypes.location.lng,
        crowd_status: selectedPlaceTypes.crowd_status,
        image_url: selectedPlaceTypes.image_url,
        placesID: selectedPlaceTypes.place_id,
        icon_url: selectedPlaceTypes.icon,
      },
    };

    try {
      const response = await API.savedPlace(body);
      console.log(response.data);
      if (response.data) {
        setIsAlreadySaved(true);
       setIsSaved(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSettingUpNotifications = (place) => {
    setIsClicked(false);
    handleSelectedPlaceToNotif(place);
  };

  const handleSettingUpReview = (place) => {
    setIsClicked(false);
    handleSelectedPlaceToReview(place);
  };

  return (
    <View className="flex-1 ">
      {/** GOOGLE MAP */}
      <MapView
        ref={mapRef}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        mapType={`${selectedMap}`}
        customMapStyle={plainMapStyle}
        onPress={handleMapPress}
        className="flex-1"
      >
        {isValidLocation ? (
          <Marker
            coordinate={{ latitude: newMapLat, longitude: newMapLong }}
          ></Marker>
        ) : (
          ""
        )}

        <Marker
          // onPress={() => handleMarkerPress("Place Title")}
          onPress={()=> console.log(isAlreadyReview)}
          coordinate={{
            latitude: initialRegion.latitude,
            longitude: initialRegion.longitude,
          }}
        >
          <View className="relative w-40 h-40  flex-2 justify-center items-center shadow-2xl s rounded-full overflow-hidden">
            {currentUser?.user.gender === "Male" ? (
              <Image
                source={require("../../assets/location/male.png")}
                className="w-20 h-20"
              />
            ) : (
              <Image
                source={require("../../assets/location/female.png")}
                className="w-20 h-20"
              />
            )}
          </View>
        </Marker>

        {/* Places Markers */}
        {isValidLocation
          ? ""
          : placesTypes.map((place, index) => (
              <Marker
                key={index}
                onPress={() => handleClickedSelectedPlacesTypes(place)}
                coordinate={{
                  latitude: place.location.lat,
                  longitude: place.location.lng,
                }}
              >
                <View>
                  <View className="relative flex-1 w-20 h-20  shadow-2xl shadow-gray-500 ">
                    <Image
                      source={{ uri: place.icon }} // Replace with your image URL
                      className="w-16 h-16" // Image size
                    />
                  </View>
                </View>
              </Marker>
            ))}
      </MapView>

      {/* Modal to show place details */}
      {selectedPlace && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {selectedPlace.name}
              </Text>
              <Text>Place ID: {selectedPlace.place_id}</Text>
              <Text>Address: {selectedPlace.formatted_address}</Text>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  marginTop: 10,
                  backgroundColor: "lightblue",
                  padding: 10,
                }}
              >
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <View className="flex-1 w-full absolute mt-10">
        <View className="flex-1 p-5 ">
          <View className="right-1 top-32 absolute" style={{ zIndex: 1 }}>
            <Pressable
              onPress={handleZoomIn}
              className="bg-white w-10 flex justify-center items-center h-9 p-2 rounded-t-lg "
            >
              <Plus />
            </Pressable>
            <Pressable
              onPress={handleZoomOut}
              className="bg-white w-10 h-9 items-center flex-1 justify-center  p-2 mt-0.5 rounded-b-lg "
            >
              <Minus />
            </Pressable>
            <Pressable
              onPress={toggleMapType}
              className="bg-white w-10 flex justify-center items-center mt-2 h-9 p-2 rounded-t-lg "
            >
              <Mapviews />
            </Pressable>
            <Pressable
              onPress={handleCurrentUserLocation}
              className="bg-white w-10 h-9 items-center flex-1 justify-center  p-2 mt-0.5 rounded-b-lg "
            >
              <Locate />
            </Pressable>
          </View>

          <View className="flex-1 relative">
            <View className=" rounded-full bg-white shadow-lg shadow-gray-900">
              <View className="flex-row items-center bg-transparent rounded-full p-1">
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

          {isSearching ? (
            ""
          ) : (
            <View className="flex-row  justify-center mt-2">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {typeOfPlaces.map((place, index) => (
                  <Pressable
                    onPress={() => handleSelectedPlacesTypes(place.value)}
                    key={index}
                    className="bg-white py-3 px-6 rounded-full shadow-md shadow-gray-300 mx-1"
                  >
                    <Text
                      style={{ fontFamily: "PoppinsMedium" }}
                      className={
                        place.value === placeFocus
                          ? "text-secondary text-sm"
                          : `text-gray-500 text-sm`
                      }
                    >
                      {place.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      {/* SELECTED PLACES TYPES*/}

      {isClicked ? (
        ""
      ) : (
        <View className="flex-1 absolute w-full p-2 bottom-20 z-50 ">
          <ScrollView horizontal className="flex-1 gap-2">
            {placesTypes.map((place, index) => (
              <Pressable
                onPress={() =>
                  handleGetPlacesTpyeLocation(
                    place.location.lat,
                    place.location.lng
                  )
                }
                key={index}
                className="flex p-3 bg-white   items-center round rounded-2xl"
              >
                <View className="pl-2 pr-2">
                  <Image
                    source={{ uri: place.image_url }}
                    className="w-48  h-24 rounded-xl"
                  />
                </View>

                <View className="ml-2 m-2">
                  <Text
                    style={{ fontFamily: "PoppinsBold", fontSize: 15 }}
                    className="w-44"
                    numberOfLines={1} // Limit to 1 line
                    ellipsizeMode="tail" // Add ellipsis if the text overflows
                  >
                    {place.name}
                  </Text>
                  <Text
                    style={{ fontFamily: "PoppinsThin", fontSize: 13 }}
                    className="mb-1 w-44"
                    numberOfLines={1} // Limit to 1 line
                    ellipsizeMode="tail" // Add ellipsis if the text overflows
                  >
                    {place.vicinity}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <Text>{place.kilometers} km</Text>
                    <View className="h-2 w-2 bg-gray-300 rounded-full "></View>
                    <View
                      className={` h-3 rounded-full
${
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
          </ScrollView>
        </View>
      )}

      {isClicked ? (
        <View className="flex-1 absolute w-full p-2 bottom-24 z-50 ">
          <View className="flex flex-row p-3 bg-white shadow-lg shadow-gray-900 rounded-2xl">
          <View className="absolute right-3.5 top-8">
            {isAlreadySaved ? (
              <Pressable >
                <Bookmark />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => handleSavedPlaces()}
              
              >
                <Bookmarks />
              </Pressable>
            )}
              </View>
            <View className="absolute right-3 top-16">
             {isAlreadyNotify ? <RedNotif/> :
              <Pressable
              onPress={() => handleSettingUpNotifications(selectedPlaceTypes)}
            >
              <Alert />
            </Pressable>}
            </View>
            <View className="absolute right-3 bottom-8">
             {isAlreadyReview ? <Reviewed/> :
              <Pressable
              onPress={() => handleSettingUpReview(selectedPlaceTypes)}
            >
              <Reviews />
            </Pressable>}
            </View>
              <View className="flex-row mb-1.5 mt-1.5">
              <View>
              <Image
                source={{ uri: selectedPlaceTypes.image_url }}
                className="w-28 h-full rounded-xl"
              />
            </View>
            <View className="ml-2">
              <Text
                style={{ fontFamily: "PoppinsBold", fontSize: 16 }}
                className="w-40"
                numberOfLines={1} // Limit to 1 line
                ellipsizeMode="tail" // Add ellipsis if the text overflows
                onPress={()=> console.log(isAlreadyReview)}
              >
                {selectedPlaceTypes.name}
              </Text>
              <Text
                style={{ fontFamily: "PoppinsThin" }}
                className="mb-1 text-sm w-40"
                numberOfLines={1} // Limit to 1 line
                ellipsizeMode="tail" // Add ellipsis if the text overflows
              >
                {selectedPlaceTypes.vicinity}
              </Text>
              {selectedPlaceTypes?.opening_hours?.open_now === false ? (
                <Text
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-red-400"
                >
                  CLOSED
                </Text>
              ) : selectedPlaceTypes?.opening_hours?.open_now === true ? (
                <Text
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-green-400"
                >
                  OPEN
                </Text>
              ) : (
                <Text
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-red-400"
                >
                  CLOSED
                </Text>
              )}
              <View className="flex flex-row gap-1 items-center">
                <Kilometer />
                <Text
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-secondary mt-1"
                >
                  {selectedPlaceTypes.kilometers} Kilometer
                </Text>
              </View>

              {selectedPlaceTypes?.crowd_status === "low" ? (
                <View className="flex flex-row gap-1 items-center">
                  <FontAwesome
                    name="dot-circle-o"
                    size={14}
                    color={`${
                      selectedPlaceTypes?.opening_hours?.open_now === false ||
                      selectedPlaceTypes?.opening_hours === null
                        ? "gray"
                        : "#68D391"
                    }`}
                  />
                  <Text
                    style={{ fontFamily: "PoppinsBold" }}
                    className={`mt-1 ${
                      selectedPlaceTypes?.opening_hours?.open_now === false ||
                      selectedPlaceTypes?.opening_hours === null
                        ? "text-gray-500"
                        : "text-green-400"
                    }`}
                  >
                    Not Crowded (5-15)
                  </Text>
                </View>
              ) : selectedPlaceTypes?.crowd_status === "medium" ? (
                <View className="flex flex-row gap-1 items-center">
                  <FontAwesome
                    name="dot-circle-o"
                    size={14}
                    color={`${
                      selectedPlaceTypes?.opening_hours?.open_now === false ||
                      selectedPlaceTypes?.opening_hours === null
                        ? "gray"
                        : "#F59E0B"
                    }`}
                  />
                  <Text
                    style={{ fontFamily: "PoppinsBold" }}
                    className={`mt-1 ${
                      selectedPlaceTypes?.opening_hours?.open_now === false ||
                      selectedPlaceTypes?.opening_hours === null
                        ? "text-gray-500"
                        : "text-yellow-400"
                    }`}
                  >
                    Moderately Busy (16-30)
                  </Text>
                </View>
              ) : selectedPlaceTypes?.crowd_status === "high" ? (
                <View className="flex flex-row gap-1 items-center">
                  <FontAwesome
                    name="dot-circle-o"
                    size={14}
                    color={`${
                      selectedPlaceTypes?.opening_hours?.open_now === false ||
                      selectedPlaceTypes?.opening_hours === null
                        ? "gray"
                        : "#EF4444"
                    }`}
                  />
                  <Text
                    style={{ fontFamily: "PoppinsBold" }}
                    className={`mt-1 ${
                      selectedPlaceTypes?.opening_hours?.open_now === false ||
                      selectedPlaceTypes?.opening_hours === null
                        ? "text-gray-500"
                        : "text-red-400"
                    }`}
                  >
                    Very Crowded (31+)
                  </Text>
                </View>
              ) : null}
            </View>
              </View>
          </View>
        </View>
      ) : (
        ""
      )}
    </View>
  );
};

export default Map;
