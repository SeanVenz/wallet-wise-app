import { useEffect, useState } from "react";
import { auth, db, storage } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
// import profile from "../../images/profile.png";

const StudentProfile = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newProfileImage, setNewProfileImage] = useState();

  const getProfilePicture = async (uid) => {
    const profile = await doc(db, "users", uid);
    const data = await getDoc(profile);
    return data.data().profileImageUrl;
  };

  const handleUpdateProfileImage = async (image) => {
    try {
      if (image) {
        // Create a Blob with the image data and set the correct MIME type
        const blob = new Blob([image], { type: image.type });

        const storageRef = ref(
          storage,
          `profileImages/${auth.currentUser.uid}`
        );

        // Upload the blob to Firebase Storage
        await uploadBytes(storageRef, blob);
        const imageUrl = await getDownloadURL(storageRef);

        // Update the user's profile with the new profile image URL
        await updateProfile(auth.currentUser, { photoURL: imageUrl });

        // Update the user document in Firestore with the new image URL
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userDocRef, { profileImageUrl: imageUrl });

        // Set the new profile image in the state
        setNewProfileImage(imageUrl);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      // Fetch full name from the user profile
      if (auth.currentUser.displayName) {
        setFullName(auth.currentUser.displayName);
      }

      // Fetch ID number from Firestore
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setPhoneNumber(docSnap.data().phoneNumber);
        setIdNumber(docSnap.data().idNumber);
      } else {
        console.log("No such document!");
      }

      // Fetch and set the profile picture
      const profilePicture = await getProfilePicture(auth.currentUser.uid);
      if (profilePicture) {
        setNewProfileImage(profilePicture);
      }
    };

    fetchUserData();
  }, []);

  const handleLogOut = async () => {
    await auth.signOut();
    navigate("/");
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    handleUpdateProfileImage(imageFile);
  };

  return (
    <div>
      <h1>Profile</h1>
      <img src={newProfileImage} alt="Profile" />
      <h3>Change Profile Picture</h3>
      <form>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </form>
      <p>Full Name: {fullName}</p>
      <p>ID Number: {idNumber}</p>
      <p>Phone Number: {phoneNumber}</p>
      <button onClick={handleLogOut}>Log Out</button>
    </div>
  );
};

export default StudentProfile;
