import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, ImageBackground, Text, Platform } from "react-native";

import { StyledButton } from "../components/styledButton";
import { TextTitle } from "../components/textTitle";
import { WeatherAPIKEY } from "../constraints/weatherAPIKey";
import { Loader } from "../components/loadingIndicator";
import { styles } from "../styles/commonstyles";
import { deviceHeight, deviceWidth } from "../utils/dimensions";

export const WeatherScreen = ({ route }) => {
  const [data, setData] = useState();
  const [isLoading, setLoading] = useState(true);
  const name = route.params.name;

  const navigation = useNavigation();

  useEffect(() => {
    async function fetchWeatherInfo() {
      try {
        await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${WeatherAPIKEY}`
        )
          .then((res) => {
            if (res.status >= 200 && res.status < 300) {
              // Status code in the range 200-299 indicates success
              return res.json();
            } else {
              setData(null);
              // Status code outside the range 200-299 indicates an error
              //throw new Error("Failed to fetch data");
            }
          })
          .then((res) => setData(res))
          .catch((err) => console.log(err));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
    fetchWeatherInfo();
  }, []);

  const Data = ({ title, value }) => (
    <View style={styles.weatherDataContainer}>
      <TextTitle text={title} textColor="white" fontSize={22} />
      <Text style={{ color: "white", fontSize: 22 }}>{value}</Text>
    </View>
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View>
      <ImageBackground
        source={require("../resources/images/new-york.jpg")}
        style={{ height: deviceHeight, width: deviceWidth }}
        imageStyle={{
          opacity: Platform.OS === "ios" ? 0.8 : 0.6,
          backgroundColor: "black",
        }}
      />
      <View
        style={{
          position: "absolute",
          paddingVertical: 20,
          paddingHorizontal: 10,
        }}
      >
        <StyledButton
          action={() => navigation.goBack()}
          useIcon
          iconName="arrow-back"
          iconSize={30}
          iconColor="white"
          buttonStyles={{
            paddingLeft: Platform.OS === "ios" && 15,
            paddingTop: Platform.OS === "ios" && 25,
          }}
        />
        <View
          style={[
            styles.weatherContainer,
            {
              width: deviceWidth - 20,
            },
          ]}
        />

        {data ? (
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "center",
              height: deviceHeight - 100,
            }}
          >
            <View>
              <Text style={{ color: "white", fontSize: 40 }}>{name}</Text>
              <Text
                style={{ fontSize: 22, color: "white", textAlign: "center" }}
              >
                {data["weather"][0]["main"]}
              </Text>
            </View>

            <Text style={{ color: "white", fontSize: 64 }}>
              {(data["main"]["temp"] - 273).toFixed(2)}&deg; C
            </Text>

            <View>
              <Text style={{ color: "white", fontSize: 22, marginBottom: 16 }}>
                Weather Details
              </Text>
              <View style={{ width: deviceWidth - 60 }}>
                <Data value={data["wind"]["speed"]} title="Wind" />
                <Data value={data["main"]["pressure"]} title="Pressure" />
                <Data value={`${data["main"]["humidity"]}%`} title="Humidity" />
                <Data value={data["visibility"]} title="Visibility" />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.wrapper}>
            <TextTitle
              text="Oops!"
              fontSize={30}
              textColor="white"
              other={{ marginTop: deviceHeight / 3 }}
            />
            <Text style={{ color: "white", fontSize: 20 }}>
              Weather data could not be fetched.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
