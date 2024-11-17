
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, addDoc, updateDoc, deleteDoc, collection } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBD5E-hhS5fHtLFwb5AMF9MWDUoVAlaGxk",
  authDomain: "fir-react-66c4b.firebaseapp.com",
  databaseURL: "https://fir-react-66c4b-default-rtdb.firebaseio.com",
  projectId: "fir-react-66c4b",
  storageBucket: "fir-react-66c4b.firebasestorage.app",
  messagingSenderId: "544334295886",
  appId: "1:544334295886:web:505e550ebc666bcaa6a41f",
  measurementId: "G-LEGSFHCH0V"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);




export const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};


export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};


export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};


export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};




export const setDocument = async (collectionName, docId, data) => {
  try {
    await setDoc(doc(db, collectionName, docId), data);
  } catch (error) {
    throw new Error(error.message);
  }
};


export const getDocument = async (collectionName, docId) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("Document not found!");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};


export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    throw new Error(error.message);
  }
};


export const updateDocument = async (collectionName, docId, data) => {
  try {
    await updateDoc(doc(db, collectionName, docId), data);
  } catch (error) {
    throw new Error(error.message);
  }
};


export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    throw new Error(error.message);
  }
};
