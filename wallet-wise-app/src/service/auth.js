import { auth } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged } from 'firebase/auth';

const signUp = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  console.log('Signed up user:', userCredential.user);  // Log the user object
  return userCredential.user;
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
