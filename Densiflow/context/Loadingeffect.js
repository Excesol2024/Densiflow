import { createContext, useState } from "react";
import PropTypes from 'prop-types';

export const LoadingEffectsContext = createContext({
    effectLoading: false,
    setEffectLoading: () => {},
})

export const LoadingEffectsProvider = ({children}) => {

    const [effectLoading, setEffectLoading] = useState(false)
    const [isSelecting, setIsSelecting] = useState(false)

    return(
    <LoadingEffectsContext.Provider value={{effectLoading, setEffectLoading, isSelecting, setIsSelecting}}>
        {children}
    </LoadingEffectsContext.Provider>
    )
}

LoadingEffectsProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };