import { useNavigation } from "@react-navigation/native";
import { View, Text, ImageBackground, Platform } from "react-native";

import { StyledButton } from "../components/styledButton";
import { TrafficLogo } from "../components/trafficLogo";
import { signInAnonymous } from "../services/auth";
import { buttonStyles } from "../styles/buttonStyles";
import { styles } from "../styles/commonstyles";
import { deviceHeight, deviceWidth } from "../utils/dimensions";

export const LoginScreen = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("LoginWithEmail");
  };
  return (
    <View>
      <ImageBackground
        source={require("../resources/images/pexels-wanderer-731217.jpg")}
        style={[
          styles.backgroundVideo,
          { width: deviceWidth, height: deviceHeight },
        ]}
      />
      <View style={styles.wrapper}>
        <TrafficLogo
          logoColor="white"
          marginTop={Platform.OS === "android" ? 30 : 50}
        />
        <Text style={[styles.title, { marginTop: 170 }]}>
          Welcome to Journey Jar
        </Text>
        <Text style={styles.description}>Where the Journey begins</Text>
        <StyledButton
          buttonStyles={[buttonStyles.emailButton]}
          action={handlePress}
          useIcon
          iconName="mail"
          iconSize={30}
          textStyles={buttonStyles.buttonTextStyle}
          buttonText="Login with mail"
        />
        <StyledButton
          buttonStyles={buttonStyles.anonymousButton}
          action={async () => await signInAnonymous()}
          useIcon
          iconName="person"
          iconSize={30}
          textStyles={buttonStyles.buttonTextStyle}
          buttonText="Login as a guest"
        />
      </View>
    </View>
  );
};
