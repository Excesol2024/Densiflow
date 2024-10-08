import { View, Text, Image } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import LocationSvg from "../../components/svg/location";
import MiniSvg from "../../components/svg/mini";

const Saved = () => {
  const savedPlaces = [
    {
      name: "Sunset Lake, ",
      subaddress: "Bonifacio Global City",
      address: "Radius Gallery • Santa Cruz, CA",
      busyness: "red",
      image: `${require("../../assets/tabs/s1.png")}`,
    },
    {
      name: "Moon Fun Restaurant,",
      subaddress: "Center Manila",
      address: "Radius Gallery • Santa Cruz, CA",
      busyness: "green",
      image: `${require("../../assets/tabs/s22.png")}`,
    },
    {
      name: "FireFly Roofdeck,",
      subaddress: "Makati Hotel",
      address: "Radius Gallery • Santa Cruz, CA",
      busyness: "yellow",
      image: `${require("../../assets/tabs/s3.png")}`,
    },
  ];
  return (
    <View className="flex-1 ">
      <View className="flex-row top-11 gap-3 items-center p-3">
        <AntDesign name="arrowleft" size={30} color="black" />
        <Text style={{ fontFamily: "PoppinsBold" }} className="text-xl">
          Saved Places
        </Text>
      </View>

      {/** NO SAVED */}
      <View className="flex-1 items-center justify-center p-4 hidden">
        <View className="flex-1 items-center justify-center p-4">
          <LocationSvg />
          <Text
            style={{ fontFamily: "PoppinsThin" }}
            className="text-xl text-secondary mt-1"
          >
            No Saved Places
          </Text>

          <Text
            style={{ fontFamily: "PoppinsThin" }}
            className="text-center text-lg mt-2"
          >
            You haven’t saved any places yet. Start adding your favorites to
            keep track of them here!
          </Text>
        </View>
      </View>

      <View className="flex-1 p-3 mt-8">
        {savedPlaces.map((places, index) => (
          <View
            key={index}
            className="flex-row items-center p-3 mt-3 bg-white  shadow-lg rounded-2xl shadow-gray-950 relative"
          >
            <View
              className={`w-3 h-3 absolute rounded-full top-3 right-3
${
  places.busyness === "red"
    ? "bg-red-500"
    : places.busyness === "yellow"
    ? "bg-yellow-300"
    : places.busyness === "green"
    ? "bg-green-500"
    : ""
} ml-1`}
            ></View>
            <Image source={places.image} className="rounded-2xl" />
            <View className="flex-1 pl-2">
              <Text
                style={{ fontFamily: "PoppinsBold" }}
                className="text-md pl-1"
              >
                {places.name}
              </Text>
              <Text
                style={{ fontFamily: "PoppinsBold" }}
                className="text-md pl-1"
              >
                {places.subaddress}
              </Text>

              <View className="flex-row gap-1">
                <MiniSvg />
                <Text
                  style={{ fontFamily: "PoppinsThin", fontSize: 12 }}
                  className=" "
                >
                  {places.address}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Saved;
