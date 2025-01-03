import { View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export const TrafficLogo = ({ logoColor, marginBottom, marginTop }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        marginBottom,
        marginTop,
      }}
    >
      <Ionicons name="airplane" size={70} color={logoColor} />
      <Ionicons name="boat" size={70} color={logoColor} />
      <Ionicons name="car" size={70} color={logoColor} />
      <Ionicons name="bus" size={70} color={logoColor} />
    </View>
  );
};
