import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import MessageSvg from "../../components/svg/message";
import AntDesign from "@expo/vector-icons/AntDesign";
import GreenSvg from "../../components/svg/Green";
import YellowSvg from "../../components/svg/Yellow";
import RedSvg from "../../components/svg/Red";
import Alert1 from "../../components/svg/Alert1";
import Alert2 from "../../components/svg/Alert2";
import Alert3 from "../../components/svg/Alert3";
import { API } from "../../components/Protected/Api";
import { formatDistanceToNow } from 'date-fns';

import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

const Alerts = () => {
  const [Notification, setNotification] = useState([]);

  const Notifications = [
    {
      name: "Green Tree Cafe!",
      element: GreenSvg,
      description:
        "is currently not crowded with only 10 people. Perfect for you!",
      time: "10 seconds",
    },
    {
      name: "Sunset Lake Park",
      element: YellowSvg,
      description:
        "is currently Moderately Busy with 25 people. Close to your preference!",
      time: "2 minutes",
    },
    {
      name: "Firefly Roodeck",
      element: RedSvg,
      description:
        "is currently Very Crowded with 75 people. Above your preference!",
      time: "3 hours",
    },
    {
      name: "Announcements!",
      element: Alert1,
      description:
        "is currently Very Crowded with 75 people. Above your preference!",
      time: "10 seconds",
    },
    {
      name: "New Features!",
      element: Alert2,
      description:
        "is currently Moderately Busy with 25 people. Close to your preference!",
      time: "2 minutes",
    },
    {
      name: "App Updates",
      element: Alert3,
      description:
        "is currently Very Crowded with 75 people. Above your preference!",
      time: "3 hours",
    },
  ];

  const handleGetUserNotifications = async () => {
    try {
      const response = await API.userNotifications();
      const sortedFiltered = response.data.data.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA; // Sort in descending order of created_at
      });
      setNotification(sortedFiltered);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNotifications = async (id) => {
    console.log(id);
    const arr = [...Notification];
    const index = arr.findIndex((item) => item.id === id);
    arr.splice(index, 1); // Remove the item from the array
    setNotification(arr);
    try {
      const response = await API.deleteNotifications({ id: id });
      console.log(response.data);
      if (response.data) {
        handleGetUserNotifications();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetUserNotifications();
  }, []);

  const RightSwipe = (id) => {
    console.log(id);
    return (
      <Pressable
        onPress={() => deleteNotifications(id)}
        className="flex-row  justify-end items-center bg-red-500 shadow-lg shadow-gray-900 mt-3 p-3"
      >
        <AntDesign name="delete" size={24} color="white" />
        <Text style={{ fontFamily: "PoppinsBold" }} className="text-white ml-2">
          Delete
        </Text>
      </Pressable>
    );
  };

  return (
    <GestureHandlerRootView className="flex-1">
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

        <ScrollView style={{ flex: 1 }} className="mt-4">
          {/* NOTIFICATIONS */}
          <View className="flex-1 p-4  mb-16">
            {Notification.filter(
              (notif) =>
                notif.crowd_status &&
                notif.crowd_status !== "unknown" &&
                notif.crowd_status !== "null"
            ).map((notif) => (
              <Swipeable
                animationOptions={true}
                friction={1}
                overshootRight={false}
                renderRightActions={() => RightSwipe(notif.id)}
                key={notif.id}
              >
                <View className="flex-row gap-2 bg-white items-center mt-3">
                  {/* Time formatting */}
                  <Text
                    style={{ fontFamily: "PoppinsThin" }}
                    className="absolute top-[-1] right-3 text-gray-400"
                  >
                   {formatDistanceToNow(new Date(notif.scheduled_time), { addSuffix: true })}
                  </Text>
                  {notif.crowd_status === "low" ? (
                    <GreenSvg />
                  ) : notif.crowd_status === "medium" ? (
                    <YellowSvg />
                  ) : notif.crowd_status === "high" ? (
                    <RedSvg />
                  ) : (
                    ""
                  )}
                  <View className="flex-1 mt-3">
                    <Text
                      style={{ fontFamily: "PoppinsBold" }}
                      numberOfLines={1}
                      className="text-lg w-44"
                    >
                      {notif.name}
                    </Text>
                    <Text
                      style={{ fontFamily: "PoppinsThin" }}
                      className="text-md "
                    >
                      {notif.crowd_status === "low"
                        ? "is currently not crowded with only 10 people. Perfect for you!"
                        : "is experiencing moderate crowding, but still a good option!"}
                    </Text>
                  </View>
                </View>
              </Swipeable>
            ))}
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default Alerts;
