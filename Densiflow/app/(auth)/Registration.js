import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Pressable, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { API } from "../../components/Unprotected/Api"
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Lodingscreen from "../../components/Modal"
import Otp from "./Otp"
import Email from "../../components/svg/Email";
import Lock from "../../components/svg/Lock"; 
import Eye from "../../components/svg/Eye"; 
import Arrowright from "../../components/svg/Arrowright"; 
import User from "../../components/svg/User";
import Google from "../../components/svg/Google";
import Facebook from "../../components/svg/Facebook";

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [otp, setOtp] = useState(''); // State for OTP input
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60); // Timer starting at 60 seconds
  const [isTimerActive, setIsTimerActive] = useState(true);

  const handleRegister = async () => {

    setIsLoading(true)
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      setIsLoading(false)
      return;
    }

    if (password === "" || confirmPassword === "") {
      Alert.alert('Error', 'Password must not be empty');
      setIsLoading(false)
      return;
    }

    if (email === "") {
      Alert.alert('Error', 'Email must not be empty');
      setIsLoading(false)
      return;
    }

    const body = {
        pending: {
          email: email,
          password: password
        }
    }

    try {
     const response = await API.initialRegister(body)
     if(response.data){
      setIsLoading(false)
      Alert.alert('Success', 'Registration successful. Please check your email for OTP.');
      setTimer(60)
      setIsTimerActive(true); 
      setTimeout(() => {
        setIsModalVisible(true);
      }, 1000);
     }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  
  };

  const handleCancelOtp = () => {
    setIsModalVisible(false);
    setOtp('')
    setTimer(60)
    setIsTimerActive(true); 
  }

  const handleVerifyOtp = async () => {
    // Handle OTP verification logic here
    // Alert.alert('OTP Verification', 'OTP verified successfully');
    // setIsModalVisible(false); // Close the modal after verification
    setIsLoading(true)
    const body = {
        email: email,
        otp: otp
    }
    try {
      const response = await API.register(body)
      console.log("FINAL REGISTER", response.data.status)
      if(response.data.status === "success"){
        setIsLoading(false)
          Alert.alert('OTP Verification', response.data.message);
          setIsModalVisible(false);
          setTimeout(() => {
            router.push('/')
          }, 2000);
      }
    } catch (error) {
      console.log("ERROR",error)
      Alert.alert('OTP Verification', error.error);
      setIsLoading(false)
    }
  
  };

  const handleResendCode = async () => {
    setIsLoading(true)

    const body = {
        pending: {
          email: email,
          password: password
        }
    }

    try {
     const response = await API.initialRegister(body)
     if(response.data){
      setIsLoading(false)
      Alert.alert('Success', 'New Otp sent to your email');
      setTimeout(() => {
        setIsModalVisible(true);
        setTimer(60); 
        setIsTimerActive(true); 
      }, 1000);
     }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  };

  useEffect(() => {
    if (!isTimerActive || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setIsTimerActive(false); // Stop the timer when it reaches 0
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  return (
   <SafeAreaView className="flex-1 bg-white">
      {isModalVisible ? <Otp email={email} 
   otp={otp} setOtp={setOtp}
   handleVerifyOtp={handleVerifyOtp} handleCancelOtp={handleCancelOtp} timer={timer} isTimerActive={isTimerActive} handleResendCode={handleResendCode} /> : 
    <View className="flex-1 justify-center p-4">
      <Lodingscreen isLoading={isLoading}/>

      <View className="mt-6 flex-row items-center">
        <TouchableOpacity onPress={() => router.push("/Login")}>
          <AntDesign name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
      </View>

      
    <View className="flex-1 justify-end ">
    <Text style={{ fontFamily: 'PoppinsMedium' }} className="text-2xl mb-6 text-start">Sign Up</Text>

    <View className="flex-row items-center border border-gray-300 rounded-lg p-3 mb-3">
        <User className=" text-gray-400" />
        <TextInput
          placeholder="Full name"
          className="ml-3 flex-1"
          style={{ fontFamily: "PoppinsMedium" }}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View className="flex-row items-center border border-gray-300 rounded-lg p-3 mb-3">
        <Email className=" text-gray-400" />
        <TextInput
          placeholder="example@gmail.com"
          className="ml-3 flex-1"
          style={{ fontFamily: "PoppinsMedium" }}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View className="flex-row items-center border border-gray-300 rounded-lg p-3 mb-3">
      <Lock className=" text-gray-400 ml-1" />
        <TextInput
          placeholder="Your Password"
          className="ml-3 flex-1"
          style={{ fontFamily: "PoppinsMedium" }}
          value={password}
          onChangeText={setPassword}
        />
         <Eye />
      </View>

      <View className="flex-row items-center border border-gray-300 rounded-lg p-3 mb-3">
        <Lock className=" text-gray-400 ml-1" />
        <TextInput
          placeholder="Confirm Password"
          className="ml-3 flex-1"
          style={{ fontFamily: "PoppinsMedium" }}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <Eye />
      </View>
      <View className=" ml-8 mr-8 mt-4">
    <TouchableOpacity
        className="bg-secondary p-3.5 rounded-xl shadow-2xl shadow-primary"
        onPress={handleRegister}
      >
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-white text-center text-lg tracking-widest">
          SIGN UP
        </Text>
        <View className="absolute right-3 top-3 bg-primary p-2 rounded-full">
        <Arrowright className=""/>
        </View>
      </TouchableOpacity>
    </View>
    </View>

<View className="flex-3 mt-2">
<Text
        style={{ fontFamily: "PoppinsMedium" }}
        className="text-center text-lg text-gray-400 mt-5"
      >
       OR
      </Text>
     <View className="flex-2 justify-center items-center">
     <View className="flex flex-row p-3 bg-white shadow-md w-64 rounded-xl shadow-gray-400 justify-center items-center mt-1">
       <Google/>
       <Text style={{ fontFamily: "PoppinsMedium" }} className="ml-3">Login with Google</Text>
      </View>
      <View className="flex flex-row p-3 bg-white shadow-md w-64 rounded-xl shadow-gray-400 justify-center items-center mt-2">
       <Facebook/>
       <Text style={{ fontFamily: "PoppinsMedium" }} className="ml-3">Login with Facebook</Text>
      </View>
     </View>
     <View className="flex-row items-center justify-center">
     <Text
        style={{ fontFamily: "PoppinsMedium" }}
        className="text-center text-md mt-7"
      >
       Already have an account?
      </Text>
      <Text
        style={{ fontFamily: "PoppinsMedium" }}
        onPress={() => router.push("/login")}
        className="text-center text-md mt-7 text-secondary ml-2"
      >
       Sign In
      </Text>
     </View>
</View>

    </View>
   }
   </SafeAreaView>
  );
};

export default Registration;
