import React from "react";
import { View } from "react-native";

const Divider = ({ thickness}) => (
  <View
    style={{
      borderBottomColor: "#688A6F",
      borderBottomWidth: thickness || 1, 
    }}
  />
);

export default Divider;