import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDNw52vrfriWQy7IzcRQJDyWKyQQWglwI0",
  authDomain: "projeto-reciclagem-4afa6.firebaseapp.com",
  databaseURL: "https://projeto-reciclagem-4afa6-default-rtdb.firebaseio.com",
  projectId: "projeto-reciclagem-4afa6",
  storageBucket: "projeto-reciclagem-4afa6.firebasestorage.app",
  messagingSenderId: "921785820340",
  appId: "1:921785820340:web:0e095b6864d354f3dc63e1"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);