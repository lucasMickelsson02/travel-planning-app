/*import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";*/
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
} from "firebase/auth";
import { Alert, Button } from "react-native";

import { auth } from "./firebase";

export const checkPasswordmatch = (password, confirmPassword) => {
  return password.trim() === confirmPassword.trim();
};

export const signUpEmail = async (auth, email, password) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  const user = userCred.user;

  console.log("User created:", user);

  return user;
};

export const signInEmail = async (auth, email, password) => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    const user = userCred.user;

    console.log("User signed in:", user);

    return user;
  } catch (error) {
    // Additional error handling or logging can be added here
    if (error.code === "auth/invalid-credential") {
      console.log("Invalid login credentials");
      Alert.alert("Invalid login credentials", "Please try again!");
    } else if (error.code === "auth/too-many-requests") {
      console.log("Too many sign-in requests. Please try again later.");
      Alert.alert(
        "Too many sign-in requests",
        "Please try again later. Your account has been temporarily blocked due to too many sign-in attempts."
      );
    } else if (error.code === "auth/invalid-email") {
      console.log("The mail is in wrong format!");
      Alert.alert("The mail is in wrong format!", "Please try again!");
    } else {
      console.log("Error signin: " + error.code);
    }
  }
};

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error.code);
  }
};

export const signInAnonymous = async () => {
  try {
    // Sign in anonymously
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;

    console.log("User signed in anonymously:", user);
    // You can handle the signed-in user here, such as navigating to the next screen
  } catch (error) {
    // Handle any errors that occur during the sign-in process
    console.error("Error signing in anonymously:", error.code);
  }
};

/*GoogleSignin.configure({
  webClientId:
    "257457818850-gs5c37p5a00h0bqoi25h99i5t1skjopb.apps.googleusercontent.com",
});

export async function onGoogleButtonPress() {
  try {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const userCredential = await signInWithCredential(auth, googleCredential);

    // Access user information from userCredential
    const user = userCredential.user;
    console.log("User signed in:", user);

    return user;
  } catch (error) {
    // Handle errors
    console.error("Error signing in with Google:", error);
    throw error;
  }
}*/
