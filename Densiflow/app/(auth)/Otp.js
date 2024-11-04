import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Arrowright from "../../components/svg/Arrowright"; 
import AntDesign from '@expo/vector-icons/AntDesign';

const Otp = ({ email, otp, setOtp, handleVerifyOtp, handleCancelOtp, timer, isTimerActive, handleResendCode, otpError, setOtpError }) => {
  const [focusedInput, setFocusedInput] = useState(null);
  const inputRefs = useRef([]); 

  const handleInputChange = (text, index) => {
    // Update the otp state at the current index
    const newOtp = [...otp]; // Make a copy of the current OTP array
    newOtp[index] = text; // Update the specific index with the new text
    setOtp(newOtp); // Set the new OTP state

    // Clear OTP error when user starts typing
    if (otpError) {
      setOtpError(""); // Clear OTP error
    }

    // Automatically focus the next input if a character is entered
    if (text && index < 3) {
      inputRefs.current[index + 1].focus(); // Focus the next input
    } else if (!text && index > 0) {
      // If the input is cleared, focus the previous input
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View className="flex-1 bg-white p-4">

<View className="mt-7  flex-row items-center">
        <TouchableOpacity onPress={handleCancelOtp}>
          <AntDesign name="arrowleft" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center">
        <Text style={{ fontFamily: 'PoppinsMedium' }} className="text-3xl mb-2">
          Verification 
        </Text>
      <Text style={{ fontFamily: 'PoppinsMedium' }} className="mb-6 text-lg">
  We’ve sent you the verification code on
  {" "}
  <Text style={{ fontFamily: 'PoppinsMedium' }} className="text-blue-500">{email}</Text>
</Text>
        <View className={`flex flex-row justify-center gap-6 ${otpError ? '' : 'mb-6'}`}>
        {[...Array(4)].map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)} // Assign the ref
          className={`border py-2 text-3xl rounded-xl text-center w-1/6 h-15 ${
            focusedInput === index ? 'border-secondary' : 'border-gray-300'
          }`}
          placeholder="-"
          value={otp[index]}
          onChangeText={(text) => handleInputChange(text, index)} // Handle input change
          keyboardType="numeric"
          maxLength={1}
          onFocus={() => setFocusedInput(index)}  // Set the focus state
          onBlur={() => setFocusedInput(null)}    // Reset focus state on blur
          autoFocus={index === 0} // Automatically focus on the first input on mount
        />
      ))}
      </View>
      {otpError && (
  <Text className="text-center mb-6" style={{ color: 'red', marginTop: 8, fontSize: 14, fontFamily: "PoppinsMedium" }}>
    {otpError}
  </Text>
)}
        <View className=" ml-8 mr-8">
    <TouchableOpacity
        className="bg-secondary p-3.5 rounded-xl shadow-2xl shadow-primary"
        onPress={handleVerifyOtp}
      >
        <Text style={{ fontFamily: "PoppinsMedium" }} className="text-white text-center text-lg tracking-widest">
          CONTINUE
        </Text>
        <View className="absolute right-3 top-3 bg-primary p-2 rounded-full">
        <Arrowright className=""/>
        </View>
      </TouchableOpacity>
    </View>

        <View className="flex flex-row gap-1 mt-5 justify-center">
          <Text style={{ fontFamily: 'PoppinsMedium' }} className="text-lg">Re-send code in</Text>
          <Text style={{ fontFamily: 'PoppinsMedium' }} className="text-lg text-secondary">
            {isTimerActive ? `${timer} seconds` : (
              <TouchableOpacity onPress={handleResendCode}>
                <Text style={{ fontFamily: 'PoppinsMedium' }} className="text-blue-500 text-lg"> Resend</Text>
              </TouchableOpacity>
            )}
          </Text>
        </View>
      </View>
    </View>
  );
};

Otp.propTypes = {
  email: PropTypes.string.isRequired,
  otp: PropTypes.arrayOf(PropTypes.string).isRequired, 
  setOtp: PropTypes.func.isRequired,
  handleVerifyOtp: PropTypes.func.isRequired,
  handleCancelOtp: PropTypes.func.isRequired,  
  timer: PropTypes.number.isRequired, 
  isTimerActive: PropTypes.bool.isRequired,
  handleResendCode: PropTypes.func.isRequired,
  otpError: PropTypes.string.isRequired,
  setOtpError: PropTypes.func.isRequired,
};

export default Otp;
