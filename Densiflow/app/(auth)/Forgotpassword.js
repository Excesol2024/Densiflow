import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { API } from "../../components/Unprotected/Api"
import AntDesign from '@expo/vector-icons/AntDesign';
import Passwordotp from './Passwordotp';
import ResetPassword from './Resetpassword.js';
import Email from "../../components/svg/Email";
import Arrowright from "../../components/svg/Arrowright"; 
import { LoadingEffectsContext } from '../../context/Loadingeffect.js';


const Forgotpassword = () => {
    const [email, setEmail] = useState('')
    const [isVerifyOtp, setIsVerifyOtp] = useState(false);
    const [isVerifyPassword, setIsVerifyPassword] = useState(false)
    const [emailErrors, setEmailErrors] = useState("")
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const router = useRouter();
    const [timer, setTimer] = useState(60); // Timer starting at 60 seconds
    const [isTimerActive, setIsTimerActive] = useState(true);
    const { setEffectLoading } = useContext(LoadingEffectsContext)
    const [otpError, setOtpError] = useState("");


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

    const handleInputChange = (field, value) => {
      // Update the specific field's value
      if (field === "email") {
        setEmail(value);
      }
    
      // Clear the error for the specific field
      if (emailErrors) {
        setEmailErrors("");
      }
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSendOtp = async () =>{
      setEffectLoading(true);
      if(email === ""){
        setEmailErrors("Email should not be empty")
        setEffectLoading(false);
        return
      } else if (!emailRegex.test(email)) {
        setEmailErrors("Please enter a valid email address.");
        setEffectLoading(false);
        return
      }

      const body = {
        email: email
      }

      try {
        const response = await API.sendOtp(body)
        if(response.data.status === "success"){
          setEffectLoading(false);
          setTimeout(() => {
            setIsVerifyOtp(true);
            setTimer(60); 
            setIsTimerActive(true); 
          }, 1000);
        }else if(response.data.status === "error"){
          setEmailErrors("User not found")
          setEffectLoading(false);
          return
        }
      } catch (error) {
        console.log(error)
        setEmailErrors("User not found")
        setEffectLoading(false);
      }
    }

    const handleResendOtp = async() => {
      setEffectLoading(true);
      const body = {
        email: email
      }

      try {
        const response = await API.sendOtp(body)
        if(response.data.status === "success"){
          setEffectLoading(false);
          setTimeout(() => {
            setTimer(60); 
            setIsTimerActive(true); 
          }, 1000);
        }else if(response.data.status === "error"){
          Alert.alert("User not found");
          return
        }
      } catch (error) {
        console.log(error)
        Alert.alert("User not found");
      }

    }

    const handleValidateOtp = async () =>{
      const otpString = otp.join('');

    setEffectLoading(true)
      const body = {
        email: email,
        otp: otpString
      }
      console.log(body)
      try {
        const response = await API.validateOtp(body);
        if(response.data.status === "success"){
          setEffectLoading(false)
            setEffectLoading(false)
            setTimeout(() => {
             setIsVerifyOtp(false);
             setIsVerifyPassword(true)
            }, 1000);
        }
      } catch (error) {
        console.log("ERROR",error)
         setOtpError("The verification code is invalid or expired.");
        setEffectLoading(false)
      }
    }

    const handleResetPassword = async () => {

      if (password.length < 8) {
        Alert.alert("Validation Error", "Password must be at least 8 characters long.");
        return;
      }
  
      if (password !== confirmPassword) {
        Alert.alert("Validation Error", "Passwords do not match!");
        return;
      }

      setEffectLoading(true)
      const body = {
        email: email,
        otp: otp,
        password: password,
        password_confirmation: confirmPassword,
      }

      try {
        const response = await API.resetPassword(body)
        if(response.data.status === "success"){
          setTimeout(() => {
            router.push('/Success')
          }, 1000);
        }
      } catch (error) {
        console.log(error)
      }
    }

  return (
    <>
    {isVerifyOtp ? <>
    <Passwordotp email={email} otp={otp} setOtp={setOtp} isTimerActive={isTimerActive} 
    timer={timer} handleResendOtp={handleResendOtp} handleVerifyOtp={handleValidateOtp} otpError={otpError} setOtpError={setOtpError}/>
    </> : isVerifyPassword ? <>
      <ResetPassword password={password} setPassword={setPassword} confirmationPassword={confirmPassword}
       setConfirmationPassword={setConfirmPassword} handleResetPassword={handleResetPassword}/>
    </> : <>
    <View className="flex-1  p-4">
    <View className="mt-8 flex-row items-center">
        <TouchableOpacity onPress={() => router.push("/")}>
          <AntDesign name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
      </View>
     <View className="flex-1 justify-start mt-9">
     <Text style={{ fontFamily: 'PoppinsMedium' }} className="text-3xl mb-3">Reset Password</Text>
     <Text style={{ fontFamily: 'PoppinsMedium' }} className="mb-4">Please enter your email address to request a password reset</Text>
     <View className={`flex-row items-center border rounded-lg p-3 ${emailErrors ? "border-red-500" : "border-gray-300"}`}>
        <Email className=" text-gray-400" />
        <TextInput
          placeholder="example@gmail.com"
          placeholderTextColor={'#747688'}
          className="ml-3 flex-1"
          style={{ fontFamily: "PoppinsMedium" }}
          value={email}
          onChangeText={(text)=>handleInputChange("email", text)}
        />
      </View>
      {emailErrors && <Text style={{ fontFamily: 'PoppinsMedium' }} className="mb-4 text-red-500 mt-0.5 ml-0.5">{emailErrors}</Text>}
      <View className=" ml-8 mr-8 mt-4">
    <TouchableOpacity
        className="bg-secondary p-3.5 rounded-xl shadow-2xl shadow-primary"
        onPress={handleSendOtp}
      >
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-white text-center text-lg tracking-widest">
          SEND
        </Text>
        <View className="absolute right-3 top-3 bg-primary p-2 rounded-full">
        <Arrowright className=""/>
        </View>
      </TouchableOpacity>
    </View>
     </View>
    </View>
    </>
    
    }
    </>
  )
}

export default Forgotpassword