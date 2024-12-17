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
import { formatDistanceToNowStrict } from "date-fns";
import SkeletonLoader from "../places/SkeletonLoader";

import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

const Alerts = () => {
  const [combinedAlerts, setCombinedAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const handleGetUserNotifications = async () => {
    try {
      const response = await API.userNotifications();
      // Ensure that response.data.data is an array; default to an empty array if not
      const notifications = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];
      // Safely filter notifications to exclude unwanted items
      return notifications.filter(
        (notif) => notif.crowd_status && notif.crowd_status !== "unknown"
      );
    } catch (error) {
      console.log("Error fetching notifications:", error);
      // Return an empty array on error
      return [];
    }
  };

  const fetchAppUpdates = async () => {
    try {
      const response = await API.appUpdates();
      // Ensure response structure is correct and handle edge cases
      return response?.data?.data || [];
    } catch (error) {
      console.log("Error fetching app updates:", error);
      // Return an empty array on error to ensure other data sources are unaffected
      return [];
    }
  };

  // const deleteNotifications = async (id) => {
  //   const updatedAlerts = combinedAlerts.filter((alert) => alert.id !== id);
  //   setCombinedAlerts(updatedAlerts);
  //   try {
  //     const response = await API.deleteNotifications({ id });
  //     if (response.data) {
  //       refreshAlerts();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const deleteNotifications = async (id) => {
    // Find the deleted alert based on the id
    const deletedAlert = combinedAlerts.find((alert) => alert.id === id);

    if (deletedAlert) {
      try {
        let response;

        // Determine if it's a notification or an app update and log the message
        if (deletedAlert.crowd_status !== undefined) {
          console.log(`Deleting notification with id: ${id}`);
          response = await API.deleteNotifications({ id });
        } else if (deletedAlert.notification_type !== undefined) {
          console.log(`Deleting app update with id: ${id}`);
          response = await API.deleteAppUpdates({ id });
        } else {
          console.log(`Deleting unknown alert type with id: ${id}`);
          return; // Exit early if it's an unknown type
        }

        // Only update the state if the API call was successful
        if (response.data) {
          const updatedAlerts = combinedAlerts.filter(
            (alert) => alert.id !== id
          );
          setCombinedAlerts(updatedAlerts);
          refreshAlerts();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const refreshAlerts = async () => {
    const notifications = await handleGetUserNotifications();
    const appUpdates = await fetchAppUpdates();

    const combined = [...notifications, ...appUpdates].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA; // Sort from newest to oldest
    });

    setCombinedAlerts(combined);
  };

  useEffect(() => {
    refreshAlerts();
  }, []);

 
  

  const RightSwipe = (id) => (
    <Pressable
      onPress={() => deleteNotifications(id)}
      className="flex-row justify-end items-center bg-red-500 shadow-lg mt-3 p-3"
    >
      <AntDesign name="delete" size={24} color="white" />
      <Text style={{ fontFamily: "PoppinsBold" }} className="text-white ml-2">
        Delete
      </Text>
    </Pressable>
  );

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-white">
        <View className="flex-row top-11 gap-3 items-center p-3 bg-white z-20">
          <AntDesign name="arrowleft" size={30} color="black" />
          <Text style={{ fontFamily: "PoppinsBold" }} className="text-xl">
            Notifications
          </Text>
        </View>

        {isLoading ? (
          <ScrollView style={{ flex: 1 }} className="mt-4">
            <View className="flex-1 p-4 mb-16 mt-3">
            {Array.from({ length: 10 }).map((_, index) => (
                    <View className="mt-2" key={index}>
                         <View className="flex-row">
                      <SkeletonLoader
                        width={65}
                        height={65}
                        borderRadius={8}
                      />
                      <View className="ml-2">
                        <SkeletonLoader
                          width={180}
                          height={15}
                          borderRadius={5}
                        />
                        <View className="mt-1 w-full">
                          <SkeletonLoader
                             width={253}
                            height={45}
                            borderRadius={8}
                          />
                        </View>
                      </View>
                    </View>
                    </View>
                  ))}
            </View>
          </ScrollView>
        ) : combinedAlerts.length > 0 ? (
          <ScrollView style={{ flex: 1 }} className="mt-4">
            <View className="flex-1 p-4 mb-16">
              {combinedAlerts.map((alert) => (
                <Swipeable
                  key={alert.id}
                  animationOptions={true}
                  friction={1}
                  overshootRight={false}
                  renderRightActions={() => RightSwipe(alert.id)}
                >
                  <View className="flex-row gap-2 justify-center bg-white items-center mt-3">
                    <Text
                      style={{ fontFamily: "PoppinsThin" }}
                      className="absolute top-[-1] right-3 text-gray-400"
                    >
                      {formatDistanceToNowStrict(new Date(alert.created_at))}
                    </Text>
                    <View className="">
                      {alert.crowd_status === "low" ? (
                        <GreenSvg />
                      ) : alert.crowd_status === "medium" ? (
                        <YellowSvg />
                      ) : alert.crowd_status === "high" ? (
                        <RedSvg />
                      ) : alert.notification_type === "info" ? (
                        <Alert1 />
                      ) : alert.notification_type === "features" ? (
                        <Alert2 />
                      ) : alert.notification_type === "update" ? (
                        <Alert3 />
                      ) : null}
                    </View>
                    <View className="flex-1 mt-3 h-16 justify-center">
                      <Text
                        style={{ fontFamily: "PoppinsBold", fontSize: 15 }}
                        numberOfLines={1}
                        className="w-44"
                      >
                        {alert.name || alert.title}
                      </Text>
                      <Text
                        style={{ fontFamily: "PoppinsThin" }}
                        className="text-md"
                      >
                        {alert.descriptions ||
                          (alert.crowd_status === "low"
                            ? "is currently not crowded with only 10+ people. Perfect for you!"
                            : alert.crowd_status === "medium"
                            ? "is moderately crowded with 15+ people. Plan accordingly."
                            : "is currently crowded with 30+ people. Consider visiting later!")}
                      </Text>
                    </View>
                  </View>
                </Swipeable>
              ))}
            </View>
          </ScrollView>
        ) : (
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
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default Alerts;
