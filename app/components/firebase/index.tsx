import { initializeApp } from "firebase/app";
import Config from "./config";

const firebase = initializeApp(Config);

export default firebase;
