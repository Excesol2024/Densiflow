import { View, Text, Image, Pressable, TextInput, ScrollView } from "react-native";
import React, { useRef, useState } from "react";
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
import MapView, { Marker } from 'react-native-maps';

const Map = () => {
  const mapRef = useRef(null);
  const imageProfile = "https://firebasestorage.googleapis.com/v0/b/exceproducts.appspot.com/o/profile.png?alt=media&token=7253525a-bfaf-4b73-bd3b-d185550cd8dc"
  const [isAm, setIsAM] = useState(true)

  const handleSelectPm = () =>{
    setIsAM(false)
  }

  const handleSelectAm = () =>{
    setIsAM(true)
  }

  const places = [
    {
      name: "Cafes"
    },
    {
      name: "Restaurants"
    },
    {
      name: "Parks"
    },
    {
      name: "Museums"
    },
  ]

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
    setMapType((prev) => {
      switch (prev) {
        case 'standard':
          return 'satellite';
        case 'satellite':
          return 'hybrid';
        case 'hybrid':
          return 'terrain';
        default:
          return 'standard'; // Fallback to standard
      }
    });
  };


  return (
    <View className="flex-1 ">
        {/** GOOGLE MAP */}
        <MapView
          ref={mapRef}
          initialRegion={region} 
          onRegionChangeComplete={setRegion}
          mapType={mapType}
        className="flex-1">



<Marker coordinate={{ latitude: initialRegion.latitude, longitude: initialRegion.longitude }}>
          <View className="flex-1 justify-center items-center"><Text className="text-secondary text-xl">YOU</Text></View>
          <View className="relative w-12 h-12 border-4 shadow-2xl shadow-gray-500 border-blue-500 rounded-full overflow-hidden">
            <Image 
              source={{ uri: imageProfile }} // Replace with your image URL
              className="w-12 h-12" // Image size
            />
          </View>
        </Marker>

        </MapView>

      <View className="flex-1 absolute mt-10">
      <View className="flex-2 p-5 ">
     <View className="rounded-full bg-white shadow-lg shadow-gray-900">
      <View className="flex-row items-center bg-transparent rounded-full p-1">
              <AntDesign
                name="search1"
                size={27}
                color="gray"
                paddingLeft={5}
              
              />
              <TextInput
                style={{ fontFamily: "PoppinsThin" }}
                className="flex-1 pl-2 py-1 text-gray-50 text-sm"
                placeholderTextColor="gray"
                placeholder="Green Park Cafe"
          
              />
            </View>
      </View>

      <View className="flex-row  justify-center mt-4">
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
  {places.map((place, index)=>(
      <Pressable key={index} className="bg-white py-3 px-6 rounded-full shadow-md shadow-gray-300 mx-1">
      <Text style={{ fontFamily: "PoppinsMedium" }} className={place.name === "Cafes" ? 'text-secondary text-sm' : `text-gray-500 text-sm`}>
        {place.name}
      </Text>
    </Pressable>
  ))}
  </ScrollView>
      </View>

     

     </View>
     <View className="flex-1  w-full">
        <View className="right-1 absolute">
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
      </View>
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
          
          <TextInput style={{fontFamily: 'PoppinsMedium' }} className="rounded-md flex items-center w-20 bg-gray-200 p-1 pl-4 pr-4" placeholder="09:32"/>

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
            <Text style={{ fontFamily: "PoppinsBold", fontSize: 16 }} className="" >Green Park Cafe</Text>
            <Text style={{ fontFamily: "PoppinsThin" }} className="mb-1 text-sm">Antaro Mart, Metro Manila</Text>
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
