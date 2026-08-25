import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

import { auth } from "../config/firebase.js";

export const loginUser = async (
  email,
  password
) => {
  const result =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  const firebaseUser = result.user;
  console.log("Login User Auth.service: ",firebaseUser);
  
  const idToken = await firebaseUser.getIdToken();
  console.log("IdToken Auth.service: ",idToken)

  return {
    firebaseUser,
    idToken,
  };
};

export const createUser = async (
  email,
  password,
  obj
) => {
  const result =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
  
  console.log("createUser result:",result);

  const firebase_user = result.user;

  try{
    await updateProfile(auth.currentUser, obj);
    console.log("Profile updated successfully");
  }catch(error){
    console.log("Error updating profile:",error);
  }

  const idToken = await firebase_user.getIdToken();
  console.log("IdToken Auth.service: ",idToken);
  
  return {
    firebase_user,
    idToken,
  };
};


export const logoutUser = async () => {
  await signOut(auth);
};