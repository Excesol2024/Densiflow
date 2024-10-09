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
import Logout from '../../components/svg/profile/Logout';
import { useRouter } from "expo-router"
import { AuthenticatedContext } from '../../context/Authenticateduser'
import auth from '@react-native-firebase/auth';

const Profile = () => {
  const router = useRouter();
  const { handleLogoutUser } = useContext(AuthenticatedContext)
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

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
    <View className="flex-1">
       <View className="flex-2 flex-row top-10 gap-3 items-center p-3">
        <AntDesign name="arrowleft" size={30} color="black" />
        <Text style={{ fontFamily: "PoppinsBold" }} className="text-xl">
          Profile
        </Text>
      </View>

      <View className="flex-1 p-5 mt-10 mb-14">
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
      <View className="flex-2">
            <Text style={{ fontFamily: "PoppinsBold" }} className="text-xl">Account</Text>
            <View  className="flex-2 bg-gray-200 mt-2 p-4 rounded-xl">
             <Pressable onPress={()=>{router.replace('/(profile)/Account')}}>
             <View className="flex-row gap-3 items-center mb-3">
                <First/>
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg">Account</Text>
              </View>
             </Pressable>
            <Pressable>
            <View className="flex-row gap-3 items-center mb-3">
                <Second/>
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg mt-2">Notifications</Text>
              </View>
            </Pressable>
             <Pressable onPress={()=>{router.replace('/(profile)/Privacy')}}>
             <View className="flex-row gap-3 items-center">
                <Third/>
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg pl-1">Privacy</Text>
              </View>
             </Pressable>
             
            </View>
          </View>

          <View className="flex-2 mt-4">
            <Text style={{ fontFamily: "PoppinsBold" }} className="text-xl">Support & About</Text>
            <View  className="flex-2 bg-gray-200 mt-2 p-4 rounded-xl">
             <Pressable>
             <View className="flex-row gap-3 items-center mb-3">
                <Fourth/>
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg">My Subscribtion</Text>
              </View>
             </Pressable>
            <Pressable>
            <View className="flex-row gap-3 items-center mb-3">
                <Fifth/>
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg mt-2">Help and Support</Text>
              </View>
            </Pressable>
              <Pressable onPress={()=>{router.replace('/(profile)/Terms')}}>
              <View className="flex-row gap-3 items-center">
                <Sixth/>
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg">Terms and Policies</Text>
              </View>
              </Pressable>
             
            </View>
          </View>

          <View className="flex-1 mt-4">
            <Text style={{ fontFamily: "PoppinsBold" }} className="text-xl">Actions</Text>
            <View  className="flex-2 bg-gray-200 mt-2 p-4 rounded-xl">
              <View className="flex-row gap-3 items-center mb-2">
                <Flag/>
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg">Report a problem</Text>
              </View>
              <Pressable onPress={handleLogoutUser}>
              <View className="flex-row gap-3 items-center mb-2">
                <Logout/>
                <Text style={{ fontFamily: "PoppinsMedium" }} className="text-lg mt-2">Logout</Text>
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