import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from "../components/Protected/Api"
import { useRouter } from 'expo-router';

export const AuthenticatedContext = createContext({
  isloggedIn: {
    authUser: false,
  },
  setIsloggedIn: () => {},
});

export const AuthenticatedProvider = ({ children }) => {
  const [isloggedIn, setIsloggedIn] = useState({
    authUser: false,
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLoggedInUser = async () => {
    const token = await AsyncStorage.getItem('Authorization');
    console.log("TOKEN", token);
    console.log("CURRENT USER ssss")
    const dataresponse = await API.getCurrentUser();
    setCurrentUser(dataresponse.data)
    console.log("CURRENT USER", dataresponse.data)
    if(Token){
      setIsloggedIn({
        authUser: true
      })
      router.replace('/(tabs)/home')
    }else {
      router.replace('/(auth)/login')
    }
  };

  useEffect(() => {
    handleLoggedInUser();
  }, []);

  useEffect(() => {
    if (!loading) {
      console.log('Updated Auth State:', isloggedIn);
    }
  }, [isloggedIn, loading]);

  const handleLogoutUser = async () => {
    await AsyncStorage.removeItem('Authorization');
    await AsyncStorage.clear()
    
      setIsloggedIn({
        authUser: false,
      });
      console.log('You are Logged Out');
      router.replace('/')
  
  };



  return (
    <AuthenticatedContext.Provider value={{ isloggedIn, setIsloggedIn, currentUser, handleLogoutUser }}>
      {children}
    </AuthenticatedContext.Provider>
  );
};

AuthenticatedProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
