import React, { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase"; // Import your Firebase configuration
import { collection, onSnapshot } from "firebase/firestore";

function StudentDelivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {

    const fetchUserData = async () => {

      const currentUser = auth.currentUser.uid;
      setCurrentUser(currentUser);
    };

    fetchUserData();

    // Reference to the "deliveries" collection
    const deliveryCollectionRef = collection(db, "orders");

    // Query the collection and listen for changes
    const unsubscribe = onSnapshot(deliveryCollectionRef, (snapshot) => {
      const deliveryData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDeliveries(deliveryData);
    });

    return () => {
      // Unsubscribe from the Firestore listener when the component unmounts 
      unsubscribe();
    };
  }, []);

  function calculatePerPersonTotal(items) {
    let total = 0;
    items.forEach((item) => {
      total += item.totalPrice;
    });
    console.log(deliveries[0]);
    return total;
  }

  return (
    <div>
      <h2>Order List</h2>
      <ul>
        {deliveries.map((delivery) => (
          <li key={delivery.id}>
            <h3>Student Name: {delivery.userName}</h3>
            <p>ID Number: {delivery.idNumber}</p>
            <p>Phone Number: {delivery.phoneNumber}</p>
            <h4>Orders:</h4>
            <ul>
              {delivery.items.map((item, index) => (
                <li key={index}>
                  {item.itemName} - Quantity: {item.quantity}, Total Price: ₱
                  {item.totalPrice.toFixed(2)}
                  <p>Store Name: {item.storeName}</p>
                </li>
              ))}
            </ul>
            <p>Total: ₱{calculatePerPersonTotal(delivery.items).toFixed(2)}</p>
            {currentUser === delivery.userId ? "" : <button>Accept Order</button> }
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentDelivery;
