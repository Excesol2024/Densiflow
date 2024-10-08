import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { useRouter } from 'expo-router';
import PropTypes from 'prop-types';
import Lock from "../../components/svg/Lock";
import Eye from "../../components/svg/Eye";
import Arrowright from "../../components/svg/Arrowright";

const ResetPassword = ({password, setPassword, confirmationPassword, setConfirmationPassword, handleResetPassword}) => {
    const router = useRouter();



  return (
    <View className="flex-1 p-4">
       <View className="mt-8 flex-row items-center">
        <TouchableOpacity onPress={() => router.push("/Login")}>
          <AntDesign name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View className="flex-1 justify-start mt-9">
        <Text style={{ fontFamily: 'PoppinsMedium' }} className="text-3xl mb-3">Reset Password</Text>
        <Text style={{ fontFamily: 'PoppinsMedium' }} className="mb-4">Please type something you’ll remember</Text>
        
        <View className="flex-row items-center border border-gray-300 rounded-lg p-3 mb-4">
        <Lock className=" text-gray-400 ml-1" />
        <TextInput
          placeholder="New Password"
          placeholderTextColor={'#747688'}
          className="ml-3 flex-1"
          style={{ fontFamily: "PoppinsMedium" }}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Eye />
      </View>

      <View className="flex-row items-center border border-gray-300 rounded-lg p-3 mb-4">
        <Lock className=" text-gray-400 ml-1" />
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor={'#747688'}
          className="ml-3 flex-1"
          style={{ fontFamily: "PoppinsMedium" }}
          value={confirmationPassword}
          onChangeText={setConfirmationPassword}
          secureTextEntry
        />
        <Eye />
      </View>

      <View className=" ml-8 mr-8 mt-4">
    <TouchableOpacity
        className="bg-secondary p-4 rounded-xl shadow-2xl shadow-primary"
        onPress={handleResetPassword}
      >
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-white text-center text-lg tracking-widest">
          RESET PASSWORD
        </Text>
        <View className="absolute right-3 top-3 bg-primary p-2 rounded-full">
        <Arrowright className=""/>
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
  };
