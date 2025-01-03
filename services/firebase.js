import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// My web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtezQEDW5hhnAuBUVcV32kDDhSk3RH-Ys",
  authDomain: "travel-app-4645f.firebaseapp.com",
  projectId: "travel-app-4645f",
  storageBucket: "travel-app-4645f.appspot.com",
  messagingSenderId: "257457818850",
  appId: "1:257457818850:web:fea433d9f991fefcaba2bb",
  measurementId: "G-MEWKJ8NBET",
};

// Initialize Firebase
let app;

if (!getApps().length) {
  console.log("initializing firebase");
  app = initializeApp(firebaseConfig);
} else {
  console.log("firebase instance already instantiated!");
}

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
//const db = initializeFirestore(app, "traveldata");
const db = initializeFirestore(app, getFirestore, "traveldata");
const storage = getStorage(app, "gs://travel-app-4645f.appspot.com");
//console.log(storage);

export { app, auth, db, storage };
