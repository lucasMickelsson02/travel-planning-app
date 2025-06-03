import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// My web app's Firebase configuration
export const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
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
const storage = getStorage(app, "BUCKET_NAME");
//console.log(storage);

export { app, auth, db, storage };
