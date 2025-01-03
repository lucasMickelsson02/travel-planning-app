import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { Snackbar } from "react-native-paper";

import { StyledButton } from "../components/styledButton";
import { TextTitle } from "../components/textTitle";
import { auth } from "../services/firebase";
import { buttonStyles } from "../styles/buttonStyles";
import { styles } from "../styles/commonstyles";
import { deviceWidth } from "../utils/dimensions";

export const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    // Check if "showSnackbar" is passed in navigation params
    if (route.params?.showSnackbar) {
      setSnackbarVisible(true);
    }
  }, [route.params]);
  return (
    <View style={styles.container}>
      <TextTitle
        text="My Trips"
        fontSize={30}
        textColor="white"
        other={{ paddingLeft: 20 }}
      />
      <StyledButton
        action={() => {
          navigation.navigate("DiaryList");
        }}
        useIcon
        iconName="play-back-outline"
        iconSize={20}
        textStyles={{ fontWeight: "bold" }}
        buttonText="Earlier trips"
        buttonStyles={[
          [
            buttonStyles.diaryButton,
            {
              backgroundColor: "white",
              marginTop: 25,
              marginLeft: deviceWidth / 20,
            },
          ],
        ]}
      />
      <View style={[{ marginTop: 70, alignSelf: "center" }]}>
        <Image
          style={{ width: 150, height: 180, marginLeft: 90, marginBottom: 70 }}
          source={require("../resources/images/man-tourist.png")}
        />
        <Text style={styles.description}>You dont have any saved Trips!</Text>
        <Text style={[styles.description, { fontSize: 20, marginTop: 10 }]}>
          Hello {auth.currentUser.email}
        </Text>
        <StyledButton
          action={() => {
            navigation.navigate("DiaryEntryScreen");
          }}
          buttonStyles={[
            [
              buttonStyles.anonymousButton,
              {
                backgroundColor: "white",
                marginTop: 25,
                paddingTop: 15,
                height: 50,
              },
            ],
          ]}
          buttonText="Create new travel diary here"
          textStyles={{ fontWeight: "bold" }}
        />
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: "CANCEL",
          onPress: () => {
            setSnackbarVisible(false);
          },
        }}
      >
        Diary saved successfully!
      </Snackbar>
    </View>
  );
};
