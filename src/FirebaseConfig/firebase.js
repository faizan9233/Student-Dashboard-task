// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import {getFirestore} from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyBxI8ob_dfeyisoIA99LTqLKF_we516C6I",
  authDomain: "nextjs-firebase-47785.firebaseapp.com",
  projectId: "nextjs-firebase-47785",
  storageBucket: "nextjs-firebase-47785.appspot.com",
  messagingSenderId: "80047362991",
  appId: "1:80047362991:web:26739aedfacf6502dfd55a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
export {db}