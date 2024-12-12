import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import PropTypes from "prop-types";
import Lock from "../../components/svg/Lock";
import Eye from "../../components/svg/Eye";
import Arrowright from "../../components/svg/Arrowright";
import Unhide from "../../components/svg/Unhide";

const ResetPassword = ({
  password,
  setPassword,
  confirmationPassword,
  setConfirmationPassword,
  handleResetPassword,
  errors,
  setErrors,
}) => {
  const router = useRouter();
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true);
  const handleInputChange = (field, text) => {
    // Update the respective field
    if (field === "password") {
      setPassword(text);
    } else if (field === "confirmationPassword") {
      setConfirmationPassword(text);
    }

    // Clear the error for the specific field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "", // Clear the error for the given field
    }));
  };

  return (
    <View className="flex-1 p-4">
      <View className="mt-8 flex-row items-center">
        <TouchableOpacity onPress={() => router.push("/Login")}>
          <AntDesign name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View className="flex-1 justify-start mt-9">
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-3xl mb-3">
          Reset Password
        </Text>
        <Text style={{ fontFamily: "PoppinsMedium" }} className="mb-4">
          Please type something you’ll remember
        </Text>

        <View className="flex-2 mb-3">
          <View
            className={`flex-row items-center border rounded-lg p-3 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          >
            <Lock className=" text-gray-400 ml-1" />
            <TextInput
              placeholder="New Password"
              placeholderTextColor={"#747688"}
              className="ml-3 flex-1"
              style={{ fontFamily: "PoppinsMedium" }}
              value={password}
              onChangeText={(text) => handleInputChange("password", text)}
              secureTextEntry={passwordHidden}
            />
            {passwordHidden ? (
              <Pressable onPress={() => setPasswordHidden(false)}>
                <Eye />
              </Pressable>
            ) : (
              <Pressable onPress={() => setPasswordHidden(true)}>
                <Unhide />
              </Pressable>
            )}
          </View>
          {errors.password && (
            <Text
              style={{ fontFamily: "PoppinsMedium" }}
              className="mt-0.5 text-red-500"
            >
              {errors.password}
            </Text>
          )}
        </View>

        <View className="flex-2 mb-3">
          <View
            className={`flex-row items-center border rounded-lg p-3 ${
              errors.confirmationPassword ? "border-red-500" : "border-gray-300"
            }`}
          >
            <Lock className=" text-gray-400 ml-1" />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={"#747688"}
              className="ml-3 flex-1"
              style={{ fontFamily: "PoppinsMedium" }}
              value={confirmationPassword}
              onChangeText={(text) =>
                handleInputChange("confirmationPassword", text)
              }
              secureTextEntry={confirmPasswordHidden}
            />
            {confirmPasswordHidden ? (
              <Pressable onPress={() => setConfirmPasswordHidden(false)}>
                <Eye />
              </Pressable>
            ) : (
              <Pressable onPress={() => setConfirmPasswordHidden(true)}>
                <Unhide />
              </Pressable>
            )}
          </View>
          {errors.confirmationPassword && (
            <Text
              style={{ fontFamily: "PoppinsMedium" }}
              className="mt-0.5 text-red-500"
            >
              {errors.confirmationPassword}
            </Text>
          )}
        </View>
        <View className=" ml-8 mr-8 mt-4">
          <TouchableOpacity
            className="bg-secondary p-4 rounded-xl shadow-2xl shadow-primary"
            onPress={handleResetPassword}
          >
            <Text
              style={{ fontFamily: "PoppinsMedium" }}
              className="text-white text-center text-lg tracking-widest"
            >
              RESET PASSWORD
            </Text>
            <View className="absolute right-3 top-3 bg-primary p-2 rounded-full">
              <Arrowright className="" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ResetPassword;

ResetPassword.propTypes = {
  password: PropTypes.string.isRequired,
  confirmationPassword: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  setConfirmationPassword: PropTypes.func.isRequired,
  handleResetPassword: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    password: PropTypes.string,
    confirmationPassword: PropTypes.string,
  }).isRequired,
  setErrors: PropTypes.func.isRequired,
};
