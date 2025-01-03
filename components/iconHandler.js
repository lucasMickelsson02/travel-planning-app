import Ionicons from "react-native-vector-icons/Ionicons";

export const iconHandler = (route, focused, size, color) => {
  let iconName;
  if (route.name === "Home") {
    iconName = focused ? "home" : "home-outline";
  } else if (route.name === "Map") {
    iconName = focused ? "map" : "map-outline";
  } else if (route.name === "Currency") {
    iconName = focused ? "cash" : "cash-outline";
  } else if (route.name === "Weather") {
    iconName = focused ? "sunny" : "sunny-outline";
  } else if (route.name === "Profile") {
    iconName = focused ? "person-circle" : "person-circle-outline";
  }
  return <Ionicons name={iconName} size={size} color={color} />;
};
