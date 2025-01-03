import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import { iconHandler } from "./iconHandler";
import { HomeNotAuth } from "../screens/HomeNotAuth";
import { CurrencyScreen } from "../screens/currencyScreen";
import { HomeScreen } from "../screens/homescreen";
import { MapScreen } from "../screens/mapScreen";
import { ProfileScreen } from "../screens/profileScreen";
import { SearchWeahtherLocationScreen } from "../screens/searchLocationScreen";
import { auth } from "../services/firebase";

const Tab = createBottomTabNavigator();

export const TapBar = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          return iconHandler(route, focused, size, color);
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      {auth.currentUser.isAnonymous ? (
        <Tab.Screen
          name="Home"
          component={HomeNotAuth}
          options={{ headerShown: false }}
        />
      ) : (
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      )}
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Currency"
        component={CurrencyScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Weather"
        component={SearchWeahtherLocationScreen}
        options={{ headerShown: false }}
      />
      {!auth.currentUser.isAnonymous && (
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
      )}
    </Tab.Navigator>
  );
};
