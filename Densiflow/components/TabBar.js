import { View, Text, TouchableOpacity, Image, TextInput, Pressable } from 'react-native';
import React, { useState } from 'react';
import MapSvg from './svg/map';
import HomeSvg from './svg/home';
import WorldSvg from './svg/world';
import NotifSvg from './svg/notification';
import ProfileSvg from './svg/profile';

const TabBar = ({ state, descriptors, navigation }) => {

    const icons = {
      Home: (props) => <HomeSvg {...props} />,
      Saved: (props) => <MapSvg {...props} />,
      Map: (props) => <WorldSvg {...props} />,
      Alerts: (props) => <NotifSvg {...props} />,
      Settings: (props) => <ProfileSvg {...props} />,
    }

    const [isAm, setIsAM] = useState(true)
    const handleSelectPm = () =>{
      setIsAM(false)
    }
  
    const handleSelectAm = () =>{
      setIsAM(true)
    }
  

  return (
    <View style={{ flexDirection: 'row', backgroundColor: 'white', position: 'absolute', bottom: 0, width: '100%', 
    padding: 2, alignItems: 'center', alignContent: 'center' }}>
       <View className="absolute h-56 w-screen bg-gray-50 right-0 bottom-0 rounded-t-3xl hidden " style={{zIndex: 2}}>
          <Text style={{fontFamily: 'PoppinsMedium'}} className="text-center mt-4 text-2xl">Select a Gender</Text>
          <View className="flex-row justify-center mt-5">
            <View className="pr-14">
              <Image source={require('../assets/fm.png')}/>
              <Text style={{fontFamily: 'PoppinsMedium'}} className={`text-center mt-2 text-lg`}>Female</Text>
            </View>
            <View>
              <Image source={require('../assets/m.png')}/>
              <Text style={{fontFamily: 'PoppinsMedium'}} className="text-center mt-2 text-lg">Male</Text>
            </View>
          </View>
       </View>
       <View className="absolute h-56 w-screen bg-gray-50 right-0 bottom-0 rounded-t-3xl hidden" style={{zIndex: 2}}>
          <Text style={{fontFamily: 'PoppinsMedium'}} className="text-center mt-4 text-2xl">Map Type</Text>
          <View className="flex-row justify-center gap-6 mt-1">
            <View>
              <View className="rounded-2xl overflow-hidden border-4 border-secondary"><Image source={require('../assets/map/1.png')}/></View>
              <Text style={{fontFamily: 'PoppinsMedium'}} className="text-center mt-2 text-lg text-gray-600">Default</Text>
            </View>
            <View>
              <View className="rounded-2xl overflow-hidden  border-white border-4"><Image source={require('../assets/map/2.png')}/></View>
              <Text style={{fontFamily: 'PoppinsMedium'}} className="text-center mt-2 text-lg text-gray-600">Satelite</Text>
            </View>
            <View>
              <View className="rounded-2xl overflow-hidden  border-white border-4"><Image source={require('../assets/map/3.png')}/></View>
              <Text style={{fontFamily: 'PoppinsMedium'}} className="text-center mt-2 text-lg text-gray-600">Terrain</Text>
            </View>
          </View>
       </View>

       <View className="absolute h-72 w-screen bg-gray-50 right-0 bottom-0 rounded-t-3xl hidden" style={{zIndex: 2}}>
       <View className="flex-1 mb-2 p-10">
          <Text style={{fontFamily: 'PoppinsMedium'}} className="text-lg text-secondary text-center mb-5">
          Set alerts to get notified when your favorite spots reach your preferred crowd level
          </Text>

   
         <View className="justify-center items-center">
       <View className="">
       <View className="flex-row gap-2">
          
          <TextInput style={{fontFamily: 'PoppinsMedium' }} className="rounded-md flex items-center w-20 bg-gray-200 p-1 pl-6 pr-4" placeholder="09:32"/>

            <View className="flex-row items-center rounded-md bg-gray-200 p-0.5 ">
              <Pressable onPress={handleSelectAm} className={isAm ? 'mr-2 p-1.5 rounded-md pl-4 pr-4 bg-white shadow-2xl shadow-gray-400' : 'mr-2 p-1.5 rounded-md pl-4 pr-4'}><Text>AM</Text></Pressable>
              <Pressable onPress={handleSelectPm} className={!isAm ? ' p-1.5 rounded-md pl-4 pr-4 bg-white shadow-2xl shadow-gray-400' : 'mr-2 p-1.5 rounded-md pl-4 pr-4 '}><Text>PM</Text></Pressable>
            </View>
   
          </View>
      
       </View>
         </View>
         <View className="flex-row justify-center mt-7">
          <Pressable className="bg-secondary p-2 shadow-2xl shadow-primary pl-14 pr-14 rounded-xl">
          <Text className="text-white text-lg" style={{fontFamily: 'PoppinsMedium' }}>Set</Text>
          </Pressable>
         </View>
         </View>
       </View>


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
