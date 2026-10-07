// A quiet way out from the main screens, so logging out does not mean a trip
// to Profile first. It sits in the screen's title row as a 44 point icon
// button with a spoken label, rather than as a coloured link in every header
// as in 2023.
import React, { useContext } from "react";
import { AuthenticationContext } from "../services/authentication/authentication.context";
import { IconButton } from "./ui/IconButton";

export const LogoutButton = ({ style }) => {
  const { onLogout } = useContext(AuthenticationContext);
  return <IconButton icon="log-out-outline" label="Log out" onPress={onLogout} style={style} />;
};
