import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAvrDH3pQhD79ez64WZWMB2Xuu-W6aezFE",
  authDomain: "crackit-1aa53.firebaseapp.com",
  projectId: "crackit-1aa53",
  storageBucket: "crackit-1aa53.firebasestorage.app",
  messagingSenderId: "412053718801",
  appId: "1:412053718801:web:bfccfa19d6b4a37c206eb0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();