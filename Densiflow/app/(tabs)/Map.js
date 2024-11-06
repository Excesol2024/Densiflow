import { View, Text, Image, Pressable, TextInput, ScrollView, Modal, ActivityIndicator } from "react-native";
import React, { useRef, useState, useContext, useEffect } from "react";
import Image1 from "../../assets/tabs/img1.png";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Fontisto from '@expo/vector-icons/Fontisto';
import Checkbox from 'expo-checkbox';
import Kilometer from "../../components/svg/Kilometer";
import Bookmark from "../../components/svg/Bookmark";
import Alert from "../../components/svg/Alert";
import Plus from '../../components/svg/map/Plus'
import Minus from '../../components/svg/map/Minus'
import Mapviews from '../../components/svg/map/Mapview'
import Locate from '../../components/svg/map/Locate'
import MapView, { Marker, Polygon } from 'react-native-maps';
import axios from 'axios';
import { AuthenticatedContext } from "../../context/Authenticateduser"
import { API } from "../../components/Protected/Api";
import { LoadingEffectsContext } from "../../context/Loadingeffect";

const Map = () => {
  const mapRef = useRef(null);
  const { currentUser } = useContext(AuthenticatedContext)
  const imageProfile = `${currentUser.user.photo_url}`
  const [isAm, setIsAM] = useState(true)
  const [placeFocus, setPlacesFocus] = useState("")
  const [placesTypes, setPlacesTypes] = useState([])
  const { isSelecting } = useContext(LoadingEffectsContext)

  const {mapLocation, setMapLocation, setIsSelectingMap, selectedMap} = useContext(LoadingEffectsContext)

  const newMapLat = parseFloat(mapLocation.lat)
  const newMapLong = parseFloat(mapLocation.long)

  // Check if newMapLat and newMapLong are valid numbers
  const isValidLocation = !isNaN(newMapLat) && !isNaN(newMapLong);

  // Define boundary coordinates based on newMapLat and newMapLong if valid
  const cityBoundaryCoordinates = isValidLocation ? [
    { latitude: newMapLat + 0.01, longitude: newMapLong + 0.01 },
    { latitude: newMapLat + 0.01, longitude: newMapLong - 0.01 },
    { latitude: newMapLat - 0.01, longitude: newMapLong - 0.01 },
    { latitude: newMapLat - 0.01, longitude: newMapLong + 0.01 },
    { latitude: newMapLat + 0.01, longitude: newMapLong + 0.01 }, // Close the loop
  ] : [];

  const plainMapStyle = [
    {
      featureType: 'poi', // Hides POI (points of interest) icons
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit.station', // Hides transit icons
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'road', // Optionally, hide road icons
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
  ];
  

  useEffect(() => {
    if (isValidLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: newMapLat,
        longitude: newMapLong,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000); // 1 second animation
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
    { value: "zoo", name: "Zoo" }
  ];
  

const handleSelectedPlacesTypes = async(placeName) =>{

  setPlacesFocus(placeName)

  const body = {
     establishment_type: placeName
  }

  try {
    const response = await API.getPlacesTypes(body)
    setPlacesTypes(response.data)
    handleZoomOutPlacesTpyeLocation();
  } catch (error) {
    console.log(error)
  }
}

const placesResult = [
  {
    location: {
      lat: 8.11792,
      lng: 122.666031
  },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bank-71.png",
  }, 
  {
    location: {
      lat: 8.1193222,
      lng: 122.6824758
  },
    icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bank-71.png",
  }, 
]

  
  const handleSelectPm = () =>{
    setIsAM(false)
  }

  const handleSelectAm = () =>{
    setIsAM(true)
  }


  const [region, setRegion] = useState({
    latitude: 8.1130595, // Example latitude
    longitude: 122.6678314, // Example longitude
    latitudeDelta: 0.005, // Initial zoom level
    longitudeDelta: 0.005, // Initial zoom level
  });

  const [mapType, setMapType] = useState('standard');

  const handleAddNotifications = async () => {
    try {
      
    } catch (error) {
      console.log(error)
    }
  }

  const handleZoomIn = () => {
    const newLatitudeDelta = region.latitudeDelta / 2;
    const newLongitudeDelta = region.longitudeDelta / 2;

    mapRef.current.animateToRegion({
      ...region,
      latitudeDelta: newLatitudeDelta,
      longitudeDelta: newLongitudeDelta,
    }, 1000);

    setRegion((prev) => ({
      ...prev,
      latitudeDelta: newLatitudeDelta,
      longitudeDelta: newLongitudeDelta,
    }));
  };


  const handleZoomOut = () => {
    const newLatitudeDelta = region.latitudeDelta * 2;
    const newLongitudeDelta = region.longitudeDelta * 2;

    mapRef.current.animateToRegion({
      ...region,
      latitudeDelta: newLatitudeDelta,
      longitudeDelta: newLongitudeDelta,
    }, 1000);

    setRegion((prev) => ({
      ...prev,
      latitudeDelta: newLatitudeDelta,
      longitudeDelta: newLongitudeDelta,
    }));
  };

  const handleCurrentUserLocation = () => {
    mapRef.current.animateToRegion({
      latitude: initialRegion.latitude,
      longitude: initialRegion.longitude,
      latitudeDelta: 0.002, // Adjust for more zoom
      longitudeDelta: 0.002, // Adjust for more zoom
    }, 1000);
  };
  
  const initialRegion = {
    latitude: 8.1130595, // Example latitude
    longitude: 122.6678314, // Example longitude
    latitudeDelta: 0.005, // Smaller value for more zoom
    longitudeDelta: 0.005 // Adjust for zoom level (smaller means more zoomed in)
  };

  const toggleMapType = () => {
    setIsSelectingMap(true)
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
        Alert.alert('No place found at this location');
      }
    } catch (error) {
      console.error("Error fetching place details:", error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to fetch place details.');
    }
  };


  const getPlaceDetailsById = async (placeId) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,place_id,geometry&key=${GOOGLE_API_KEY}`
      );
      return response.data.result;
    } catch (error) {
      Alert.alert('Error', 'Failed to get details by place ID');
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
      { id: 1, title: "Place 1", description: "Description for Place 1", coordinate: { latitude: 37.78825, longitude: -122.4324 } },
      { id: 2, title: "Place 2", description: "Description for Place 2", coordinate: { latitude: 37.78845, longitude: -122.4325 } },
      // Add more places as needed
    ];

    
    const handleGetPlacesTpyeLocation = (lat, long) => {
      mapRef.current.animateToRegion({
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.001, // Adjust for more zoom
        longitudeDelta: 0.001, // Adjust for more zoom
      }, 1000);
    };

    const handleZoomOutPlacesTpyeLocation = () => {
      mapRef.current.animateToRegion({
        latitude: initialRegion.latitude,
        longitude: initialRegion.longitude,
        latitudeDelta: 0.052, // Adjust for more zoom
        longitudeDelta: 0.052, // Adjust for more zoom
      }, 1000);
    };


    const { setIsSearching, isSearching } = useContext(LoadingEffectsContext)

    const handleSearchFocus = () =>{
      setIsSearching(true)
    }
  
    const handleSelectedSearchedPlaceToNavigate = (lat, long) =>{
      console.log(lat, long)
      setIsSearching(false)
      setSearchResults([])
      setSearchText("")
      setMapLocation({
        lat: lat,
        long: long
      })
    }

    const [isTyping, setIsTyping] = useState(false);

  const handleFocus = () => {
    console.log("PRESSED");
    if (!isTyping) {
      setIsTyping(true);
    }
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
    className="flex-1">

{cityBoundaryCoordinates.length > 0 && (
      <Polygon
        coordinates={cityBoundaryCoordinates}
        strokeColor="#FF6347" // Boundary line color
        fillColor="rgba(255, 99, 71, 0.3)" // Boundary fill color
        strokeWidth={2}
      />
    )}

<Marker  onPress={() => handleMarkerPress("Place Title")} coordinate={{ latitude: initialRegion.latitude, longitude: initialRegion.longitude }}>
      <View className="relative w-40 h-40  flex-2 justify-center items-center shadow-2xl s rounded-full overflow-hidden">
     {currentUser?.user.gender === "Male" ?  <Image source={require("../../assets/location/male.png")} className="w-20 h-20"/> : 
      <Image source={require("../../assets/location/female.png")} className="w-20 h-20"/>
     }
      </View>
    </Marker>


   {/* Places Markers */}
   {placesTypes.map((place, index) => (
    <Marker
      key={index}
      coordinate={{latitude: place.location.lat, longitude: place.location.lng}}
    >
      <View>
      <View className="flex-1 justify-center items-center"><Text className="text-secondary text-xl">YOU</Text></View>
      <View className="relative w-14 h-14  shadow-2xl shadow-gray-500 ">
        <Image 
          source={{ uri: place.icon }} // Replace with your image URL
          className="w-14 h-14" // Image size
        />
      </View>
      </View>
    </Marker>
  ))}


   {/* SELECTED PLACES Markers */}

{mapLocation.lat === "" && mapLocation.long === "" ? '' : 
   <Marker  onPress={() => handleMarkerPress("Place Title")} coordinate={{ latitude: newMapLat, longitude: newMapLong }}>
   <View className="flex-1 justify-center items-center"><Text className="text-secondary text-xl">SEL</Text></View>
   <View className="relative w-12 h-12 border-4 shadow-2xl shadow-gray-500 border-blue-500 rounded-full overflow-hidden">
     <Image 
       source={{ uri: imageProfile }} // Replace with your image URL
       className="w-12 h-12" // Image size
     />
   </View>
 </Marker>}

    </MapView>


      {/* Modal to show place details */}
  {selectedPlace && (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{selectedPlace.name}</Text>
          <Text>Place ID: {selectedPlace.place_id}</Text>
          <Text>Address: {selectedPlace.formatted_address}</Text>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{ marginTop: 10, backgroundColor: 'lightblue', padding: 10 }}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )}

  <View className="flex-1 w-full absolute mt-10">
  <View className="flex-1 p-5 ">

  <View className="right-1 top-32 absolute" style={{zIndex: 1}}>
    <Pressable onPress={handleZoomIn} className="bg-white w-10 flex justify-center items-center h-9 p-2 rounded-t-lg ">
      <Plus/>
    </Pressable>
    <Pressable onPress={handleZoomOut} className="bg-white w-10 h-9 items-center flex-1 justify-center  p-2 mt-0.5 rounded-b-lg ">
      <Minus/>
    </Pressable>
    <Pressable onPress={toggleMapType}  className="bg-white w-10 flex justify-center items-center mt-2 h-9 p-2 rounded-t-lg ">
      <Mapviews/>
    </Pressable>
   <Pressable onPress={handleCurrentUserLocation} className="bg-white w-10 h-9 items-center flex-1 justify-center  p-2 mt-0.5 rounded-b-lg ">
      <Locate/>
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
            onFocus={()=> handleSearchFocus()}
            />
        </View>
  </View>

  </View>

 {isSearching? '' :  <View className="flex-row  justify-center mt-2">
<ScrollView horizontal showsHorizontalScrollIndicator={false}>
{typeOfPlaces.map((place, index)=>(
  <Pressable onPress={()=> handleSelectedPlacesTypes(place.value)} key={index} className="bg-white py-3 px-6 rounded-full shadow-md shadow-gray-300 mx-1">
  <Text style={{ fontFamily: "PoppinsMedium" }} className={place.value === placeFocus ? 'text-secondary text-sm' : `text-gray-500 text-sm`}>
    {place.name}
  </Text>
</Pressable>
))}
</ScrollView>
  </View>}

 

 </View>

    
  </View>

  
  
{/* SELECTED PLACES TYPES*/}

<View className="flex-1 absolute w-full p-2 bottom-20 z-50 ">
 <ScrollView horizontal className="flex-1 gap-2">
 {placesTypes.map((place, index)=>(
  <Pressable onPress={ ()=> handleGetPlacesTpyeLocation(place.location.lat, place.location.lng)} key={index} className="flex p-3 bg-white   items-center round rounded-2xl"  >
  <View className="pl-2 pr-2"> 
    <Image source={{uri: place.image_url}} className="w-48  h-24 rounded-xl" />
  </View>

  <View className="ml-2 m-2">
    <Text  style={{ fontFamily: "PoppinsBold", fontSize: 15 }} className="w-44"
     numberOfLines={1} // Limit to 1 line
     ellipsizeMode="tail" // Add ellipsis if the text overflows
    >{place.name}</Text>
    <Text style={{ fontFamily: "PoppinsThin", fontSize: 13 }} className="mb-1 w-44"
       numberOfLines={1} // Limit to 1 line
       ellipsizeMode="tail" // Add ellipsis if the text overflows
    >{place.vicinity}</Text>
      <View className="flex-row items-center gap-2">
        <Text>{place.kilometers} km</Text>
        <View className={`w-20 h-3 rounded-full ${place.crowd_status === "low" ? ' bg-green-500' : 
          place.crowd_status === "medium" ? 'bg-yellow-500' : place.crowd_status === "high" ? ' bg-red-500' : '' }`}></View>
      </View>
  </View>
</Pressable>
 ))}

 </ScrollView>
   </View>
  
<View className="flex-1 absolute w-full z-50 p-3 hidden" style={{bottom: `30%` }}>
<View className="flex flex-row p-4 bg-white shadow-2xl shadow-gray-700 rounded-2xl">
     <View className="flex-1 mb-2">
      <Text style={{fontFamily: 'PoppinsMedium'}} className="text-md text-secondary text-center mb-5">
      Set alerts to get notified when your favorite spots reach your preferred crowd level
      </Text>



     <View className="flex-1 justify-center items-center">
   <View className="">
   <View className="flex-row gap-2">
      
      <TextInput style={{fontFamily: 'PoppinsMedium' }} className="rounded-md flex items-center w-20 bg-gray-200 p-1 pl-5 pr-4" placeholder="09:32"/>

        <View className="flex-row items-center rounded-md bg-gray-200 p-1.5 ">
          <Pressable onPress={handleSelectAm} className={isAm ? 'mr-2 p-1.5 rounded-md pl-4 pr-4 bg-white' : 'mr-2 p-1.5 rounded-md pl-4 pr-4'}><Text>AM</Text></Pressable>
          <Pressable onPress={handleSelectPm} className={!isAm ? 'mr-2 p-1.5 rounded-md pl-4 pr-4 bg-white' : 'mr-2 p-1.5 rounded-md pl-4 pr-4'}><Text>PM</Text></Pressable>
        </View>

      </View>
  
   </View>
     </View>
     <View className="flex-row justify-center mt-4">
      <Pressable className="bg-secondary p-1.5 pl-14 pr-14 rounded-md">
      <Text className="text-white" style={{fontFamily: 'PoppinsMedium' }}>Set</Text>
      </Pressable>
     </View>
     </View>
    </View>
</View>


   <View className="flex-1 absolute w-full p-2 bottom-24 z-50 hidden">
   <View className="flex flex-row p-3 bg-white shadow-2xl shadow-gray-700 rounded-2xl">
      <View className="absolute right-3 top-3">
      <Bookmark/>
      </View>
      <View className="absolute right-3 bottom-16">
      <Alert/>
      </View>
      <View> 
        <Image source={Image1} className="w-28 h-24 rounded-xl" />
      </View>

      <View className="ml-2">
        <Text  style={{ fontFamily: "PoppinsBold", fontSize: 16 }} className="w-40"
         numberOfLines={1} // Limit to 1 line
         ellipsizeMode="tail" // Add ellipsis if the text overflows
        >Green Park Cafe reen Park Cafe</Text>
        <Text style={{ fontFamily: "PoppinsThin" }} className="mb-1 text-sm w-40"
           numberOfLines={1} // Limit to 1 line
           ellipsizeMode="tail" // Add ellipsis if the text overflows
        >Antaro Mart, Metro Manila</Text>
        <View className="flex flex-row gap-1 items-center">
          <Kilometer/>
          <Text style={{ fontFamily: "PoppinsBold" }} className="text-secondary mt-1">3.6 Kilometer</Text>
        </View>

        <View className="flex flex-row gap-1 items-center">
          <FontAwesome name="dot-circle-o" size={14} color="#68D391" />
          <Text style={{ fontFamily: "PoppinsBold" }} className="text-green-400 mt-1">Not Crowded (25%)</Text>
        </View>
      </View>
    </View>
   </View>
  
</View>
  );
};

export default Map;
