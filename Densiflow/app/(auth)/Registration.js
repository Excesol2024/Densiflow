import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Pressable, SafeAreaView, Keyboard } from 'react-native';
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
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { LoadingEffectsContext } from '../../context/Loadingeffect';
import Unhide from '../../components/svg/Unhide';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthenticatedContext } from '../../context/Authenticateduser';
import { WEBCLIENTID } from '@env'

const Registration = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordHidden, setPasswordHidden] = useState(true)
  const [confirmPasswordHidden, setConfirmPasswordHidden] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const router = useRouter();
  const [timer, setTimer] = useState(60); // Timer starting at 60 seconds
  const [isTimerActive, setIsTimerActive] = useState(true);
  const { setEffectLoading } = useContext(LoadingEffectsContext)
  const { firebaseToken, expoPushToken } = useContext(AuthenticatedContext)
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: ""
  })
  const [otpError, setOtpError] = useState("");





  useEffect(()=>{
    GoogleSignin.configure({
      webClientId: WEBCLIENTID,
    });
   },[])

    const onFacebookButtonPress = async () => {
      console.log("ATEMTING FB LOGIG")
      setEffectLoading(true)
      try {
        // Attempt login with permissions
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
        if (result.isCancelled) {
          throw 'User cancelled the login process';
        }
      
        // Once signed in, get the user's AccessToken
        const data = await AccessToken.getCurrentAccessToken();
      
        if (!data) {
          console.log("ERROR ACCESSTOKEN")
          return
        }
        
        console.log('Access Token:', data.accessToken);
        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
      
        // Sign-in the user with the credential
        const userCredential = await auth().signInWithCredential(facebookCredential);
      
        // Log the signed-in user's info
        if(userCredential){
          handleManualcreateAccount(userCredential)
        }else {
          console.log('NOTHING USER INFO');
        }
      } catch (error) {
        console.error('Facebook login error:', error);
      }
    };
  

   const onGoogleButtonPress = async () => {
    setEffectLoading(true)
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();
      const idToken = response.data.idToken; // Update this line
      console.log('ID Token:', idToken);

      
  
      if (!idToken) {
        console.log('ID token not received');
        return;
      }
  
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userInfo = await auth().signInWithCredential(googleCredential);
      handleManualcreateAccount(userInfo)
      // if(userInfo){
      //   router.push('/(tabs)/Home')
      // }
    } catch (error) {
      console.error('Error during Google Sign-in:', error.message);
      Alert.alert("Error", error.message); // Display the error to the user
    }
  };
  
  const handleManualcreateAccount = async (user) =>{
    const payload = {
      user: {
        name: user.user.displayName,
        email: user.user.email,
        password: user.user.uid,
        password_confirmation: user.user.uid,
        photo_url: user.user.photoURL
      }
    }

    const login_payload = {
      user: {
        email: user.user.email,
        password: user.user.uid,
      },
       expo_token: expoPushToken,
       firebase_token: firebaseToken
    };

   try {
    const response = await API.createManualAccount(payload);
    if(response.data.status === 'success'){
      const result = await API.loginUser(login_payload);
      if (result.data.status === "ok") {
        const tokenWithBearer = result.headers.get("Authorization");
        const token = tokenWithBearer.split(" ")[1];
        await AsyncStorage.setItem("Authorization", JSON.stringify(token));
        await AsyncStorage.setItem("Email", email);
        setEffectLoading(false)
        setIsModalVisible(false);
        router.push("/(tabs)/Home");
    }
   }
   } catch (error) {
    console.log(error)
    Alert.alert("Email has Already Signed In")
    setEffectLoading(false)
   }
   
  }

  const handleInputChange = (field, value) => {
    // Update the specific field's value
    if (field === "email") {
      setEmail(value);
    } else if (field === "password") {
      setPassword(value);
    }
    else if (field === "name") {
      setName(value);
    }
    else if (field === "confirm_password") {
      setConfirmPassword(value);
    }
  
    // Clear the error for the specific field
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordComplexityRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleRegister = async () => {

    setEffectLoading(true)

    let newErrors = {}; // Collect all errors here

    // Email validation
    if (email === "") {
      newErrors.email = "Email should not be empty.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
  
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
      newErrors.confirm_password = "Confirm password should not be empty.";
    } else if (password !== confirmPassword) {
      newErrors.confirm_password = "Passwords do not match.";
    }
  
    // Name validation
    if (name === "") {
      newErrors.name = "Name should not be empty.";
    }
  
  
    // If there are errors, set them and stop the submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setEffectLoading(false);
      return;
    }
 
    const body = {
        pending: {
          name: name,
          email: email,
          password: password
        }
    }

    try {
     const response = await API.initialRegister(body)
     if(response.data){
      setEffectLoading(false)
      setTimer(60)
      setIsTimerActive(true); 
      setTimeout(() => {
        setIsModalVisible(true);
      }, 1000);
     }
    } catch (error) {
      console.log(error.error)
      if(error.error === "Email already taken"){
        setErrors({email: "This email address is already registered."})
      }
      setEffectLoading(false)
    }
  
  };

  const handleCancelOtp = () => {
    setIsModalVisible(false);
    setOtp('')
    setTimer(60)
    setIsTimerActive(true); 
  }

  const handleVerifyOtp = async () => {

    const otpString = otp.join('');

    setEffectLoading(true)
    const body = {
        email: email,
        otp: otpString,
    }

    const payload = {
      user: {
        email: email,
        password: password,
      },
       expo_token: expoPushToken,
       firebase_token: firebaseToken
    };

    try {
      const response = await API.register(body)
      console.log("FINAL REGISTER", response.data)
      if(response.data.status === 'success'){
        const result = await API.loginUser(payload);
        if (result.data.status === "ok") {
          const tokenWithBearer = result.headers.get("Authorization");
          const token = tokenWithBearer.split(" ")[1];
          await AsyncStorage.setItem("Authorization", JSON.stringify(token));
          await AsyncStorage.setItem("Email", email);
          setEffectLoading(false)
          setIsModalVisible(false);
          router.push("/(tabs)/Home");
      }
      }
    } catch (error) {
      console.log("ERROR",error)
      setOtpError("The verification code is invalid or expired.");
      setEffectLoading(false)
    }
  
  };

  const handleResendCode = async () => {
    setEffectLoading(true)

    const body = {
        pending: {
          email: email,
          password: password
        }
    }

    try {
     const response = await API.initialRegister(body)
     if(response.data){
      setEffectLoading(false)
      setTimeout(() => {
        setIsModalVisible(true);
        setTimer(60); 
        setIsTimerActive(true); 
      }, 1000);
     }
    } catch (error) {
      console.log(error)
      setEffectLoading(false)
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

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      }
    );

    // Cleanup the listeners on unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
   <SafeAreaView className="flex-1 justify-center bg-white">
      {isModalVisible ? <Otp email={email} 
   otp={otp} setOtp={setOtp}
   handleVerifyOtp={handleVerifyOtp} handleCancelOtp={handleCancelOtp} timer={timer} isTimerActive={isTimerActive} handleResendCode={handleResendCode} otpError={otpError} setOtpError={setOtpError} /> : 
    <View className="flex-1 justify-center p-4">
      <View className="mt-6 flex-row items-center">
        <TouchableOpacity onPress={() => router.push("/Login")}>
          <AntDesign name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
      </View>

      
    <View className="flex-1 justify-center ">
    <Text onPress={()=> console.log(expoPushToken, firebaseToken)} style={{ fontFamily: 'PoppinsMedium' }} className="text-2xl mb-6 text-start">Sign Up</Text>

  <View className="mb-3">
  <View className={`flex-row items-center border rounded-lg p-3 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}>
        <User className=" text-gray-400" />
        <TextInput
          placeholder="Full name"
          className="ml-3 flex-1"
          style={{ fontFamily: "PoppinsMedium" }}
          value={name}
          onChangeText={(text) => handleInputChange("name", text)}
        />
      </View>
     {errors.name &&  <Text  style={{ fontFamily: "PoppinsMedium" }} className="mt-0.5 text-red-500">{errors.name}</Text>}
  </View>

   <View className="mb-3">
   <View className={`flex-row items-center border rounded-lg p-3 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}>
        <Email className=" text-gray-400" />
        <TextInput
          placeholder="example@gmail.com"
          className="ml-3 flex-1"
          style={{ fontFamily: "PoppinsMedium" }}
          value={email}
          onChangeText={(text) => handleInputChange("email", text)}
        />
      </View>
      {errors.email &&  <Text  style={{ fontFamily: "PoppinsMedium" }} className="mt-0.5 text-red-500">{errors.email}</Text>}
   </View>

    <View className="mb-3">
    <View className={`flex-row items-center border rounded-lg p-3 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}>
      <Lock className=" text-gray-400 ml-1" />
        <TextInput
          placeholder="Your Password"
          className="ml-3 flex-1"
          style={{ fontFamily: "PoppinsMedium" }}
          value={password}
          onChangeText={(text) => handleInputChange("password", text)}
          secureTextEntry={passwordHidden}
        />
          {passwordHidden ?  <Pressable onPress={()=> setPasswordHidden(false)}>
  <Eye />
  </Pressable> :  <Pressable onPress={()=> setPasswordHidden(true)}>
  <Unhide />
  </Pressable>}
      </View>
      {errors.password &&  <Text  style={{ fontFamily: "PoppinsMedium" }} className="mt-0.5 text-red-500">{errors.password}</Text>}
    </View>

    <View className="mb-3">
    <View className={`flex-row items-center border rounded-lg p-3 ${errors.confirm_password ? 'border-red-500' : 'border-gray-300'}`}>
        <Lock className=" text-gray-400 ml-1" />
        <TextInput
          placeholder="Confirm Password"
          className="ml-3 flex-1"
          style={{ fontFamily: "PoppinsMedium" }}
          value={confirmPassword}
          onChangeText={(text) => handleInputChange("confirm_password", text)}
          secureTextEntry={confirmPasswordHidden}
        />
        {confirmPasswordHidden ?  <Pressable onPress={()=> setConfirmPasswordHidden(false)}>
  <Eye />
  </Pressable> :  <Pressable onPress={()=> setConfirmPasswordHidden(true)}>
  <Unhide />
  </Pressable>}
      </View>
      {errors.confirm_password &&  <Text  style={{ fontFamily: "PoppinsMedium" }} className="mt-0.5 text-red-500">{errors.confirm_password}</Text>}

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

    
    {isKeyboardVisible ? '' : 
      <View className="">
      <Text
              style={{ fontFamily: "PoppinsMedium" }}
              className="text-center text-lg text-gray-400 mt-5"
            >
             OR
            </Text>
           <View className="flex-2 justify-center items-center">
         <Pressable onPress={onGoogleButtonPress}>
         <View className="flex flex-row p-3 bg-white shadow-md w-64 rounded-xl shadow-gray-400 justify-center items-center mt-1">
             <Google/>
             <Text style={{ fontFamily: "PoppinsMedium" }} className="ml-3">Sign up with Google</Text>
            </View>
         </Pressable>
          <Pressable onPress={onFacebookButtonPress}>
          <View className="flex flex-row p-3 bg-white shadow-md w-64 rounded-xl shadow-gray-400 justify-center items-center mt-2">
             <Facebook/>
             <Text style={{ fontFamily: "PoppinsMedium" }} className="ml-3">Sign up with Facebook</Text>
            </View>
          </Pressable>
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
              onPress={() => router.push("/Login")}
              className="text-center text-md mt-7 text-secondary ml-2"
            >
             Sign In
            </Text>
           </View>
      </View>
      }
    </View>


    </View>
   }
   </SafeAreaView>
  );
};

export default Registration;
