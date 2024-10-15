import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native'
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useContext, useState } from 'react'
import { useRouter } from 'expo-router'
import { AuthenticatedContext } from '../../context/Authenticateduser'
import * as ImagePicker from 'expo-image-picker';
import storage from '@react-native-firebase/storage';
import { utils } from '@react-native-firebase/app';
import { API } from '../../components/Protected/Api';
import Loadingscreen from '../../components/Modal'
const Details = () => {
  const router = useRouter()
  const { currentUser, handleLogoutUser } = useContext(AuthenticatedContext)
  const [downloadURL, setDownloadURL] = useState('');
  const [isLoading, setIsLoading] = useState(false)

  // Function to pick an image from the gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Check if the user canceled picking the image
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      console.log('Selected Image URI: ', uri);
      uploadFile(uri);
    } else {
      console.log('Image selection canceled');
    }
  };

  const uploadFile = async (uri) => {
    setIsLoading(true)
    try {
      // Generate a unique file name for Firebase Storage
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const reference = storage().ref(`images/${filename}`); // Reference to Firebase Storage

      const task = reference.putFile(uri); // Upload the file
    
      // Track the upload progress
      task.on('state_changed', taskSnapshot => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      });

      // Once the upload is complete, get the download URL
      task.then(async () => {
        const url = await reference.getDownloadURL();
        setDownloadURL(url); // Store the download URL
        console.log('File uploaded successfully! Download URL: ', url);
        if(url){
          const body = {
            photo_url: url
          }
          const response = await API.uploadProfilePicture(body)
          if(response.data){
            setIsLoading(false);
            router.push('/')
          }
        }
      }).catch(error => {
        console.log('Upload error: ', error.code, error.message);
      });

    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  };

  return (
    <View className="flex-1 p-4">
      <Loadingscreen isLoading={isLoading}/>
         <View className="mt-8 flex-row items-center">
        <TouchableOpacity className="flex-row items-center" onPress={() => router.push("/(tabs)/Settings")}>
          <AntDesign name="arrowleft" size={30} color="black" />
          <Text
          style={{ fontFamily: "PoppinsMedium" }}
          className="text-lg text-center ml-2"
        >
         Settings
        </Text>
        </TouchableOpacity>
      </View>

    <View className="flex-1 mt-10 items-center">
    <View className="flex justify-center items-center w-44">
   
    <Image source={{ uri: currentUser.user.photo_url }} className="h-36 w-36 rounded-full border-2 border-secondary" />
    
    <Pressable onPress={pickImage}>
      <Text style={{fontFamily: "PoppinsMedium"}} className="text-secondary mt-1">set Picture</Text>
    </Pressable>
      <Text style={{fontFamily: "PoppinsBold"}} className="border-b-2 mb-2 w-full border-gray-300 text-center text-secondary p-1 text-lg">{currentUser.user.name}</Text>
      <Text style={{fontFamily: "PoppinsMedium"}} className="text-gray-400 text-md">username</Text>
    </View>
    </View>

    <View className="flex-2 items-center h-44">
    <View className="w-56">
    <TouchableOpacity
        className="bg-secondary p-4 rounded-xl shadow-2xl shadow-primary"
        onPress={handleLogoutUser}
      >
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-white text-center text-lg tracking-widest">
          LOG OUT
        </Text>

      </TouchableOpacity>
      <TouchableOpacity
        className="bg-red-600 p-4 rounded-xl shadow-2xl shadow-primary mt-4"
        onPress={()=>{router.push('/Account')}}
      >
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-white text-center text-lg tracking-widest">
          DELETE ACCOUNT
        </Text>

      </TouchableOpacity>
    </View>
   </View>

    </View>
  )
}

export default Details