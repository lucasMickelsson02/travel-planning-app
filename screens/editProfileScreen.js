import React, { useEffect, useState } from "react";
import { View, TextInput, Alert, Modal, StyleSheet, Text } from "react-native";
import { CountryPicker } from "react-native-country-codes-picker";

import { StyledButton } from "../components/styledButton";
import { TextTitle } from "../components/textTitle";
import {
  addCredentials,
  deleteUser,
  fetchCurrentUser,
} from "../services/collectionManager";
import { auth } from "../services/firebase";
import { Loader } from "../components/loadingIndicator";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

export const EditProfileScreen = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const data = await fetchCurrentUser(user.uid);
          if (data) {
            setName(data.name || "");
            setPhone(data.phone || "");
            setCountry(data.country || "");
          } else {
            console.log("not exists");
            setName("");
            setPhone("");
            setCountry("");
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        Alert.alert("Error", "Failed to fetch user profile. Please try again.");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    try {
      await addCredentials(auth.currentUser.uid, {
        name,
        phone,
        country,
      });

      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully."
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const reauthenticate = async (currentPassword) => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is currently signed in.");

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);
  };

  const handleDeleteAccount = () => {
    setPasswordModalVisible(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      await reauthenticate(password);
      await deleteUser(auth.currentUser.uid);
      await auth.currentUser.delete();

      Alert.alert(
        "Account Deleted",
        "Your account has been deleted successfully."
      );
    } catch (error) {
      console.log("Error deleting account");
      if (error.code === "auth/invalid-credential") {
        Alert.alert("Error", "Incorrect password. Please try again.");
      } else {
        Alert.alert("Error", "Failed to delete account. Please try again.");
      }
    } finally {
      setPasswordModalVisible(false);
      setPassword("");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "blue" }}>
      <View style={{ alignItems: "center" }}>
        <TextTitle
          text="Edit profile"
          textColor="white"
          fontSize={20}
          other={{ marginBottom: 30, marginTop: 20 }}
        />
        <TextInput
          placeholder="Enter your name"
          placeholderTextColor="white"
          value={name}
          style={styles.input}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Enter your phone"
          placeholderTextColor="white"
          keyboardType="phone-pad"
          value={phone}
          style={styles.input}
          onChangeText={setPhone}
        />
        <TextInput
          placeholderTextColor="white"
          value={country}
          editable={false}
          style={styles.input}
        />
      </View>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <StyledButton
          action={() => setShowPicker(!showPicker)}
          buttonText="Select country"
          textStyles={{ textAlign: "center" }}
          buttonStyles={{
            backgroundColor: "white",
            padding: 10,
            borderRadius: 5,
          }}
        />
        {showPicker && (
          <CountryPicker
            show={showPicker}
            pickerButtonOnPress={(item) => {
              setCountry(item.flag);
              setShowPicker(false);
            }}
          />
        )}
      </View>
      <StyledButton
        action={handleSave}
        buttonText="Save"
        textStyles={{ color: "white", textAlign: "center" }}
        buttonStyles={{
          backgroundColor: "green",
          padding: 10,
          borderRadius: 5,
          marginTop: 20,
        }}
      />
      <StyledButton
        action={handleDeleteAccount}
        buttonText="Delete account"
        textStyles={{ color: "white", textAlign: "center" }}
        buttonStyles={{
          backgroundColor: "red",
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
        }}
      />

      {/* Password Input Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPasswordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Your Password</Text>
            <TextInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <View style={styles.buttonContainer}>
              <StyledButton
                action={confirmDeleteAccount}
                buttonText="Confirm Delete"
                textStyles={{ color: "white", textAlign: "center" }}
                buttonStyles={styles.deleteButton}
              />
              <StyledButton
                action={() => setPasswordModalVisible(false)}
                buttonText="Cancel"
                textStyles={{ color: "white", textAlign: "center" }}
                buttonStyles={styles.cancelButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    width: 350,
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "space-between",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});
