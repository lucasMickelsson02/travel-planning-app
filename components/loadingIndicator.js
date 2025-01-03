import { View, ActivityIndicator, Text } from "react-native";

import { styles } from "../styles/commonstyles";

export const Loader = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="grey" />
    </View>
  );
};
