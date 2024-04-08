import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

import { initializeApp } from "firebase/app";
import { getAuth  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {

};





const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;