import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, Platform } from "react-native";

import { StyledButton } from "./styledButton";
import { GOOGLE_API_KEY } from "../constraints/GoogleAPIKEY";
import { buttonStyles } from "../styles/buttonStyles";

const screen = Dimensions.get("window");

const DistanceTimeCalculator = ({ origin, destination, travelMode }) => {
  const [response, setResponse] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const originPos = `${origin.latitude},${origin.longitude}`; // San Francisco
  const destinationPos = `${destination.latitude},${destination.longitude}`; // Los Angeles

  useEffect(() => {
    async function getResponse() {
      try {
        const apiKey = GOOGLE_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originPos}&destinations=${destinationPos}&key=${apiKey}&mode=${travelMode}`;
        const response = await fetch(url); // Use fetch instead of axios
        const data = await response.json(); // Parse JSON response
        setResponse(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    getResponse();
  }, [originPos, destinationPos, travelMode]);

  useEffect(() => {
    if (response) {
      calculateDistance();
      calculateDuration();
    }
  }, [response]);

  const calculateDistance = () => {
    const result = response;
    const distanceInMeters = result.rows[0].elements[0].distance.value;
    const distanceInKilometers = distanceInMeters / 1000;
    setDistance(distanceInKilometers);
  };

  const calculateDuration = () => {
    try {
      const result = response;
      const durationInSeconds = result.rows[0].elements[0].duration.value;
      const hours = Math.floor(durationInSeconds / 3600);
      const minutes = Math.floor((durationInSeconds % 3600) / 60);
      const formattedDuration = `${hours} hours ${minutes} minutes`;

      setDuration(formattedDuration);
    } catch (error) {
      console.error("Error calculating duration: ", error);
    }
  };

  return (
    <>
      <StyledButton
        textStyles={{ fontWeight: "bold" }}
        buttonText={`Distance:   ${distance} km`}
        buttonStyles={[
          buttonStyles.facebookButton,
          {
            backgroundColor: "lightblue",
            position: "absolute",
            top:
              Platform.OS === "android"
                ? screen.height - screen.height / 7
                : screen.height - screen.height / 4,
            right: screen.width - 300,
            width: 290,
            height: 50,
            paddingTop: 15,
          },
        ]}
      />
      <StyledButton
        textStyles={{ fontWeight: "bold" }}
        buttonText={`Duration:   ${duration}`}
        buttonStyles={[
          buttonStyles.facebookButton,
          {
            backgroundColor: "lightblue",
            position: "absolute",
            top:
              Platform.OS === "android"
                ? screen.height - screen.height / 4.5
                : screen.height - screen.height / 5 + 15,
            right: screen.width - 300,
            width: 290,
            height: 50,
            paddingTop: 15,
          },
        ]}
      />
    </>
  );
};

export default DistanceTimeCalculator;
