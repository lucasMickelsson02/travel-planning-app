import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";

import { StyledButton } from "../components/styledButton";
import { TextTitle } from "../components/textTitle";
import { signOut } from "../services/auth";
import { fetchCurrentUser } from "../services/collectionManager";
import { auth } from "../services/firebase";
import { buttonStyles } from "../styles/buttonStyles";
import { styles } from "../styles/commonstyles";
import { Loader } from "../components/loadingIndicator";

export const ProfileScreen = () => {
  const [user, setUser] = useState("");
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const user = await fetchCurrentUser(auth.currentUser.uid);
      setUser(user);
      setLoading(false);
    }
    getUser();
  }, []);

  const navigation = useNavigation();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={[styles.container, { paddingLeft: 0 }]}>
      <TextTitle
        text={
          user !== undefined
            ? "Hello " + user.name + "!"
            : "Hello " + auth.currentUser.email + "!"
        }
        fontSize={30}
        textColor="white"
        other={{ paddingLeft: 20, marginTop: 40 }}
      />
      <TextTitle
        text="Profile"
        fontSize={20}
        textColor="white"
        other={{
          paddingLeft: 10,
          marginTop: 40,
          textDecorationLine: "underline",
        }}
      />

      <StyledButton
        textStyles={{ fontWeight: "bold", fontSize: 16 }}
        action={() => {
          navigation.navigate("EditProfile");
        }}
        buttonText="My profile"
        useIcon
        iconName="arrow-forward"
        buttonStyles={[
          buttonStyles.diaryButton,
          {
            marginTop: 10,
            paddingLeft: 20,
            paddingRight: 20,
            padding: 0,
            width: "100%",
            height: 70,
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          },
        ]}
      />

      <TextTitle
        text="Favorites"
        fontSize={20}
        textColor="white"
        other={{
          paddingLeft: 10,
          marginTop: 30,
          textDecorationLine: "underline",
        }}
      />
      <StyledButton
        textStyles={{ fontWeight: "bold", fontSize: 16 }}
        action={() => {
          navigation.navigate("AdressList");
        }}
        buttonText="My saved adresses"
        useIcon
        iconName="arrow-forward"
        buttonStyles={[
          buttonStyles.diaryButton,
          {
            marginTop: 10,
            paddingLeft: 20,
            paddingRight: 20,
            padding: 0,
            width: "100%",
            height: 70,
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          },
        ]}
      />
      <TextTitle
        text="Travel documents"
        fontSize={20}
        textColor="white"
        other={{
          paddingLeft: 10,
          marginTop: 30,
          textDecorationLine: "underline",
        }}
      />
      <StyledButton
        textStyles={{ fontWeight: "bold", fontSize: 16 }}
        action={() => {
          navigation.navigate("FileHandler");
        }}
        buttonText="My travel documents"
        useIcon
        iconName="arrow-forward"
        buttonStyles={[
          buttonStyles.diaryButton,
          {
            marginTop: 10,
            paddingLeft: 20,
            paddingRight: 20,
            padding: 0,
            width: "100%",
            height: 70,
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          },
        ]}
      />
      <StyledButton
        textStyles={{ fontWeight: "bold" }}
        action={async () => {
          Alert.alert(
            "Log out",
            "Are you sure you want to log out?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Log Out",
                onPress: async () => {
                  await signOut();
                },
              },
            ],
            { cancelable: false }
          );
        }}
        buttonText="Log out"
        buttonStyles={[
          buttonStyles.anonymousButton,
          { marginTop: 60, alignSelf: "center", paddingTop: 20 },
        ]}
      />
    </View>
  );
};
