// FileHandler.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { StyledButton } from "../components/styledButton";
import { TextTitle } from "../components/textTitle";
import { auth } from "../services/firebase";
import { Loader } from "./loadingIndicator";
import { buttonStyles } from "../styles/buttonStyles";
import { styles } from "../styles/commonstyles";
import { deviceHeight } from "../utils/dimensions";
import {
  pickDocument,
  fetchFiles,
  deleteFile,
  uploadFile,
  openFile,
} from "../utils/fileUtils";

export const FileHandler = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles(setFiles, "travel-docs-" + auth.currentUser.uid);
    setLoading(false);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={[styles.container, { paddingTop: 40, paddingLeft: 0 }]}>
      {uploading ? (
        <View style={{ alignSelf: "center" }}>
          <Loader />
          <TextTitle
            text={Math.round(progress) + "% uploaded"}
            textColor="white"
            fontSize={20}
          />
        </View>
      ) : (
        <>
          {files.length ? (
            <FlatList
              data={files}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => openFile(item.url)}
                  onLongPress={() => {
                    Alert.alert(
                      "Delete file",
                      "Are you sure you want to delete the file?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          onPress: () =>
                            deleteFile(item.url, () => fetchFiles(setFiles)),
                        },
                      ],
                      { cancelable: false }
                    );
                  }}
                  style={[fileStyles.fileItemContainer, { marginLeft: 20 }]}
                >
                  <View style={fileStyles.iconContainer}>
                    <Ionicons name="folder" size={25} color="white" />
                  </View>
                  <Text style={fileStyles.fileName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <TextTitle
              text="You dont have any saved files!"
              fontSize={15}
              textColor="white"
              other={{ alignSelf: "center" }}
            />
          )}
          <StyledButton
            buttonStyles={[
              buttonStyles.anonymousButton,
              {
                alignSelf: "center",
                justifyContent: "space-evenly",
                marginBottom: deviceHeight / 2,
                flexDirection: "row",
                backgroundColor: "#1E90FF",
              },
            ]}
            action={() =>
              pickDocument(
                (uri, name) =>
                  uploadFile(
                    uri,
                    name,
                    "travel-docs-" + auth.currentUser.uid,
                    setUploading,
                    setProgress,
                    () =>
                      fetchFiles(
                        setFiles,
                        "travel-docs-" + auth.currentUser.uid
                      )
                  ),
                true
              )
            }
            buttonText="Upload your travel documents"
            textStyles={{ color: "white", fontWeight: "bold" }}
            useIcon
            iconName="cloud-upload"
          />
        </>
      )}
    </View>
  );
};

const fileStyles = {
  fileItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  iconContainer: {
    marginRight: 10,
  },
  fileName: {
    color: "white",
    fontSize: 16,
  },
};
