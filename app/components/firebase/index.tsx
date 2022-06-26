import { initializeApp } from "firebase/app";
import Config from "./config";

const firebaseClient = initializeApp(Config, "Front");

export default firebaseClient;
