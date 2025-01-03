import Constants from "expo-constants";
import * as Location from "expo-location";
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Dimensions, Linking, Platform } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { Snackbar } from "react-native-paper";

import { StyledButton } from "../components/styledButton";
import DistanceTimeCalculator from "../components/timeDistanceCalculator";
import { GOOGLE_API_KEY } from "../constraints/GoogleAPIKEY";
import { addAddress } from "../services/collectionManager";
import { auth } from "../services/firebase";
import { buttonStyles } from "../styles/buttonStyles";

const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export const MapScreen = () => {
  const [initialRegion, setInitialRegion] = useState(null);
  const mapRef = useRef();
  const searchTextRef = useRef(null);

  const [destination, setDestination] = useState();
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const [transportMode, setTransportMode] = useState("DRIVING");
  const [showTransportOptions, setShowTransportOptions] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [details, setDetails] = useState();

  const onPressAddress = (details) => {
    setDestination({
      latitude: details?.geometry?.location.lat,
      longitude: details?.geometry?.location.lng,
    });
    moveToLocation(
      details?.geometry?.location.lat,
      details?.geometry?.location.lng
    );
    setShowTransportOptions(true);
    setDetails(details);
  };

  const moveToLocation = async (latitude, longitude) => {
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      1000
    );
  };
  // Function to get current location
  const getCurrentLocation = async () => {
    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "denied") {
        Alert.alert(
          "Location Permission Denied",
          "You need to enable location services for this app in the settings.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => Linking.openURL("app-settings:"),
            },
          ]
        );
        return;
      }
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      // Get current location
      const location = await Location.getLastKnownPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Set initial region based on current location
      setInitialRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error("Error getting current location: ", error);
    }
  };
  useEffect(() => {
    // Call the function to get current location
    getCurrentLocation();
  }, []);

  return (
    <View style={styles.container}>
      {initialRegion && (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={
            Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
          initialRegion={initialRegion}
          loadingEnabled
          loadingBackgroundColor="blue"
          loadingIndicatorColor="white"
        >
          {initialRegion !== undefined && <Marker coordinate={initialRegion} />}
          {destination && destination.latitude && destination.longitude && (
            <Marker coordinate={destination} />
          )}
          {initialRegion !== undefined && destination !== undefined ? (
            <MapViewDirections
              origin={initialRegion}
              destination={destination}
              apikey={GOOGLE_API_KEY}
              strokeColor="hotpink"
              strokeWidth={2}
              mode={transportMode}
              resetOnChange
            />
          ) : null}
        </MapView>
      )}
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          ref={searchTextRef}
          placeholder="Search here"
          textInputProps={{
            value: searchText,
            onChangeText: (text) => {
              setSearchText(text);
              if (text === "") {
                setShowTransportOptions(false);
              }
            },
          }}
          enablePoweredByContainer={false}
          fetchDetails
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
            onPressAddress(details);
          }}
          query={{
            key: GOOGLE_API_KEY,
            language: "en",
          }}
        />
      </View>
      {showTransportOptions && searchText !== "" && (
        <DistanceTimeCalculator
          origin={initialRegion}
          destination={destination}
          travelMode={transportMode.toLowerCase()}
        />
      )}
      {showTransportOptions && searchText !== "" && (
        <>
          <StyledButton
            useIcon
            buttonText="Save"
            textStyles={{ fontWeight: "bold" }}
            iconName="bookmark-sharp"
            iconSize={30}
            action={async () => {
              const place = details?.formatted_address;
              const addressObject = {
                place,
              };
              await addAddress(auth.currentUser.uid, addressObject);
              setSnackbarVisible(true);
            }}
            buttonStyles={[
              [
                buttonStyles.trafficButton,
                {
                  top:
                    Platform.OS === "android"
                      ? screen.height - 200
                      : screen.height - screen.height / 3,

                  left: screen.width - 80,
                  backgroundColor: "#03fc7f",
                  width: 65,
                  height: 65,
                },
              ],
            ]}
          />
          <StyledButton
            useIcon
            iconName="car"
            iconSize={30}
            action={() => {
              setTransportMode("DRIVING");
            }}
            buttonStyles={[
              [
                buttonStyles.trafficButton,
                {
                  left: 20,
                  backgroundColor:
                    transportMode === "DRIVING" ? "lightblue" : "white",
                },
              ],
            ]}
          />
          <StyledButton
            useIcon
            iconName="walk"
            iconSize={30}
            action={() => {
              setTransportMode("WALKING");
            }}
            buttonStyles={[
              [
                buttonStyles.trafficButton,
                {
                  left: 120,
                  backgroundColor:
                    transportMode === "WALKING" ? "lightblue" : "white",
                },
              ],
            ]}
          />
          <StyledButton
            useIcon
            iconName="bicycle"
            iconSize={30}
            action={() => {
              setTransportMode("BICYCLING");
            }}
            buttonStyles={[
              [
                buttonStyles.trafficButton,
                {
                  right: 120,
                  backgroundColor:
                    transportMode === "BICYCLING" ? "lightblue" : "white",
                },
              ],
            ]}
          />
          <StyledButton
            useIcon
            iconName="bus"
            iconSize={30}
            action={() => {
              setTransportMode("TRANSIT");
            }}
            buttonStyles={[
              [
                buttonStyles.trafficButton,
                {
                  right: 20,
                  backgroundColor:
                    transportMode === "TRANSIT" ? "lightblue" : "white",
                },
              ],
            ]}
          />
        </>
      )}
      {searchText !== "" && (
        <StyledButton
          useIcon
          iconName="close"
          iconSize={20}
          action={() => {
            setDestination(null);
            setShowTransportOptions(false);
            setDetails(null);
            searchTextRef.current?.setAddressText("");
          }}
          buttonStyles={[
            [
              buttonStyles.trafficButton,
              {
                top: Platform.OS === "android" ? 38 : 55,
                left: screen.width - 60,
                backgroundColor: "lightgray",
              },
            ],
          ]}
        />
      )}
      <StyledButton
        useIcon
        iconName="navigate"
        iconSize={20}
        action={async () => {
          getCurrentLocation();
          moveToLocation(initialRegion.latitude, initialRegion.longitude);
        }}
        buttonStyles={[
          [
            buttonStyles.trafficButton,
            {
              position: "absolute",
              top:
                Platform.OS === "android"
                  ? screen.height - 110
                  : screen.height - screen.height / 5,

              left: screen.width - 70,
              backgroundColor: "#639cf7",
              width: 50,
              height: 50,
            },
          ],
        ]}
      />
      {/* Snackbar */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: "CANCEL",
          onPress: () => {
            // Undo action
            // Implement undo logic here if needed
            setSnackbarVisible(false);
          },
        }}
      >
        Address saved successfully!
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  footer: {
    backgroundColor: "white",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "lightgray",
  },
  searchContainer: {
    position: "absolute",
    width: "95%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: Platform.OS === "android" ? screen.height / 30 : screen.height / 20,
  },
});
