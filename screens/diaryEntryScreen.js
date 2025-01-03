import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";

import { StyledButton } from "../components/styledButton";
import { TextTitle } from "../components/textTitle";
import { addDiary } from "../services/collectionManager";
import { auth } from "../services/firebase";
import { Loader } from "../components/loadingIndicator";
import { buttonStyles } from "../styles/buttonStyles";
import { pickDocument, uploadFile, fetchFiles } from "../utils/fileUtils";

export const DiaryEntryScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState(null);
  const [file, setFile] = useState();
  const [cloudfile, setCloudFile] = useState();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (snackbarVisible) {
      navigation.navigate("Home", { showSnackbar: true });
    }
  }, [snackbarVisible, navigation]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    console.log(date);
  };

  const handleGetLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
  };

  const handleSave = async () => {
    let entry;
    if (cloudfile && cloudfile.length > 0) {
      console.log("Cloudfile: " + JSON.stringify(cloudfile));

      // Keep only the last element in the cloudfile array
      const lastCloudFile = [cloudfile[cloudfile.length - 1]];

      entry = {
        title,
        description,
        date,
        cloudfile: lastCloudFile,
        location,
      };
    } else {
      entry = {
        title,
        description,
        date,
        location,
      };
    }

    // Save entry to Firestore (function to be implemented)
    console.log(entry);

    await addDiary(auth.currentUser.uid, entry);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        diaryStyles.container,
        { backgroundColor: "blue" },
      ]}
    >
      <TextTitle
        text="Title"
        fontSize={20}
        textColor="white"
        other={{ textAlign: "flex-start", marginBottom: 10 }}
      />
      <TextInput
        style={[diaryStyles.input, { height: 40, color: "white" }]}
        value={title}
        onChangeText={setTitle}
        textAlignVertical="top"
        placeholder="Title of the diary"
        placeholderTextColor="white"
      />

      <TextTitle
        text="Description"
        fontSize={20}
        textColor="white"
        other={{ textAlign: "flex-start", marginBottom: 10 }}
      />
      <TextInput
        style={[diaryStyles.input, { color: "white" }]}
        value={description}
        onChangeText={setDescription}
        multiline
        textAlignVertical="top"
        placeholder="Write a story about your day!"
        placeholderTextColor="white"
      />

      <TextTitle
        text="Pick a date"
        fontSize={20}
        textColor="white"
        other={{ textAlign: "flex-start", marginBottom: 10 }}
      />
      <Button
        title={date ? date.toDateString() : "Pick a date"}
        onPress={() => setShowDatePicker(true)}
      />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <TextTitle
        text="Image"
        fontSize={20}
        textColor="white"
        other={{ textAlign: "flex-start", marginBottom: 10, marginTop: 20 }}
      />
      {file ? (
        <>
          {!cloudfile ? (
            <>
              <TouchableOpacity onPress={openModal}>
                <Image source={{ uri: file.uri }} style={diaryStyles.image} />
              </TouchableOpacity>
              <TextTitle
                text="Press on the image to view it!"
                textColor="white"
                other={{ marginBottom: 20 }}
              />
            </>
          ) : (
            <TextTitle
              text="File uploaded successfully for this diary!"
              textColor="white"
              other={{ marginBottom: 20 }}
            />
          )}
          {uploading && !cloudfile ? (
            <View style={{ alignSelf: "center" }}>
              <Loader />
              <TextTitle
                text={Math.round(progress) + "% uploaded"}
                textColor="white"
                fontSize={20}
              />
            </View>
          ) : (
            <StyledButton
              disableButton={!!cloudfile}
              action={async () => {
                try {
                  // Upload the file
                  await uploadFile(
                    file.uri,
                    file.name,
                    "diaryImages-" + auth.currentUser.uid,
                    setUploading,
                    setProgress,
                    async () =>
                      await fetchFiles(
                        setCloudFile,
                        "diaryImages-" + auth.currentUser.uid
                      )
                  );
                } catch (error) {
                  // Handle errors in upload or fetch operations
                  console.error("Error during file upload or fetch:", error);
                }
              }}
              buttonStyles={[
                [
                  buttonStyles.anonymousButton,
                  {
                    backgroundColor: !cloudfile ? "lightblue" : "lightgrey",
                    height: 40,
                    alignSelf: "center",
                    width: 130,
                  },
                ],
              ]}
              buttonText="Upload file"
              textStyles={{ fontWeight: "bold" }}
            />
          )}
          <View style={{ marginBottom: 15 }} />
          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={closeModal}
          >
            <View style={diaryStyles.modalContainer}>
              <TouchableOpacity
                style={diaryStyles.closeButton}
                onPress={closeModal}
              >
                <Text style={diaryStyles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <Image
                source={{ uri: file.uri }}
                style={diaryStyles.modalImage}
              />
            </View>
          </Modal>
        </>
      ) : (
        <View />
      )}

      <Button
        title="Pick Your Image"
        disabled={!(!cloudfile || uploading)}
        onPress={async () => {
          /*pickDocument(
            (uri, name) =>
              uploadFile(
                uri,
                name,
                "images-" + auth.currentUser.uid,
                setUploading,
                setProgress,
                () => fetchFiles(setFiles, "images-" + auth.currentUser.uid),
              ),
            false,
          );*/
          const file = await pickDocument(null, false);
          console.log(file.uri);
          setFile(file);
        }}
      />

      <TextTitle
        text="Location"
        fontSize={20}
        textColor="white"
        other={{ textAlign: "flex-start", marginBottom: 10, marginTop: 20 }}
      />
      <Button
        title={
          location
            ? `Location: ${location.latitude}, ${location.longitude}`
            : "Get location"
        }
        onPress={async () => {
          await handleGetLocation();
        }}
      />
      <StyledButton
        action={async () => {
          await handleSave();
          setSnackbarVisible(true);
        }}
        buttonStyles={[
          [
            buttonStyles.anonymousButton,
            {
              backgroundColor: "white",
              marginTop: 40,
              height: 50,
              alignSelf: "center",
              paddingTop: 15,
            },
          ],
        ]}
        buttonText="Save the diary"
        textStyles={{ fontWeight: "bold" }}
      />
    </ScrollView>
  );
};

const diaryStyles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  textArea: {
    height: 150, // Adjust the height as needed
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
    height: 180,
  },
  image: {
    width: 100,
    height: 100,
    margin: 10,
  },
  containerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageModal: {
    width: 150,
    height: 150,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: 300,
    height: 300,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "black",
  },
});
