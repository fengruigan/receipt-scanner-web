// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes, deleteObject } from "@firebase/storage";
import { getDatabase, onValue, ref as dbRef, set } from "@firebase/database";
import { v4 } from "uuid";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "receipt-scanner-27b6e.firebaseapp.com",
  databaseURL: "https://receipt-scanner-27b6e-default-rtdb.firebaseio.com",
  projectId: "receipt-scanner-27b6e",
  storageBucket: "receipt-scanner-27b6e.appspot.com",
  messagingSenderId: "994509085697",
  appId: "1:994509085697:web:deecd01b8b88ce5bc1b400",
  measurementId: "G-S290WBE6ZL",
};

// const app = initializeApp(config);

export const firebaseInit = () => initializeApp(config);

// storage
export const uploadToStorage = async (parentRef, file) => {
  let uid = v4();
  return await uploadBytes(storageRef(getStorage(), `${parentRef}/${uid}.jpg`), file);
};

export const getUrl = async (filePath) => {
  return await getDownloadURL(storageRef(getStorage(), filePath));
};

export const deleteFromStorage = async (filePath) => {
  await deleteObject(storageRef(getStorage(), filePath));
};

// realtime database
export const writeToDatabase = (ref, data) => {
  set(dbRef(getDatabase(), ref), data);
};

export const addDBListener = (ref, callback) => {
  return onValue(dbRef(getDatabase(), ref), (snapshot) => {
    callback(snapshot.val());
  });
};
