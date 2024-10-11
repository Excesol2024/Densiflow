import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";
import MessageSvg from "../../components/svg/message";
import AntDesign from "@expo/vector-icons/AntDesign";
import GreenSvg from "../../components/svg/Green";
import YellowSvg from "../../components/svg/Yellow";
import RedSvg from "../../components/svg/Red";
import Alert1 from "../../components/svg/Alert1";
import Alert2 from "../../components/svg/Alert2";
import Alert3 from "../../components/svg/Alert3";

const Alerts = () => {
  const [isNotification, setIsNotification] = useState(false);

  const Notifications = [
    {
      name: "Green Tree Cafe!",
      element: GreenSvg,
      description: 'is currently not crowded with only 10 people. Perfect for you!',
      time: '10 seconds',
    },
    {
      name: "Sunset Lake Park",
      element: YellowSvg,
      description: 'is currently Moderately Busy with 25 people. Close to your preference!',
      time: '2 minutes',
    },
    {
      name: "Firefly Roodeck",
      element: RedSvg,
      description: 'is currently Very Crowded with 75 people. Above your preference!',
      time: '3 hours',
    },
    {
      name: "Announcements!",
      element: Alert1,
      description: 'is currently Very Crowded with 75 people. Above your preference!',
      time: '10 seconds',
    },
    {
      name: "New Features!",
      element: Alert2,
      description: 'is currently Moderately Busy with 25 people. Close to your preference!',
      time: '2 minutes',
    },
    {
      name: "App Updates",
      element: Alert3,
      description: 'is currently Very Crowded with 75 people. Above your preference!',
      time: '3 hours',
    },
  ]


  return (
    <View className="flex-1 bg-white">
      <View className="flex-row top-11 gap-3 items-center p-3 bg-white z-20">
        <AntDesign name="arrowleft" size={30} color="black" />
        <Text style={{ fontFamily: "PoppinsBold" }} className="text-xl">
          Notifications
        </Text>
      </View>

      {/** NO NOTIFICATIONS */}
      <View className="flex-1 items-center justify-center p-4 hidden">
        <View className="flex-1 items-center justify-center p-4">
          <MessageSvg />
          <Text
            style={{ fontFamily: "PoppinsThin" }}
            className="text-xl text-secondary mt-1"
          >
            No Notifications!
          </Text>

          <Text
            style={{ fontFamily: "PoppinsThin" }}
            className="text-center text-lg mt-2"
          >
            We’ll let you know when there will be something to update you.
          </Text>
        </View>
      </View>

        <ScrollView style={{display: 'flex', flex: 1}}>
           {/** NOTIFICATIONS */}
      <View className="flex-1 p-4 mt-8">
       {Notifications.map((notif, index)=>(
         <View key={index} className="flex-row gap-2 items-center mt-3">
         <Text style={{ fontFamily: "PoppinsThin" }} className="absolute top-[-1] right-3 text-gray-400">{notif.time}</Text>
         <notif.element />
         <View className="flex-1 mt-3">
           <Text style={{ fontFamily: "PoppinsBold" }} className="text-lg">{notif.name}</Text>
           <Text style={{ fontFamily: "PoppinsThin" }} className="text-md ">
            {notif.description}
           </Text>
         </View>
       </View>
       ))}
  
        </View>
        </ScrollView>
    </View>
  );
};

export default Alerts;
