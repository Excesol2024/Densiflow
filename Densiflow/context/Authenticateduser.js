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
  const [subscribed, setSubscribed] = useState(false)

  const handleLoggedInUser = async () => {
    const token = await AsyncStorage.getItem('Authorization');
    console.log("TOKEN", token);
    console.log("CURRENT USER ssss")
    const dataresponse = await API.getCurrentUser();
    setCurrentUser(dataresponse.data)
    console.log("CURRENT USER", dataresponse.data)
      setIsloggedIn({
        authUser: true
      })
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
    
      setIsloggedIn({
        authUser: false,
      });
      router.replace('/')
  
  };

  return (
    <AuthenticatedContext.Provider value={{ isloggedIn, setIsloggedIn, currentUser, handleLogoutUser, handleLoggedInUser, subscribed, setSubscribed }}>
      {children}
    </AuthenticatedContext.Provider>
  );
};

AuthenticatedProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
