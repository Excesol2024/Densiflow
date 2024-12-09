import { View, Text, TouchableOpacity, Image, TextInput, Pressable, KeyboardAvoidingView, Modal } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import MapSvg from './svg/map';
import HomeSvg from './svg/home';
import WorldSvg from './svg/world';
import Close from './svg/Close';
import NotifSvg from './svg/notification';
import ProfileSvg from './svg/profile';
import { LoadingEffectsContext } from "../context/Loadingeffect";
import { API } from './Protected/Api';
import Searchplace from '../app/search/Searchplace';
import LottieView from "lottie-react-native"
import NextSvg from './svg/next';

const TabBar = ({ state, descriptors, navigation }) => {

  const { isSelectingGender, setIsSelectingGender, handleMapSelections, isSelectingMap , selectedMap, isSearching,
    isSettingNotif, setIsSettingNotif, placeDetails, isReviewing, setIsReviewing
  } = useContext(LoadingEffectsContext)

  const [isSuccess, setIsSuccess] = useState(false)

  const currentDate = new Date();
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  
  // Ensure minutes are always two digits
  minutes = minutes < 10 ? '0' + minutes : minutes;
  
  // Convert to 12-hour format
  const formattedHours = hours % 12 || 12;  // Converts 0 to 12 for 12 AM
  const currentTime = `${formattedHours}:${minutes}`;
  const formattedDate = currentDate.toLocaleDateString('en-CA')



    const icons = {
      Home: (props) => <HomeSvg {...props} />,
      Saved: (props) => <MapSvg {...props} />,
      Map: (props) => <WorldSvg {...props} />,
      Alerts: (props) => <NotifSvg {...props} />,
      Settings: (props) => <ProfileSvg {...props} />,
    }

    const [isAm, setIsAM] = useState(true)
    const [time, setTime] = useState("")

    const handleSelectPm = () =>{
      setIsAM(false)
    }
  
    const handleSelectAm = () =>{
      setIsAM(true)
    }

    const handleUpdateGender = async (gender) =>{
      const body = {
         gender: gender
      }
      try {
        const reponse = await API.updateUserGender(body);
        if(reponse.data.status === "success"){
          setIsSelectingGender(false)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const handleSetNotification = async() =>{
      const [hour, minute] = time.split(":"); 
      const adjustedHour = isAm ? hour : `${parseInt(hour) + 12}`; // Add 12 for PM
      const scheduledTime = `${formattedDate}T${isAm ? `0${time}:00` : `${adjustedHour}:${minute}:00`}`;
     

      const body = {
        notification: {
          lat: placeDetails.location.lat,
          long: placeDetails.location.lng,
          name: placeDetails.name,
          scheduled_time: scheduledTime,  
          placesID: placeDetails.place_id
        }
      }
      try {
        const response = await API.addPlaceToNotify(body)
        if(response.data){
          console.log(response.data.status)
          setIsSuccess(true)
          setIsSettingNotif(false)
          setTimeout(() => {
            setIsSuccess(false)
          }, 3000);
        }
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=> {
      const hour = currentDate.getHours();
      if (hour >= 12) {
        setIsAM(false)
      } else {
        setIsAM(true)
      }
    },[])
  

  return (
    <View style={{ flexDirection: 'row', backgroundColor: 'white', position: 'absolute', bottom: 0, width: '100%', 
    padding: 2, alignItems: 'center', alignContent: 'center' }}>

  {isSearching ? <Searchplace/> : ''}
  
   <Modal
    animationType="slide" // or 'fade' or 'none'
    transparent={true} // Makes the background semi-transparent
    visible={isSelectingGender}

   >
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)',}}>
      <View className="absolute h-56 w-screen bg-gray-50 right-0 bottom-0 rounded-t-3xl  " style={{zIndex: 2}}>
          <Text style={{fontFamily: 'PoppinsMedium'}} className="text-center mt-4 text-2xl">Select a Gender</Text>
          <View className="flex-row justify-center mt-5">
            <Pressable onPress={()=> {handleUpdateGender("Female")}} className="pr-14">
              <Image source={require('../assets/fm.png')}/>
              <Text style={{fontFamily: 'PoppinsMedium'}} className={`text-center mt-2 text-lg`}>Female</Text>
            </Pressable>
            <Pressable onPress={()=> {handleUpdateGender("Male")}}>
              <Image source={require('../assets/m.png')}/>
              <Text style={{fontFamily: 'PoppinsMedium'}} className="text-center mt-2 text-lg">Male</Text>
            </Pressable>
          </View>
       </View>
</View>
   </Modal>

     <Modal
      animationType="slide" // or 'fade' or 'none'
      transparent={true} // Makes the background semi-transparent
      visible={isSelectingMap}
     >
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)',}}>
      <View className="absolute h-56 w-screen bg-gray-50 right-0 bottom-0 rounded-t-3xl " style={{zIndex: 2}}>
          <Text style={{fontFamily: 'PoppinsMedium'}} className="text-center mt-4 text-2xl">Map Type</Text>
          <View className="flex-row justify-center gap-6 mt-1">
            <View>
              <Pressable onPress={()=> handleMapSelections("standard")} className={`rounded-2xl overflow-hidden border-4 ${selectedMap === "standard" ? 'border-secondary' : 'border-white'}`}><Image source={require('../assets/map/1.png')}/></Pressable>
              <Text style={{fontFamily: 'PoppinsMedium'}} className="text-center mt-2 text-lg text-gray-600">Default</Text>
            </View>
            <View>
              <Pressable onPress={()=> handleMapSelections("satellite")} className={`rounded-2xl overflow-hidden border-4 ${selectedMap === "satellite" ? 'border-secondary' : 'border-white'}`}><Image source={require('../assets/map/2.png')}/></Pressable>
              <Text style={{fontFamily: 'PoppinsMedium'}} className="text-center mt-2 text-lg text-gray-600">Satelite</Text>
            </View>
            <View>
              <Pressable onPress={()=> handleMapSelections("terrain")} className={`rounded-2xl overflow-hidden border-4 ${selectedMap === "terrain" ? 'border-secondary' : 'border-white'}`}><Image source={require('../assets/map/3.png')}/></Pressable>
              <Text style={{fontFamily: 'PoppinsMedium'}} className="text-center mt-2 text-lg text-gray-600">Terrain</Text>
            </View>
          </View>
       </View>
      </View>
     </Modal>

       <Modal 
        animationType="slide" // or 'fade' or 'none'
        transparent={true} // Makes the background semi-transparent
        visible={isSettingNotif}
       >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)',}}>
        <View className="absolute h-72 w-screen bg-gray-50 right-0 bottom-0 rounded-t-3xl " style={{zIndex: 2}}>
          <Pressable onPress={()=> setIsSettingNotif(false)} className="absolute right-4 top-4"> 
            <Close/>
          </Pressable>
       <View className="flex-1 mb-2 p-10">
          <Text style={{fontFamily: 'PoppinsMedium'}} className="text-lg text-secondary text-center mb-5">
          Set alerts to get notified when your favorite spots reach your preferred crowd level
          </Text>

   
         <View className="justify-center items-center">
       <View className="">
       <View className="flex-row gap-2">
          
          <TextInput
          value={time}
          onChangeText={setTime}
          style={{fontFamily: 'PoppinsMedium' }} className="rounded-md flex items-center w-20 bg-gray-200 p-1 pl-6 pr-4" placeholder={currentTime}/>

            <View className="flex-row items-center rounded-md bg-gray-200 p-0.5 ">
              <Pressable onPress={handleSelectAm} className={isAm ? 'mr-2 p-1.5 rounded-md pl-4 pr-4 bg-white shadow-2xl shadow-gray-400' : 'mr-2 p-1.5 rounded-md pl-4 pr-4'}><Text>AM</Text></Pressable>
              <Pressable onPress={handleSelectPm} className={!isAm ? ' p-1.5 rounded-md pl-4 pr-4 bg-white shadow-2xl shadow-gray-400' : 'mr-2 p-1.5 rounded-md pl-4 pr-4 '}><Text>PM</Text></Pressable>
            </View>
   
          </View>
      
       </View>
         </View>
         <View className="flex-row justify-center mt-7">
          <Pressable onPress={()=> handleSetNotification()} className="bg-secondary p-2 shadow-2xl shadow-primary pl-14 pr-14 rounded-xl">
          <Text className="text-white text-lg" style={{fontFamily: 'PoppinsMedium' }}>Set</Text>
          </Pressable>
         </View>
         </View>
       </View>
        </View>
       </Modal>

       
       <Modal 
        animationType="slide" // or 'fade' or 'none'
        transparent={true} // Makes the background semi-transparent
        visible={isReviewing}
       >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)',}}>
        <View className="absolute h-72 w-screen bg-gray-50 right-0 bottom-0 rounded-t-3xl " style={{zIndex: 2}}>
          <Pressable onPress={()=> setIsReviewing(false)} className="absolute right-4 top-4"> 
            <Close/>
          </Pressable>
          <View className="flex-1 justify-center items-center pl-5 pr-5">
              <Text
                className="text-lg text-secondary"
                style={{ fontFamily: "PoppinsBold" }}
              >
                Quick Review
              </Text>
              <View className="flex-2  w-full ">
                <TextInput
                  style={{
                    fontFamily: "PoppinsThin",
                    textAlignVertical: "top", // Aligns text to the top
                    paddingTop: 10, // Adds space at the top
                    paddingLeft: 12, // Padding on the left
                    paddingRight: 8, // Padding on the right
                    paddingBottom: 8, // Padding at the bottom
                    height: 160, // Adjust height as needed
                  }}
                  className="border-2 border-secondary rounded-lg mt-2"
                  placeholder='“Share your tips or reviews about the spot!”'
                  // placeholderTextColor={`${errorComments ? "red" : "gray"}`}
                  // placeholder={`${
                  //   errorComments
                  //     ? errorComments
                  //     : "“Share your tips or reviews about the spot!”"
                  // }`}
                  // value={comments}
                  // onChangeText={(text) =>
                  //   handleReviewsInputChange("comments", text)
                  // }
                />
                <Text className="absolute right-3 bottom-2">
                  {" "}
                  <Pressable>
                    <NextSvg />
                  </Pressable>
                </Text>
              </View>
            </View>
       </View>
        </View>
       </Modal>

       <Modal 
        animationType="slide" // or 'fade' or 'none'
        transparent={true} // Makes the background semi-transparent
        visible={isSuccess}
       >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)',}}>
        <View className="absolute h-72 w-screen bg-gray-50 right-0 bottom-0 rounded-t-3xl " style={{zIndex: 2}}>
          <Pressable onPress={()=> setIsSuccess(false)} className="absolute right-4 top-4"> 
            <Close/>
          </Pressable>
       <View className="flex-1 mb-2 p-10">
          <Text style={{fontFamily: 'PoppinsMedium'}} className="text-lg text-secondary text-center mb-5">
          We'll keep an eye on <Text className="text-red-500">{placeDetails.name}</Text> {" "}
for you at <Text className="text-red-500">{isAm ? `${time}AM`: `${time}PM`}</Text>. We'll notify you when it's time!
          </Text>

          <LottieView 
          source={require("../assets/animation/bell.json")}
          autoPlay
          loop
          className="w-full h-36"
          />

         </View>
       </View>
        </View>
       </Modal>


      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}
          >
                            
            {
                icons[route.name]({
                    color: isFocused ? '#007AFF' : '#E0E0E0'
                })
            }
             <Text style={{ color: isFocused ? '#007AFF' : '#E0E0E0', fontFamily: 'PoppinsThin' }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;
