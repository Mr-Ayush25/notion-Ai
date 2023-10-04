// Import the functions you need from the SDKs you need
import { error } from "console";
import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "notion-ai-6d6b9.firebaseapp.com",
  projectId: "notion-ai-6d6b9",
  storageBucket: "notion-ai-6d6b9.appspot.com",
  messagingSenderId: "807592248468",
  appId: "1:807592248468:web:b8eb28b196022c7ac9a081",
  measurementId: "G-0574S4BE98",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const uploadFileToFirebase = async (
  image_url: string,
  noteid: string
) => {
  try {
    const respone = await fetch(image_url);
    const buffer = await respone.arrayBuffer();
    const file_name = `${noteid}${Date.now()}.jpeg`;
    const storageRef = ref(storage, file_name);
    await uploadBytes(storageRef, buffer, {
      contentType: "image/jpeg",
    });
    const firebase_url = await getDownloadURL(storageRef);
    return firebase_url;
  } catch (error) {}
  console.error(error);
};
