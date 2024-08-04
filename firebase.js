// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA67UqQgVSBO4iAv_kJkKce-e_NcE0K1QY",
  authDomain: "inventory-management-e2172.firebaseapp.com",
  projectId: "inventory-management-e2172",
  storageBucket: "inventory-management-e2172.appspot.com",
  messagingSenderId: "607687483381",
  appId: "1:607687483381:web:2d908a3e2591f1b7f08abc",
  measurementId: "G-9311VQ08YZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}