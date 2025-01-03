import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { deviceHeight, deviceWidth } from "../utils/dimensions";

export const SearchWeahtherLocationScreen = () => {
  const [city, setCity] = useState("");
  const navigation = useNavigation();

  return (
    <View>
      <ImageBackground
        source={require("../resources/images/new-york-2.jpg")}
        style={{ height: deviceHeight, width: deviceWidth }}
        imageStyle={{
          opacity: 0.8,
        }}
      />
      <View
        style={{
          position: "absolute",
          paddingVertical: 20,
          paddingHorizontal: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: deviceWidth - 20,
          }}
        />

        <View style={{ paddingHorizontal: 20, marginTop: 100 }}>
          <Text style={{ fontSize: 40, color: "white" }}>Weather section</Text>
          <Text style={{ color: "white", fontSize: 22, fontWeight: "bold" }}>
            Find weather information by searching the city by the name
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 50,
              borderWidth: 1,
              borderColor: "white",
              marginTop: 16,
              paddingHorizontal: 10,
            }}
          >
            <TextInput
              value={city}
              onChangeText={(val) => setCity(val)}
              placeholder="Search City"
              placeholderTextColor="white"
              style={{
                paddingHorizontal: 10,
                color: "white",
                fontSize: 16,
                height: 40,
              }}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("WeatherScreen", { name: city });
                setCity("");
              }}
            >
              <Icon name="search" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
