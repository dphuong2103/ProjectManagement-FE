import { initializeApp } from 'firebase/app';
import {
  getAuth,
  browserSessionPersistence,
  setPersistence,
} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBDZBxE9-ZDpzVr34S3MKP6MVBRJnEonYI',
  authDomain: 'project-management-a129e.firebaseapp.com',
  projectId: 'project-management-a129e',
  storageBucket: 'project-management-a129e.appspot.com',
  messagingSenderId: '1092079225783',
  appId: '1:1092079225783:web:452815062a50f2a8e47632',
  measurementId: 'G-HL1EYW8N1B',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);

export function firebaseSignOut() {
  return auth.signOut();
}
