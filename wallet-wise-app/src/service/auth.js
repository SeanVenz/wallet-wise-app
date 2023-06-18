import { auth } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const signUp = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

const sendVerificationEmail = async (user) => {
  if (user) {
    await sendEmailVerification(user);
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

const observeAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

const authService = {
  signUp,
  sendVerificationEmail,
  logIn,
  logOut,
  getCurrentUser,
  isAdmin,
  observeAuthChanges,
};

export default authService;
