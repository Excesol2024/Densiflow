import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";

const Help = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1">
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
      <TouchableOpacity className="flex-row items-center" onPress={()=>{router.push('/Info')}}>
          <AntDesign name="arrowleft" size={30} color="black" />
          <Text
          style={{ fontFamily: "PoppinsMedium", fontSize: 20, marginLeft: 10 }}
        >
          Back
        </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
          <Text
            className="text-center text-secondary"
            style={{ fontFamily: "PoppinsMedium", fontSize: 24 }}
          >
            Help
          </Text>
          <View className="p-6">
            <Text style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
              Crodensify we are committed to protecting your personal
              information and your right to privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our mobile application.
            </Text>
            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
                Information We Collect
              </Text>
              <Text style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
              We collect the following types of information:
              </Text>
              <View className="flex-row gap-1 mt-1">
                <View style={{marginTop: 20, position: 'absolute', width: 7, height: 7, backgroundColor: 'black', top: 6.4, borderRadius: 100}} ></View>
                <Text className="pl-4"  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
              Personal information (e.g., name, email address)
              when you create an account
              </Text>
              </View>
              <View className="flex-row gap-1">
                <View style={{marginTop: 20, position: 'absolute', width: 7, height: 7, backgroundColor: 'black', top: 6.4, borderRadius: 100}} ></View>
                <Text className="pl-4"  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
                Location data to provide location-based services
              </Text>
              </View>
              <View className="flex-row gap-1">
                <View style={{marginTop: 20, position: 'absolute', width: 7, height: 7, backgroundColor: 'black', top: 6.4, borderRadius: 100}} ></View>
                <Text className="pl-4"  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
                Usage data, including your interactions
      with the app and search history
              </Text>
              </View>
              <View className="flex-row gap-1">
                <View style={{marginTop: 20, position: 'absolute', width: 7, height: 7, backgroundColor: 'black', top: 6.4, borderRadius: 100}} ></View>
                <Text className="pl-4"  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
                Device information
              </Text>
              </View>
            </View>
            <View className="mt-5">
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 18 }}>
              How We Use Your Information
              </Text>
              <Text style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
              We use your information to:
              </Text>
              <View className="flex-row gap-1 mt-1">
                <View style={{marginTop: 20, position: 'absolute', width: 7, height: 7, backgroundColor: 'black', top: 6.4, borderRadius: 100}} ></View>
                <Text className="pl-4"  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
                Provide and maintain our service
              </Text>
              </View>
              <View className="flex-row gap-1">
                <View style={{marginTop: 20, position: 'absolute', width: 7, height: 7, backgroundColor: 'black', top: 6.4, borderRadius: 100}} ></View>
                <Text className="pl-4"  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
                Personalize your experience
              </Text>
              </View>
              <View className="flex-row gap-1">
                <View style={{marginTop: 20, position: 'absolute', width: 7, height: 7, backgroundColor: 'black', top: 6.4, borderRadius: 100}} ></View>
                <Text className="pl-4"  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
                Improve our app
              </Text>
              </View>
              <View className="flex-row gap-1">
                <View style={{marginTop: 20, position: 'absolute', width: 7, height: 7, backgroundColor: 'black', top: 6.4, borderRadius: 100}} ></View>
                <Text className="pl-4"  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
                Communicate with you
              </Text>
              </View>
              <View className="flex-row gap-1">
                <View style={{marginTop: 20, position: 'absolute', width: 7, height: 7, backgroundColor: 'black', top: 6.4, borderRadius: 100}} ></View>
                <Text className="pl-4"  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
                Provide customer support
              </Text>
              </View>
              <View className="flex-row gap-1">
                <View style={{marginTop: 20, position: 'absolute', width: 7, height: 7, backgroundColor: 'black', top: 6.4, borderRadius: 100}} ></View>
                <Text className="pl-4"  style={{ fontFamily: "PoppinsMedium", fontSize: 16 }}>
                Ensure the security of our service
              </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Help;
