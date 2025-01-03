import { StyleSheet, Platform, StatusBar } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: 5,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 70,
  },
  loadingStartScreen: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  textStyle: {
    color: "white",
  },
  column: {
    flexDirection: "column", // Default is column, but for clarity
    justifyContent: "flex-start", // You can adjust this as needed
    alignItems: "center", // You can adjust this as needed
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  backgroundVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "stretch",
    bottom: 0,
    right: 0,
    opacity: 0.8,
  },
  wrapper: {
    justifyContent: "space-between",
    padding: "20px",
    alignItems: "center",
    flexDirection: "column",
  },
  title: {
    color: "#f4f4f4",
    margin: "50% 0px 20px",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 3,
  },
  description: {
    color: "#f4f4f4",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 3,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  weatherDataContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weatherContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainWeatherContainer: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
