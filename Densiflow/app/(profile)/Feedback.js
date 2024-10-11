import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import User from "../../components/svg/User";
import Email from "../../components/svg/Email";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from 'expo-router'
const Feedback = () => {
    const router = useRouter()
  return (
    <View className="flex-1 p-4">
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
            style={{ fontFamily: "PoppinsMedium" }}
          />
        </View>
        <View className="flex-row items-center border border-gray-300 rounded-lg p-3 mb-3">
          <Email className=" text-gray-400" />
          <TextInput
            placeholder="Your Email"
            className="ml-3 flex-1"
            style={{ fontFamily: "PoppinsMedium" }}
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
        />

        <View className=" ml-8 mr-8 mt-4">
          <TouchableOpacity className="bg-secondary p-4 rounded-xl shadow-2xl shadow-primary">
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
