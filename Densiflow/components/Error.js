import { View, Text, Modal, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import Network from './svg/Network'
import NetInfo from '@react-native-community/netinfo'
import * as Updates from 'expo-updates';

const Error = () => {
    const [isConnectedToInternet, setIsConnectedToInternet] = useState(false);


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log("CONNECTED TO INTERNET");
        setIsConnectedToInternet(false);
      } else {
        console.log("NOT CONNECTED TO INTERNET");
        setIsConnectedToInternet(true);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleRetry = async () => {
    console.log('Retrying...');
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.error('Failed to reload app:', error);
    }
  };

  return (
   <Modal
   visible={isConnectedToInternet}
   >
     <View className="flex-1 bg-white justify-center items-center">
      <View className="flex-2 justify-center items-center">
      <Network/>
      <Text style={{fontFamily: "PoppinsMedium"}} className="text-2xl text-center">No internet Connection</Text>
      <Text style={{fontFamily: "PoppinsMedium"}} className="text-lg text-center mt-3 text-gray-400">Your internet connection is currently</Text>
      <Text style={{fontFamily: "PoppinsMedium"}} className="text-lg text-center text-gray-400">
      not available please check or try again.</Text>
      <Pressable className="mt-10 w-72 bg-secondary p-4 py-5 rounded-full" onPress={() => handleRetry()}>
            <Text style={{ fontFamily: "PoppinsThin" }} className="text-white text-center text-xl">
              Try Again
            </Text>
          </Pressable>
      </View>
    </View>
   </Modal>
  )
}

export default Error