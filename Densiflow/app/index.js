import React, { useEffect, useState } from 'react';
import  SplashScreen  from './splashscreen';
import Start from './(getstarted)/Start'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import 'expo-dev-client';

const Index = () => {
 
  const [isShowSplashScreen, setIsShowSplashScreen] = useState(true);
  const router = useRouter();

  const handleHistory = async () => {
    try {
      const Token = await AsyncStorage.getItem('Authorization')
      const history =  await AsyncStorage.getItem("history");
      console.log("HISTORY", history);
      if(history && !Token){
        setTimeout(() => {
          setIsShowSplashScreen(false);
         router.push('/(auth)/Login')
        }, 2000)
      }else if(Token){
        setTimeout(() => {
          setIsShowSplashScreen(false);
          router.push('/(tabs)/Home')
        }, 2000)
      }else{
        setTimeout(() => {
          setIsShowSplashScreen(false);
          router.push('/(getstarted)/Start')
        }, 2000)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    handleHistory();
  },[])

  return (
   <>
   {isShowSplashScreen ? <SplashScreen/> :  <Start/>}
   </>
  );
};

export default Index;
