import { useEffect, useState } from "react";
import { auth, db, storage } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import profile from "../../images/profile.png";
import "./Profile.scss";

const StudentProfile = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newProfileImage, setNewProfileImage] = useState(profile);
  const [deliveries, setDeliveries] = useState([]);
  const [orders, setOrders] = useState([]);

  const getProfilePicture = async (uid) => {
    const profile = await doc(db, "users", uid);
    const data = await getDoc(profile);
    return data.data().profileImageUrl;
  };

  useEffect(() => {
    // Define a function to fetch deliveries from Firestore and update state
    const fetchDeliveries = async () => {
      try {
        const userCollectionRef = collection(
          db,
          "users",
          auth.currentUser.uid,
          "deliveries"
        );
        const querySnapshot = await getDocs(userCollectionRef);

        // Extract the data from the query snapshot and store it in an array
        const deliveryData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Update the state with the delivery data
        setDeliveries(deliveryData);

        const orderCollectionRef = collection(
          db,
          "users",
          auth.currentUser.uid,
          "orders"
        );
        const orderSnapshot = await getDocs(orderCollectionRef);

        // Extract the data from the query snapshot and store it in an array
        const orderData = orderSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Update the state with the delivery data
        setOrders(orderData);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      }
    };

    // Call the fetchDeliveries function to fetch and update the state
    fetchDeliveries();
  }, []);

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

  const handleButtonClick = () => {
    // Trigger file input click when the button is clicked
    const fileInput = document.getElementById("profileImageInput");
    fileInput.click();
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
    <div className="profile">
      <div className="logout-button">
        <button onClick={handleLogOut}>Log Out</button>
      </div>
      <div className="details">
        <form>
          <div className="pp-img">
            <img src={newProfileImage} alt="Profile" />
          </div>
          <input
            id="profileImageInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <button type="button" onClick={handleButtonClick}>
            Choose Profile Picture
          </button>
        </form>
        <div className="info">
          <p> {fullName}</p>
          <p> {idNumber}</p>
          <p> {phoneNumber}</p>
        </div>
      </div>
      <div className="orders-container">
      {deliveries.length > 0 && (
        <>
          <div className="accepted-orders">
            <h3>Accepted Orders:</h3>
            {deliveries.map((food, index) => (
              <ul>
                <div className="list">
                  <li class="order" key={index}>
                    <button>Order#{food.OrderId}</button>
                  </li>
                </div>
              </ul>
            ))}
          </div>
        </>
      )}

      {orders.length > 0 && (
        <>
          <div className="my-orders">
            <h3>My Orders:</h3>
            {orders.map((food, index) => (
              <ul>
                <div className="list">
                <li class="order" key={index}>
                  <button>Order#{food.OrderId}</button>
                </li>
                </div>
              </ul>
            ))}
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default StudentProfile;
