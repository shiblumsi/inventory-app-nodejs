

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKgrYyqwVqEu3QH80h79kiR7Kr-rHdokQ",
  authDomain: "inventory-75914.firebaseapp.com",
  projectId: "inventory-75914",
  storageBucket: "inventory-75914.appspot.com",
  messagingSenderId: "170291034124",
  appId: "1:170291034124:web:ce35bca6d8375d81735629",
  measurementId: "G-EL2YKR4CWT"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export default initializeApp