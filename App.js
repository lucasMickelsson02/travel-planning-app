import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from "react";
import {
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  Alert,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";

import { FileHandler } from "./components/fileHandler";
import { TapBar } from "./components/navigationTapbar";
import { HomeNotAuth } from "./screens/HomeNotAuth";
import { AdressListScreen } from "./screens/adressListScreen";
import { DiaryEntryScreen } from "./screens/diaryEntryScreen";
import { DiaryListScreen } from "./screens/diaryListScreen";
import { EditProfileScreen } from "./screens/editProfileScreen";
import LoginWithEmailScreen from "./screens/emailLoginScreen";
import { LoginScreen } from "./screens/loginScreen";
import { WeatherScreen } from "./screens/weatherScreen";
import { auth } from "./services/firebase";
import { styles } from "./styles/commonstyles";
import { DiaryViewScreen } from "./screens/diaryView";
import { SignUpScreen } from "./screens/signUpScreen";

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChangedHandler = (user) => {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, onAuthStateChangedHandler);
    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={[styles.container, styles.loadingStartScreen]}>
        <Text style={{ color: "white" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaProvider>
        <NavigationContainer>
          {user ? (
            <Stack.Navigator initialRouteName="TapBar">
              <Stack.Screen
                name="TapBar"
                component={TapBar}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AdressList"
                component={AdressListScreen}
                options={{
                  title: "My adresses",
                  headerBackTitle: Platform.OS === "ios" && "Back",
                }}
              />
              <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{
                  title: "Account profile",
                  headerBackTitle: Platform.OS === "ios" && "Back",
                }}
              />
              <Stack.Screen
                name="DiaryList"
                component={DiaryListScreen}
                options={{
                  title: "My diaries",
                  headerBackTitle: Platform.OS === "ios" && "Back",
                }}
              />
              <Stack.Screen
                name="DiaryView"
                component={DiaryViewScreen}
                options={{
                  title: "Read your diary",
                  headerBackTitle: Platform.OS === "ios" && "Back",
                }}
              />
              <Stack.Screen
                name="WeatherScreen"
                component={WeatherScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="HomeNotAuth"
                component={HomeNotAuth}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="LoginWithEmailScreen"
                component={LoginWithEmailScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="DiaryEntryScreen"
                component={DiaryEntryScreen}
                options={{
                  title: "Create diary today",
                  headerBackTitle: Platform.OS === "ios" && "Back",
                }}
              />
              <Stack.Screen
                name="FileHandler"
                component={FileHandler}
                options={({ navigation }) => ({
                  title: "My files",
                  headerBackTitle: Platform.OS === "ios" && "Back",
                  headerRight: () => (
                    <Ionicons
                      name="help-circle"
                      size={25}
                      color="black"
                      style={{ marginRight: 15 }}
                      onPress={() =>
                        Alert.alert(
                          "Information",
                          "Long press on a file to delete it."
                        )
                      }
                    />
                  ),
                })}
              />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="LoginWithEmail"
                component={LoginWithEmailScreen}
                options={{
                  headerShown: false, // Hide the header
                }}
              />
              <Stack.Screen
                name="SignUpScreen"
                component={SignUpScreen}
                options={{
                  headerShown: false, // Hide the header
                }}
              />
            </Stack.Navigator>
          )}
        </NavigationContainer>

        <StatusBar style="auto" />
      </SafeAreaProvider>
    </KeyboardAvoidingView>
  );
}
