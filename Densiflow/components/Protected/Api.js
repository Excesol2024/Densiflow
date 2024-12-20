import axios from "axios";
import {paymentIntent, CurrentUser, Authentication, Weather, Feedbacks, Notifications, Places, Reviews, AppUpdate } from "../../constant/Endpoint"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL } from '@env'

const newServeUrl = "http://192.168.1.200:3000"

const apiHelper = async (endpoint, method, body = {}, params = {}) => {

  const token  = await AsyncStorage.getItem('Authorization');

  // If the token is null, do not proceed
  if (!token) {
    console.log("Token is null, skipping API call.");
    return null; // Or throw an error if you want to handle it differently
  }

  
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
      url: `${SERVER_URL}${url}`,
      headers: headers,
      data: body,   // Send data if there's a request body (POST, PUT)
      params: method === 'GET' || 'DELETE' ? params : {}, // Attach params only for GET requests
    });
    return response;
    
  } catch (error) {
    throw error?.response?.data || error;  // Return more detailed error
  }
};


// Example API call
export const API = {
  buySubscriptions: () => apiHelper(paymentIntent.buySubscriptions, "POST"),
  getCurrentUser: ()=> apiHelper(CurrentUser.getSignedUser, "GET"),
  updateToken: (body)=> apiHelper(CurrentUser.updateToken, "PATCH", body),
  logout: () => apiHelper(Authentication.logoutUser, "DELETE"),
  deleteAccount: (body) => apiHelper(Authentication.deleteAccount, "DELETE", body),
  getCurrentUserWeather: (body)=> apiHelper(Weather.getCurrentweather, "POST", body),
  shareFeedbacks: (body)=> apiHelper(Feedbacks.shareFeedbacks, "POST", body),
  uploadProfilePicture: (body)=> apiHelper(CurrentUser.uploadProfilePicture, "PUT", body),

  addPlaceToNotify: (body)=> apiHelper(Notifications.addNotifications, "POST", body),
  userNotifications: ()=> apiHelper(Notifications.userNotifications, "GET"),
  deleteNotifications: (params)=> apiHelper(Notifications.deleteNotifications, "DELETE", undefined, params),
  FindNotifications: (params)=> apiHelper(Notifications.findNotifications, "GET", undefined, params),

  getPopularPlacess: ()=> apiHelper(Places.getPopularPlaces, "GET"),
  getRecommededPlaces: ()=> apiHelper(Places.getRecommededPlaces, "GET"),
  getPlacesTypes: (body)=> apiHelper(Places.placeTypes, "POST", body),
  getSuggestedPlaces: ()=> apiHelper(Places.suggestedPlaces, "GET"),
  getSearchedPlaces: (params)=> apiHelper(Places.searchPlaces, "GET", undefined, params),
  updateUserGender: (body)=> apiHelper(CurrentUser.updateUserGender, "POST", body),
  savedPlace: (body)=> apiHelper(Places.savedPlaces, "POST", body),
  getSavedPlaces: ()=> apiHelper(Places.getSavedPlaces, "GET"),
  FindPlaces: (params)=> apiHelper(Places.findPlace, "GET", undefined, params),
  deletePlace: (params)=> apiHelper(Places.deleteSavedPlace, "DELETE", undefined, params),
  findPlaceSavedNotifReview: (params)=> apiHelper(Places.PlaceSavedNotifReview, "GET", undefined, params),

  randomReviews: (params)=> apiHelper(Reviews.randomReviews, "GET", undefined, params),
  createUserReviews: (body)=> apiHelper(Reviews.createReviews, "POST", body),

  appUpdates: ()=> apiHelper(AppUpdate.getAppUpdates, "GET"),
  deleteAppUpdates: (params)=> apiHelper(AppUpdate.deleteAppUpdates, "DELETE", undefined, params),
};
