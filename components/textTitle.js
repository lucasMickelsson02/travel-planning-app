import React from "react";
import { Text, StyleSheet } from "react-native";

import { styles } from "../styles/commonstyles";

export const TextTitle = ({ text, textColor, fontSize, other }) => {
  // Parse the other prop string into a style object
  const parsedOtherStyles = other ? StyleSheet.flatten([other]) : {};

  return (
    <Text
      style={[styles.title, { color: textColor, fontSize }, parsedOtherStyles]}
    >
      {text}
    </Text>
  );
};
