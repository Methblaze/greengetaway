import React, { useEffect, useMemo, useState, createContext } from "react";

import { locationEventsEmitter, startLocationTask } from "./location.service";

export const LocationContext = createContext();

export const LocationContextProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("N/A");

  useEffect(() => {
    startLocationTask();
  }, []);

  // Subscribe once and unsubscribe on unmount. In 2023 these listeners were
  // added in the render body, so every render added two more and none were
  // removed. With a location update every five seconds on a phone, that grew
  // to thousands of listeners within an hour.
  useEffect(() => {
    const onLocation = locationEventsEmitter.addListener("location", setLocation);
    const onAddress = locationEventsEmitter.addListener("address", setAddress);
    return () => {
      onLocation.remove();
      onAddress.remove();
    };
  }, []);

  // A new object only when the values change, so consumers such as the map
  // do not re-render when nothing has moved.
  const value = useMemo(() => ({ address, location }), [address, location]);

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};
