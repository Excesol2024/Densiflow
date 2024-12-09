import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const LoadingEffectsContext = createContext({
  effectLoading: false,
  setEffectLoading: () => {},
  isSelecting: false,
  setIsSelecting: () => {},
  mapLocation: { lat: "", long: "" },
  setMapLocation: () => {},
  handleMapSelections: () => {},
  isSelectingGender: false,
  setIsSelectingGender: () => {},
  isSelectingMap: false,
  setIsSelectingMap: () => {},
  selectedMap: "",
  setSelectedMap: () => {},
});

export const LoadingEffectsProvider = ({ children }) => {
  const [effectLoading, setEffectLoading] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const [isSelectingGender, setIsSelectingGender] = useState(false);
  const [isSelectingMap, setIsSelectingMap] = useState(false);
  const [selectedMap, setSelectedMap] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSaved, setIsSaved] = useState([]);

  const [isSettingNotif, setIsSettingNotif] = useState(false);
  const [placeDetails, setPlaceDetails] = useState([]);

  const [nearbyPlaceTypes, setNearbyPlaceTypes] = useState("");

  const [mapLocation, setMapLocation] = useState([]);

  const [isReviewing, setIsReviewing] = useState(true);

  useEffect(() => {
    handleSetMap();
  }, [isSelectingMap]);

  const handleSetMap = async () => {
    const existingSelection = await AsyncStorage.getItem("selectedMapLocation");
    if (existingSelection) {
      setSelectedMap(existingSelection);
      console.log(existingSelection);
    } else {
      setSelectedMap("standard");
      console.log("NO MAP SELECTED");
    }
  };

  const handleMapSelections = async (name) => {
    try {
      // Check if a map selection already exists
      const existingSelection = await AsyncStorage.getItem(
        "selectedMapLocation"
      );

      if (existingSelection) {
        console.log("Existing map selection found:", existingSelection);
        // Update only if the new selection is different
        if (existingSelection !== name) {
          await AsyncStorage.setItem("selectedMapLocation", name);
          console.log("Map selection updated to:", name);
          setIsSelectingMap(false);
        } else {
          console.log("Map selection remains the same:", name);
        }
      } else {
        // If no selection exists, set the new one
        await AsyncStorage.setItem("selectedMapLocation", name);
        console.log("Map selection stored:", name);
        setIsSelectingMap(false);
      }
    } catch (error) {
      console.error("Error storing or updating map selection:", error);
    }
  };

  const handleSelectedPlaceToNotif = (place) => {
    setIsSettingNotif(true);
    setPlaceDetails(place);
    console.log("SELECTED PLACE TO NOTIF", place);
  };

  return (
    <LoadingEffectsContext.Provider
      value={{
        effectLoading,
        setEffectLoading,
        isSelecting,
        setIsSelecting,
        mapLocation,
        setMapLocation,
        handleMapSelections,
        isSelectingGender,
        setIsSelectingGender,
        isSelectingMap,
        setIsSelectingMap,
        selectedMap,
        isSearching,
        setIsSearching,
        isSaved,
        setIsSaved,
        nearbyPlaceTypes,
        setNearbyPlaceTypes,
        isSettingNotif,
        setIsSettingNotif,
        handleSelectedPlaceToNotif,
        placeDetails,
        setPlaceDetails,
        isReviewing, setIsReviewing
      }}
    >
      {children}
    </LoadingEffectsContext.Provider>
  );
};

LoadingEffectsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
