import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Arrowright from "../../components/svg/Arrowright"; 
import AntDesign from '@expo/vector-icons/AntDesign';

const Otp = ({ email, otp, setOtp, handleVerifyOtp, handleCancelOtp, timer, isTimerActive, handleResendCode }) => {
  const [focusedInput, setFocusedInput] = useState(null);
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
        We’ve send you the verification
        code on  
          <Text style={{ fontFamily: 'PoppinsMedium' }} className="text-blue-500">{email}</Text>
        </Text>
        <View className="flex flex-row justify-center gap-6 mb-6">
        {[...Array(4)].map((_, index) => (
        <TextInput
          key={index}
          className={`border py-2 text-3xl rounded-xl text-center w-1/6 h-15 ${
            focusedInput === index ? 'border-secondary' : 'border-gray-300'
          }`}
          placeholder="-"
          value={otp[index] || ''}
          onChangeText={(text) => {
            const newOtp = otp.split('');
            newOtp[index] = text;
            setOtp(newOtp.join(''));
          }}
          keyboardType="numeric"
          maxLength={1}
          onFocus={() => setFocusedInput(index)}  // Set the focus state
          onBlur={() => setFocusedInput(null)}   // Reset focus state on blur
        />
      ))}
        </View>
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
  otp: PropTypes.string.isRequired,
  setOtp: PropTypes.func.isRequired,
  handleVerifyOtp: PropTypes.func.isRequired,
  handleCancelOtp: PropTypes.func.isRequired,  
  timer: PropTypes.number.isRequired, 
  isTimerActive: PropTypes.bool.isRequired,
  handleResendCode: PropTypes.func.isRequired,
};

export default Otp;
