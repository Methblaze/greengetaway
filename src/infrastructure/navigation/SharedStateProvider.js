// Created to share text and date from Add.js to Profile.js
import React, { createContext, useContext, useState } from 'react';

const SharedStateContext = createContext();

export const SharedStateProvider = ({ children }) => {
  const [attractionText, setAttractionText] = useState('');
  const [date, setDate] = useState(new Date());

const setAttractionTextAndDate = (text, newDate) => {
    setAttractionText(text);
    setDate(newDate);
};

const contextValue = {
    attractionText,
    setAttractionTextAndDate,
    date,
};


  return (
    <SharedStateContext.Provider value={contextValue}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const SharedState = () => { 
    const context = useContext(SharedStateContext);
    if (!context) {
        throw new Error('useSharedState must be used within a sharedStateProvider');
    }
    return context;
};