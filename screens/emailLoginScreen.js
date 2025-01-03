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

const LoginWithEmailScreen = () => {
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
      await signInEmail(auth, email.trim(), password.trim());
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
          text="Sign in with email and password"
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
          style={{ marginBottom: 15, alignSelf: "flex-start", marginLeft: 20 }}
          onPress={() => {
            navigation.navigate("SignUpScreen");
          }}
        >
          <Text style={{ fontWeight: "bold" }}>
            Dont have an account? Create one here.
          </Text>
        </TouchableOpacity>

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
            <Text style={{ color: "white", fontWeight: "bold" }}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LoginWithEmailScreen;
