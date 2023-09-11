// useUser.js
import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export default function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        const userId = authUser.uid;
        // Fetch user information from Firestore and set it in the state
        const userDocRef = doc(db, "users", userId);
        getDoc(userDocRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              setUser({
                uid: userId,
                displayName: authUser.displayName,
                idNumber: docSnapshot.data().idNumber,
              });
            }
          })
          .catch((error) => {
            console.error("Error fetching user information:", error);
          });
      } else {
        // User is not authenticated
        setUser(null);
      }
    });

    // Unsubscribe from the Firebase auth observer when the component unmounts
    return () => unsubscribe();
  }, []);

  return user;
}
