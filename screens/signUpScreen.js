import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { TextTitle } from "../components/textTitle";
import { TrafficLogo } from "../components/trafficLogo";
import { checkPasswordmatch, signInEmail, signUpEmail } from "../services/auth";
import { auth } from "../services/firebase";
import { Loader } from "../components/loadingIndicator";
import { styles } from "../styles/commonstyles";

export const SignUpScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const backToMainLogin = () => {
    navigation.goBack();
  };

  const handleLogin = async () => {
    setIsLoading(true);
    if (email && password) {
      try {
        await signUpEmail(auth, email.trim(), password.trim());
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          console.log("Email already in use");
          Alert.alert("Email already in use!", "Please try again!");
        } else if (error.code === "auth/weak-password") {
          console.log("weak password");
          Alert.alert("Password is too weak", "Please try again!");
        } else if (error.code === "auth/invalid-email") {
          console.log("The mail is in wrong format!");
          Alert.alert("The mail is in wrong format!", "Please try again!");
        } else {
          Alert("Error on signup");
        }
      }
    } else {
      Alert.alert("Email and password should be given!", "Please try again!");
    }
    setIsLoading(false);
  };

  return (
    <ScrollView>
      <View
        style={{
          position: "absolute",
          top: Platform.OS === "android" ? 0 : 35,
          left: Platform.OS === "android" ? 0 : 10,
        }}
      >
        <TouchableOpacity onPress={backToMainLogin}>
          <Ionicons name="arrow-back" size={30} style={{ margin: 10 }} />
        </TouchableOpacity>
      </View>

      <View style={[styles.wrapper, { marginTop: 100 }]}>
        <TrafficLogo logoColor="black" marginBottom={80} />
        <TextTitle
          text="Create an account"
          textColor="black"
          fontSize={25}
          other={{ marginBottom: 15 }}
        />
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="black"
          keyboardType="email-address"
          value={email}
          style={{
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 8,
            padding: 10,
            marginBottom: 20,
            width: 350,
          }}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="black"
          secureTextEntry
          value={password}
          style={{
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 8,
            padding: 10,
            marginBottom: 20,
            width: 350,
          }}
          onChangeText={(text) => {
            setPassword(text);
          }}
        />
        {password && (
          <TextInput
            placeholder="Confirm your password"
            placeholderTextColor="black"
            secureTextEntry
            value={confirmPassword}
            style={{
              borderWidth: 1,
              borderColor: "gray",
              borderRadius: 8,
              padding: 10,
              marginBottom: 20,
              width: 350,
            }}
            onChangeText={(text) => {
              setconfirmPassword(text);
            }}
          />
        )}

        <TouchableOpacity
          style={{
            backgroundColor: "blue",
            padding: 10,
            borderRadius: 5,
            width: 350,
            alignItems: "center",
            justifyContent: "center",
            height: 60,
          }}
          onPress={async () => {
            if (checkPasswordmatch(password, confirmPassword)) {
              await handleLogin();
            } else {
              Alert.alert("Passwords does not match each other!", "Try again!");
            }
          }}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <Text style={{ color: "white", fontWeight: "bold" }}>Sign Up</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;
