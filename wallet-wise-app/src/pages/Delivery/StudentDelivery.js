import React, { useEffect, useState } from 'react';
import { db } from '../../utils/firebase';
import { doc, getDoc } from "firebase/firestore";
import { collection, query, getDocs, where } from 'firebase/firestore';
import { auth } from "../../utils/firebase";

function StudentDelivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");

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
        setIdNumber(docSnap.data().idNumber);
      } else {
        console.log("No such document!");
      }
    };

    fetchUserData();

    const fetchDeliveries = async () => {
      try {
        const deliveryCollectionRef = collection(db, 'delivery');
        const deliveryQuery = query(deliveryCollectionRef);

        const deliverySnapshot = await getDocs(deliveryQuery);
        const deliveryData = [];

        for (const doc of deliverySnapshot.docs) {
          const delivery = doc.data();
          const userId = delivery.userId;

          // Fetch user information based on userId
          const userQuery = query(collection(db, 'users'), where('userId', '==', userId));
          const userSnapshot = await getDocs(userQuery);
          if (!userSnapshot.empty) {
            const user = userSnapshot.docs[0].data();
            // Include user information in the delivery data
            delivery.userName = user.displayName;
            delivery.studentId = user.idNumber;
          }

          deliveryData.push(delivery);
        }

        setDeliveries(deliveryData);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    fetchDeliveries();
  }, []);

  return (
    <div>
      <h2>Delivery List</h2>
      <ul>
        {deliveries.map((delivery, index) => (
          <li key={index}>
            <strong>Delivery Date:</strong> {delivery.timestamp.toDate().toLocaleString()} <br />
            <strong>User Name:</strong> {fullName} <br />
            <strong>Student ID:</strong> {idNumber} <br />
            <strong>Item Name:</strong> {delivery.itemName} <br />
            <strong>Quantity:</strong> {delivery.quantity} <br />
            <strong>Total Price:</strong> ₱{delivery.totalPrice.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentDelivery;
