import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image } from "react-native";

import { StyledButton } from "../components/styledButton";
import { TextTitle } from "../components/textTitle";
import { auth } from "../services/firebase";
import { buttonStyles } from "../styles/buttonStyles";
import { styles } from "../styles/commonstyles";
import { deviceWidth } from "../utils/dimensions";

export const HomeNotAuth = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TextTitle
        text="Welcome :)"
        fontSize={30}
        textColor="white"
        other={{ paddingLeft: 20 }}
      />
      <View style={[{ marginTop: 70, alignSelf: "center" }]}>
        <Image
          style={{ width: 150, height: 180, marginLeft: 90, marginBottom: 70 }}
          source={require("../resources/images/man-tourist.png")}
        />
        <Text style={styles.description}>Welcome to the Journey Jar-app</Text>
        <Text style={[styles.description, { fontSize: 20, marginTop: 10 }]}>
          Log in to the app to save or plan your journeys.
        </Text>
        <StyledButton
          buttonStyles={[
            [
              buttonStyles.anonymousButton,
              {
                backgroundColor: "white",
                marginTop: 25,
                height: 50,
                paddingTop: 15,
              },
            ],
          ]}
          buttonText="Log in"
          textStyles={{ fontWeight: "bold" }}
          action={async () => {
            await auth.signOut();
          }}
        />
      </View>
    </View>
  );
};
