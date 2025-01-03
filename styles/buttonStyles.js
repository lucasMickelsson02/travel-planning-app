import Constants from "expo-constants";
import { Platform, StyleSheet } from "react-native";

const baseLoginButtonStyles = {
  display: "flex",
  width: 350,
  height: 60,
  justifyContent: "flex-start",
  alignItems: "center",
  borderRadius: 8,
  marginBottom: 10,
  padding: 4,
};

export const buttonStyles = StyleSheet.create({
  emailButton: {
    ...baseLoginButtonStyles,
    marginTop: 100,
    backgroundColor: "lightblue",
  },
  googleButton: {
    ...baseLoginButtonStyles,
    backgroundColor: "#c7ced9",
  },
  facebookButton: {
    ...baseLoginButtonStyles,
    backgroundColor: "#2997ff",
  },
  anonymousButton: {
    ...baseLoginButtonStyles,
    backgroundColor: "#2997ff",
  },
  trafficButton: {
    position: "absolute",
    top: Platform.OS === "android" ? 100 : 115,
    backgroundColor: "white",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25, // Make it circular
    alignSelf: "center", // Center horizontally
  },
  diaryButton: {
    backgroundColor: "white",
    width: 150, // Adjust this value according to your preference
    height: 30, // Adjust this value according to your preference
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 3, // Make it circular

    flexDirection: "row",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: Constants.statusBarHeight + 20,
    paddingHorizontal: 20,
    width: "100%",
  },
  buttonTextStyle: {
    fontWeight: "bold",
    flex: 1,
  },
});
