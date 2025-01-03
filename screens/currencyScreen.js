import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Keyboard,
} from "react-native";
import { StyledButton } from "../components/styledButton";

import { TextTitle } from "../components/textTitle";
import { currencyAPIKEY } from "../constraints/currencyAPIKey";
import { styles } from "../styles/commonstyles";
import { currencyData } from "../utils/currencyCodes";
import { deviceWidth } from "../utils/dimensions";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { KeyboardAvoidingView } from "react-native";
import { ScrollView } from "react-native";
import { buttonStyles } from "../styles/buttonStyles";

export const CurrencyScreen = () => {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const API_KEY = currencyAPIKEY;
  const tabBarHeight = useBottomTabBarHeight();

  const convertCurrency = async () => {
    await fetch(
      `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&base_currency=${baseCurrency}&currencies=${targetCurrency}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          const rates = data.data;
          const rate = rates[targetCurrency].value;
          const converted = parseFloat(amount) * rate;
          setConvertedAmount(converted.toFixed(3));
        } else {
          console.error("Error converting currency:", data.error);
          setConvertedAmount(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching exchange rate:", error);
        setConvertedAmount(null);
      });
  };

  const swapCurrencies = () => {
    // Swap baseCurrency and targetCurrency
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
  };

  useEffect(() => {
    if (convertedAmount === null) {
      // Reset other state values when convertedAmount is cleared
      setBaseCurrency("USD");
      setTargetCurrency("EUR");
      setAmount("");
    }
  }, [convertedAmount]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={tabBarHeight} // Use the tab bar height as the offset
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingLeft: Platform.OS === "ios" && 15 },
        ]}
      >
        <TextTitle
          text="Base currency"
          fontSize={20}
          textColor="white"
          other={{ marginBottom: 15 }}
        />
        <View style={stylesCurrency.pickerContainer}>
          <Picker
            selectedValue={baseCurrency}
            onValueChange={(itemValue) => setBaseCurrency(itemValue)}
            style={stylesCurrency.picker}
            dropdownIconColor={Platform.OS === "android" ? "white" : undefined} // iOS does not support dropdownIconColor
            itemStyle={stylesCurrency.pickerItem}
            mode={Platform.OS === "ios" ? "dropdown" : "dialog"} // Use 'dropdown' mode for iOS
          >
            {currencyData.map((currency, index) => (
              <Picker.Item
                key={index}
                label={`${currency.code} - ${currency.name}`}
                value={currency.code}
              />
            ))}
          </Picker>
        </View>
        <StyledButton
          action={swapCurrencies} // Swap currency on button press
          useIcon
          iconName="swap-vertical-outline"
          iconSize={40}
          textStyles={{ fontWeight: "bold" }}
          buttonStyles={[
            [
              buttonStyles.diaryButton,
              {
                backgroundColor: "white",
                marginTop: 5,
                marginBottom: 15,
                marginLeft: deviceWidth / 20,
                height: 45,
              },
            ],
          ]}
        />

        <TextTitle
          text="Target currency"
          fontSize={20}
          textColor="white"
          other={{ marginBottom: 15 }}
        />
        <View style={stylesCurrency.pickerContainer}>
          <Picker
            selectedValue={targetCurrency}
            onValueChange={(itemValue) => setTargetCurrency(itemValue)}
            style={stylesCurrency.picker}
            dropdownIconColor={Platform.OS === "android" ? "white" : undefined}
            itemStyle={stylesCurrency.pickerItem}
            mode={Platform.OS === "ios" ? "dropdown" : "dialog"}
          >
            {currencyData.map((currency, index) => (
              <Picker.Item
                key={index}
                label={`${currency.code} - ${currency.name}`}
                value={currency.code}
              />
            ))}
          </Picker>
        </View>
        <TextTitle
          text="Amount:"
          fontSize={20}
          textColor="white"
          other={{
            marginBottom: 5,
          }}
        />
        <TextInput
          style={stylesCurrency.input}
          value={amount}
          onChangeText={(text) => {
            // Only allow numbers and check if the number is greater than zero
            const numericValue = parseFloat(text); // Convert text to a number

            // Check if numericValue is a valid number and greater than zero
            if (!isNaN(numericValue) && numericValue > 0) {
              setAmount(text); // Update state only if valid
            } else {
              setAmount(""); // Clear input if it's not valid
            }
          }}
          keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
        />

        <View style={{ marginLeft: deviceWidth / 50, marginTop: 5 }}>
          <Button
            disabled={amount ? false : true}
            title="Press me to convert money"
            color={Platform.OS === "ios" && "white"}
            onPress={async () => {
              await convertCurrency();
            }}
          />
        </View>
        {convertedAmount !== null && (
          <>
            <TextTitle
              text={`Converted amount: ${convertedAmount} ${targetCurrency}`}
              fontSize={15}
              textColor="white"
              other={{ marginTop: 15 }}
            />
            <View style={{ marginLeft: deviceWidth / 50, marginTop: 10 }}>
              <Button
                title="Reset"
                onPress={async () => {
                  setConvertedAmount(null);
                }}
              />
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const stylesCurrency = StyleSheet.create({
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "white",
    color: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  picker: {
    height: Platform.OS === "ios" ? 180 : 50,
    width: 250,
    color: "white",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "white", // White border
    borderRadius: 10, // Rounded corners
    padding: 5, // Padding to create some space around the Picker
    marginBottom: 15,
    backgroundColor: Platform.OS === "ios" && "white",
  },
});
