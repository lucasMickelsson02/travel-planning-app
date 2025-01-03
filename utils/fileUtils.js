// fileUtils.js
import * as DocumentPicker from "expo-document-picker";
import * as IntentLauncher from "expo-intent-launcher";
import * as Sharing from "expo-sharing";
import {
  listAll,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { Platform, Alert } from "react-native";

import { storage } from "../services/firebase";

export const pickDocument = async (uploadFile, allowUpload) => {
  const result = await DocumentPicker.getDocumentAsync({
    type: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "application/rtf",
      "application/vnd.oasis.opendocument.text",
      "image/jpeg",
      "image/png",
    ],
  });
  if (!result.canceled && allowUpload) {
    console.log("Uploading file!");
    uploadFile(result.assets[0].uri, result.assets[0].name);
  } else {
    console.log("File Uploading canceled!");
  }
  return result.assets[0];
};

export const fetchFiles = async (setFiles, folder) => {
  try {
    //const storage = getStorage();
    const reference = ref(storage, folder);
    console.log("Reference:", reference);
    const listResult = await listAll(reference);
    console.log("List Result:", listResult);
    const urls = await Promise.all(
      listResult.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        console.log("URL:", url);
        return { name: itemRef.name, url };
      })
    );
    setFiles(urls);
  } catch (error) {
    console.log("Error:", error);
    Alert.alert("Error", "Failed to fetch files");
  }
};

export const deleteFile = async (filePath, fetchFiles) => {
  try {
    const reference = ref(storage, filePath);
    await deleteObject(reference);
    fetchFiles();
  } catch (error) {
    console.log(error);
    Alert.alert("Error", "Failed to delete file");
  }
};

export const uploadFile = async (
  uri,
  fileName,
  folder,
  setUploading,
  setProgress,
  fetchFiles
) => {
  setUploading(true);
  setProgress(0);
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, folder + "/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        Alert.alert("Error", "Failed to upload file");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUploading(false);
        fetchFiles();
      }
    );
  } catch (error) {
    console.log(error);
    Alert.alert("Error", "Failed to upload file");
    setUploading(false);
  }
};

export const openFile = async (url) => {
  try {
    if (Platform.OS === "ios") {
      await Sharing.shareAsync(url);
    } else {
      await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: url,
        flags: 1,
        type: "application/pdf",
      });
    }
  } catch (error) {
    console.log(error.message);
    Alert.alert("Error", "Failed to open file");
  }
};
