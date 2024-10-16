import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import AntDesign from "@expo/vector-icons/AntDesign";
import First from '../../components/svg/profile/First';
import Second from '../../components/svg/profile/Second';
import Third from '../../components/svg/profile/Third';
import Fourth from '../../components/svg/profile/Fourth';
import Fifth from '../../components/svg/profile/Fifth';
import Sixth from '../../components/svg/profile/Sixth';
import Flag from '../../components/svg/profile/Flag';
import Info from '../../components/svg/profile/Info';
import { useRouter } from "expo-router"
import { AuthenticatedContext } from '../../context/Authenticateduser'
import auth from '@react-native-firebase/auth';
import Toggle from "react-native-toggle-input";
import Subscription from '../../components/svg/profile/Subscription';

const Profile = () => {
  const router = useRouter();
  const { handleLogoutUser } = useContext(AuthenticatedContext)
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [isToggle, setIsToggle] = useState(true)

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <View className="flex-1 bg-white">
       <View className="flex-2 flex-row top-10 gap-3 items-center p-2">
        <AntDesign name="arrowleft" size={30} color="black" />
        <Text style={{ fontFamily: "PoppinsBold" }} className="text-xl">
          Profile
        </Text>
      </View>

      <View className="flex-1 p-4 mt-10 mb-14">
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
      <View className="flex-2">
            <View  className="flex-2 bg-gray-200  p-4 rounded-lg">
             <Pressable onPress={()=>{router.replace('/(profile)/Details')}}>
             <View className="flex-row gap-3 items-center mb-4">
                <First/>
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg">Account</Text>
              </View>
             </Pressable>
            <Pressable onPress={()=>{router.replace('/(auth)/Forgotpassword')}}>
              
            <View className="flex-row gap-3 items-center mb-4">
                <Second/>
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg mt-2">Change Password</Text>
              </View>
            </Pressable>
             <Pressable onPress={()=>{router.replace('/(profile)/Privacy')}}>
             <View className="flex-row items-center mb-4 justify-between">
               <View className="flex-row gap-3 items-center">
               <Third/>
               <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg pl-1">Notifications</Text>
               </View>
               <Toggle
                toggle={isToggle}
                setToggle={setIsToggle}
                color={"#007AFF"}
                size={15}
                filled={true}
                circleColor={"white"}
                // onTrue={}
                // onFalse={}
              />
              </View>
             </Pressable>

             <Pressable onPress={()=>{router.replace('/(profile)/Privacy')}}>
             <View className="flex-row items-center justify-between">
               <View className="flex-row gap-3 items-center">
               <Fourth/>
               <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg pl-1">My Location and Sharing</Text>
               </View>
               <Toggle
                toggle={isToggle}
                setToggle={setIsToggle}
                color={"#007AFF"}
                size={15}
                filled={true}
                circleColor={"white"}
                // onTrue={}
                // onFalse={}
              />
              </View>
             </Pressable>
             
            </View>
          </View>

          <View className="flex-2 mt-4">
            <View  className="flex-2 bg-gray-200 mt-2 p-4 rounded-lg">
             <Pressable>
             <View className="flex-row gap-3 items-center mb-4">
                <Fifth/>
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg">Share App</Text>
              </View>
             </Pressable>
            <Pressable>
            <Pressable onPress={()=>{router.replace('/(profile)/Feedback')}}>
            <View className="flex-row gap-3 items-center mb-4">
                <Sixth/>
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg mt-2">Send Feedback</Text>
              </View>
            </Pressable>
            </Pressable>
              <Pressable onPress={()=>{router.replace('/(profile)/Info')}}>
              <View className="flex-row gap-3 items-center pl-1">
                <Info/>
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg">Info</Text>
              </View>
              </Pressable>
             
            </View>
          </View>

          <View className="flex-1 mt-3">
            <View  className="flex-2 bg-gray-200 mt-2 p-4 rounded-lg">
            <Pressable onPress={()=>{router.replace('/(profile)/Subscriptions')}}>
             <View className="flex-row items-center justify-between   ">
               <View className="flex-row gap-3 items-center">
               <Subscription/>
               <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg pl-1">Subscription</Text>
               </View>
               <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg text-secondary pl-1">Active</Text>
              </View>
             </Pressable>
            </View>
          </View>
         </ScrollView>
          
      </View>

    </View>
  )
}

export default Profile