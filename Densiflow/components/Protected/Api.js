import axios from "axios";
import {paymentIntent, CurrentUser, Authentication, Weather } from "../../constant/Endpoint"
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

const apiHelper = async (endpoint, method, body = {}, params = {}) => {

  const token  = await AsyncStorage.getItem('Authorization');

  // If the token is null, do not proceed
  // if (!token) {
  //   console.log("Token is null, skipping API call.");
  //   return null; // Or throw an error if you want to handle it differently
  // }

  
  const url = endpoint.replace(/:\w+/g, (match) => {
    const key = match.slice(1);
    return params[key] || match;
  });

  // Set headers; multipart/form-data only if needed
  const headers = {
    'Content-Type': body instanceof FormData ? 'multipart/form-data' : 'application/json',
    ...(token? {'Authorization': `Bearer ${token}`} : {}),
  };

  try {
    const response = await axios({
      method: method,
      url: `${baseURL}${url}`,
      headers: headers,
      data: body,   // Send data if there's a request body (POST, PUT)
      params: method === 'GET' ? params : {}, // Attach params only for GET requests
    });
    return response;
    console.log("Token", Token);
    
  } catch (error) {
    throw error?.response?.data || error;  // Return more detailed error
  }
};


// Example API call
export const API = {
  buySubscriptions: () => apiHelper(paymentIntent.buySubscriptions, "POST"),
  getCurrentUser: ()=> apiHelper(CurrentUser.getSignedUser, "GET"),
  logout: () => apiHelper(Authentication.logoutUser, "DELETE"),
  deleteAccount: (body) => apiHelper(Authentication.deleteAccount, "DELETE", body),
  getCurrentUserWeather: (body)=> apiHelper(Weather.getCurrentweather, "POST", body),
};
