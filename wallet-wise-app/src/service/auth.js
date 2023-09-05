import { auth, db } from '../utils/firebase';  // Import Firestore database
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const signUp = async (email, password, fullName, idNumber) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Update the user's profile with the full name
  await updateProfile(user, { displayName: fullName });
  
  // Store the ID number in Firestore
  const userDocRef = doc(db, 'users', user.uid);
  await setDoc(userDocRef, { idNumber });
  
  return user;
};

const sendVerificationEmail = async (user) => {
  if (user) {
    console.log('Sending verification email to:', user.email);  // Log the email being sent to
    await sendEmailVerification(user);
  } else {
    console.log('No user provided to sendVerificationEmail');  // Log if no user is provided
  }
};

const logIn = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

const logOut = async () => {
  await signOut(auth);
};

const getCurrentUser = () => {
  return auth.currentUser;
};

const isAdmin = (user) => {
  if (user) {
    return user.email === 'admin@example.com';
  }
  return false;
};

const sendResetPasswordEmail = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

const observeAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

const authService = {
  signUp,
  sendVerificationEmail,
  logIn,
  logOut,
  getCurrentUser,
  sendResetPasswordEmail,
  isAdmin,
  observeAuthChanges,
};

export default authService;
