import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";

const Terms = () => {
  const router = useRouter();

  const termsAndConditions = [
    {
        name: "Acceptance of Terms",
        description: "By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service."
    },
    {
        name: "Changes to Terms",
        description: "We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect."
    },
    {
        name: "Account Registration",
        description: "You must register for an account to use certain features of the Service. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete."
    },
    {
        name: "User Content",
        description: "Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material"
    },
  ]

  return (
    <SafeAreaView className="flex-1">
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <TouchableOpacity
          onPress={() => {
            router.push("/(tabs)/profile");
          }}
        >
          <AntDesign name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "PoppinsMedium", fontSize: 20, marginLeft: 10 }}
        >
          Back
        </Text>
      </View>

      <View className="flex-1">
        <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
          <Text
            className="text-center text-secondary"
            style={{ fontFamily: "PoppinsMedium", fontSize: 24 }}
          >
            Terms and Conditions
          </Text>
          <View className="p-6">
            <Text style={{ fontFamily: "PoppinsMedium", fontSize: 15 }}>
              Please read these Terms and Conditions ("Terms", "Terms and
              Conditions") carefully before using the Crodensify mobile
              application (the "Service") operated by Exceptional Solution
              ("us", "we", or "our").
            </Text>
                
            {termsAndConditions.map((terms, index)=>(
                   <View key={index} className="mt-5">
                   <Text style={{ fontFamily: "PoppinsBold", fontSize: 17 }}>
                   {terms.name}
                   </Text>
                   <Text style={{ fontFamily: "PoppinsMedium", fontSize: 15 }}>
                    {terms.description}
                   </Text>
                 </View>
            ))}
        
          </View>
          
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Terms;
