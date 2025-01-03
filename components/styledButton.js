import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export const StyledButton = ({
  buttonText,
  action,
  buttonStyles,
  textStyles,
  useIcon,
  iconSize,
  iconName,
  iconColor,
  disableButton,
}) => {
  const parsedOtherStyles = textStyles ? StyleSheet.flatten([textStyles]) : {};

  return (
    <TouchableOpacity
      style={[buttonStyles]}
      onPress={action}
      disabled={disableButton}
    >
      {useIcon && (
        <View>
          <Ionicons
            name={iconName ? iconName : "play-back-outline"}
            size={iconSize ? iconSize : 20}
            color={iconColor}
          />
        </View>
      )}
      {buttonText && <Text style={[parsedOtherStyles]}>{buttonText}</Text>}
    </TouchableOpacity>
  );
};

/*const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row", // Ensure icon and text are in a row
    alignItems: "center", // Center align the items vertically
  },
  iconContainer: {
    marginRight: 5, // Adjust spacing between icon and text
  },
  text: {
    // Add any default text styles here
  },
});*/
