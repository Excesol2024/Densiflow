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
import AsyncStorage from '@react-native-async-storage/async-storage';


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
    const [errors, setErrors] = useState({
      password: "",
      confirmationPassword: ""
    })


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

    const otpString = otp.join('');

    const handleValidateOtp = async () =>{
      
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

    const passwordComplexityRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleResetPassword = async () => {

      let newErrors = {};
      setEffectLoading(true)

         // Password validations
    if (password === "") {
      newErrors.password = "Password should not be empty.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!passwordComplexityRegex.test(password)) {
      newErrors.password = "Password must include at least one uppercase letter, one number, and one special character.";
    }
  
    // Confirm password validation
    if (confirmPassword === "") {
      newErrors.confirmationPassword = "Confirm password should not be empty.";
    } else if (password !== confirmPassword) {
      newErrors.confirmationPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setEffectLoading(false);
      return;
    }


      const body = {
        email: email,
        otp: otpString,
        password: password,
        password_confirmation: confirmPassword,
      }
      try {
        const response = await API.resetPassword(body)
        if(response.data.status === "success"){
          setTimeout(() => {
            setEffectLoading(false)
            router.push('/Success')
          }, 1000);
        }
      } catch (error) {
        console.log(error)
      }
    }

    const handleGoBack = async () => {
      const loggedIn = await AsyncStorage.getItem("logged_in");
      if(loggedIn){
        router.push('/(tabs)/Settings')
        return
      } else {
        router.push('/(auth)/Login')
      }
    }
 
  return (
    <>
    {isVerifyOtp ? <>
    <Passwordotp email={email} otp={otp} setOtp={setOtp} isTimerActive={isTimerActive} 
    timer={timer} handleResendOtp={handleResendOtp} handleVerifyOtp={handleValidateOtp} otpError={otpError} setOtpError={setOtpError}/>
    </> : isVerifyPassword ? <>
      <ResetPassword password={password} setPassword={setPassword} confirmationPassword={confirmPassword}
       setConfirmationPassword={setConfirmPassword} handleResetPassword={handleResetPassword} errors={errors} setErrors={setErrors}/>
    </> : <>
    <View className="flex-1  p-4">
    <View className="mt-8 flex-row items-center">
        <TouchableOpacity onPress={() => handleGoBack()}>
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