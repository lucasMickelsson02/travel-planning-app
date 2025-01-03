import {
  collection,
  getDocs,
  deleteDoc,
  setDoc,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

export const fetchAddresses = async (userId) => {
  try {
    // Get reference to the "addresses" collection under the user's ID
    const userAddressesCollection = collection(
      db,
      `adresses/${userId}/addresses`
    );
    // Fetch all documents from the collection
    const snapshot = await getDocs(userAddressesCollection);
    if (!snapshot.empty) {
      console.log("not empty");
      // Extract data from each document
      const addresses = [];
      snapshot.forEach((doc) => {
        addresses.push({ id: doc.id, ...doc.data() });
      });

      return addresses;
    } else {
      console.log("empty");
      return []; // Return an empty array if no documents found
    }
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw error;
  }
};

export const addAddress = async (userId, addressData) => {
  try {
    // Get reference to the "addresses" collection
    const userAddressesCollection = collection(
      db,
      `adresses/${userId}/addresses/`
    );
    // Add a new document with an auto-generated ID
    await setDoc(doc(userAddressesCollection), addressData);
    console.log("Address added successfully for user:", userId);
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
};
export const addCredentials = async (userId, cred) => {
  try {
    // Get reference to the "addresses" collection
    const userCollection = collection(db, `userProfiles/${userId}/profiles/`);
    // Add a new document with an auto-generated ID
    await setDoc(doc(userCollection, userId), cred);
    console.log("Profile added successfully for user:", userId);
  } catch (error) {
    console.error("Error adding profile:", error);
    throw error;
  }
};

// Function to delete an address document from the "addresses" collection by document ID
export const deleteAddress = async (userId, addressText) => {
  try {
    // Construct a query to search for documents where the 'place' property equals the provided address text
    const q = query(
      collection(db, `adresses/${userId}/addresses`),
      where("place", "==", addressText)
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Define an array to store the IDs of documents to be deleted
    const deletePromises = [];

    // Iterate over the query results and add the deletion promises to the array
    querySnapshot.forEach((document) => {
      const addressDocRef = doc(
        db,
        `adresses/${userId}/addresses/${document.id}`
      );
      deletePromises.push(deleteDoc(addressDocRef));
    });

    // Wait for all deletion promises to complete
    await Promise.all(deletePromises);

    console.log("Addresses deleted successfully");

    // Return the updated list of addresses after deletion
    const updatedAddresses = await fetchAddresses(userId);
    return updatedAddresses;
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
};
export const fetchCurrentUser = async (userid) => {
  // Fetch user profile from Firestore
  const profileDocRef = doc(db, `userProfiles/${userid}/profiles/${userid}`);
  const profileDocSnap = await getDoc(profileDocRef);

  if (profileDocSnap.exists()) {
    return profileDocSnap.data();
  }
};
// Function to delete all documents in a subcollection
const deleteSubcollectionDocuments = async (userid) => {
  // Reference to the subcollection (profiles)
  const profilesCollectionRef = collection(
    db,
    `userProfiles/${userid}/profiles`
  );

  // Get all documents in the profiles subcollection
  const profileDocsSnap = await getDocs(profilesCollectionRef);

  const deletePromises = profileDocsSnap.docs.map((doc) => deleteDoc(doc.ref));

  // Delete each profile document
  await Promise.all(deletePromises);
};

export const deleteUser = async (userid) => {
  try {
    // First, delete all documents in the profiles subcollection
    await deleteSubcollectionDocuments(userid);

    // Now, delete the main user profile document
    const userDocRef = doc(db, `userProfiles/${userid}`);
    await deleteDoc(userDocRef);

    console.log(`User ${userid} and their profiles deleted successfully.`);
  } catch (error) {
    console.error("Error deleting user or profiles: ", error);
    throw new Error("Failed to delete user or profiles.");
  }
};
export const addDiary = async (userId, diaryData) => {
  try {
    // Get reference to the "addresses" collection
    const diaryCollection = collection(db, `diaryEntries/${userId}/diaries/`);
    // Add a new document with an auto-generated ID
    await setDoc(doc(diaryCollection), diaryData);
    console.log("Diary added successfully for user:", userId);
  } catch (error) {
    console.error("Error adding diary:", error);
    throw error;
  }
};
export const fetchDiaries = async (userId) => {
  try {
    const diaryCollection = collection(db, `diaryEntries/${userId}/diaries`);
    const snapshot = await getDocs(diaryCollection);

    if (!snapshot.empty) {
      const diaries = [];
      snapshot.forEach((doc) => {
        const data = doc.data();

        // Convert Firestore timestamp to JavaScript Date object
        const date = new Date(
          data.date.seconds * 1000 + data.date.nanoseconds / 1000000
        );

        // Format the date to ISO 8601 (full date and time)
        const isoDate = date.toISOString();

        // Or, if you only want the date portion:
        const dateOnly = date.toISOString().split("T")[0];

        // Log the formatted date
        console.log("Formatted ISO Date:", isoDate);
        console.log("Date Only:", dateOnly);

        // Push to the diaries array with the formatted date
        diaries.push({ id: doc.id, ...data, date: dateOnly }); // or use date: dateOnly for just the date
      });

      return diaries;
    } else {
      console.log("No diaries found for user " + userId);
      return [];
    }
  } catch (error) {
    console.error("Error fetching diaries:", error);
    throw error;
  }
};
