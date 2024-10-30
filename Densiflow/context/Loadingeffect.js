import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';

export const LoadingEffectsContext = createContext({
    effectLoading: false,
    setEffectLoading: () => {},
    isSelecting: false,
    setIsSelecting: () => {},
    mapLocation: { lat: "", long: "" },
    setMapLocation: () => {},
})

export const LoadingEffectsProvider = ({children}) => {

    const [effectLoading, setEffectLoading] = useState(false)
    const [isSelecting, setIsSelecting] = useState(false)

    const [mapLocation, setMapLocation] = useState({
        lat: "",
        long: ""
    })


    useEffect(()=>{
    console.log("MAP LOCATIONS", mapLocation)
    },[])

    return(
        <LoadingEffectsContext.Provider value={{
            effectLoading,
            setEffectLoading,
            isSelecting,
            setIsSelecting,
            mapLocation,
            setMapLocation
        }}>
            {children}
        </LoadingEffectsContext.Provider>
    )
}

LoadingEffectsProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };