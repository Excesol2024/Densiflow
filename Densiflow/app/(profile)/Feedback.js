import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import User from "../../components/svg/User";
import Email from "../../components/svg/Email";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from 'expo-router'
import { API } from '../../components/Protected/Api'
import Loadingscreen from '../../components/Modal'
import MessageSent from '../../components/modal/androidpopup/MessageSent'

const Feedback = () => {
    const router = useRouter();
    const [user, setUser] = useState({
      name: "",
      email: "",
      message: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    const handleShareFeedbacks = async () => {
      setIsLoading(true)
      const body = {
        name: user.name,
        email: user.email,
        message: user.message
      }

      try {
        const response = await API.shareFeedbacks(body)
        if(response.data){
          setIsLoading(false)
          setIsVisible(true)
          setTimeout(() => {
            setIsVisible(false)
            setUser({
              name: "",
              email: "",
              message: ""
            });
          }, 5000);
        }
      } catch (error) {
        console.log(error)
      }
    }


  return (
    <View className="flex-1 p-4">
      <Loadingscreen isLoading={isLoading}/>
      <MessageSent visible={isVisible} />
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

      <View className="flex-1 justify-start mt-9">
        <Text
          style={{ fontFamily: "PoppinsMedium" }}
          className="text-2xl text-center text-secondary mb-5"
        >
          Send Feedback
        </Text>

        <View className="flex-row items-center border border-gray-300 rounded-lg p-3 mb-3">
          <User className=" text-gray-400" />
          <TextInput
            placeholder="Your Name"
            className="ml-3 flex-1"
            value={user.name}
            onChangeText={(text) => setUser({ ...user, name: text })}
            style={{ fontFamily: "PoppinsMedium" }}
          />
        </View>
        <View className="flex-row items-center border border-gray-300 rounded-lg p-3 mb-3">
          <Email className=" text-gray-400" />
          <TextInput
            placeholder="Your Email"
            className="ml-3 flex-1"
            style={{ fontFamily: "PoppinsMedium" }}
            value={user.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
          />
        </View>

        <TextInput
          style={{
            fontFamily: "PoppinsThin",
            textAlignVertical: "top", // Aligns text to the top
            paddingTop: 10, // Adds space at the top
            paddingLeft: 12, // Padding on the left
            paddingRight: 8, // Padding on the right
            paddingBottom: 8, // Padding at the bottom
            height: 250, // Adjust height as needed
          }}
          className="border-gray-300 border-2 rounded-lg mt-2"
          placeholderTextColor="gray"
          placeholder="Message"
          value={user.message}
          onChangeText={(text) => setUser({ ...user, message: text })}
        />

        <View className=" ml-8 mr-8 mt-4">
          <TouchableOpacity onPress={handleShareFeedbacks} className="bg-secondary p-4 rounded-xl shadow-2xl shadow-primary">
            <Text
              style={{ fontFamily: "PoppinsMedium" }}
              className="text-white text-center text-lg tracking-widest"
            >
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Feedback;
