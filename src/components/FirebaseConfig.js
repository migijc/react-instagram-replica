import { initializeApp } from "firebase/app";
import {getAuth, onAuthStateChanged} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"


const firebaseConfig = {
    apiKey: "AIzaSyCQRaOZjnDxNEa1DgMIgxqDoxJwYlflVug",
    authDomain: "instagram-clone-eaee6.firebaseapp.com",
    projectId: "instagram-clone-eaee6",
    storageBucket: "instagram-clone-eaee6.appspot.com",
    messagingSenderId: "1087415862304",
    appId: "1:1087415862304:web:3a813b10703533d18e6845",
    storageBucket: "gs://instagram-clone-eaee6.appspot.com"
  };

  export const firebaseApp = initializeApp(firebaseConfig);
  export const storage= getStorage(firebaseApp)
  export const auth = getAuth(firebaseApp)
  export const firestore=getFirestore(firebaseApp)



