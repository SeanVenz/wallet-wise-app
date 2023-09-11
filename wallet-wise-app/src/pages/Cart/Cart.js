import React, { useEffect, useState } from 'react';
import { db } from '../../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import authService from "../../service/auth";


function Cart() {
  const [cartItems, setCartItems] = useState([]);
  
  // Function to fetch cart items based on the user's UID
  const fetchCartItems = async (userId) => {
    try {
      const cartCollectionRef = collection(db, 'carts', userId, 'items');
      const cartQuery = query(cartCollectionRef);
      const cartSnapshot = await getDocs(cartQuery);
      const items = cartSnapshot.docs.map((doc) => doc.data());
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      const userId = user.uid;
      fetchCartItems(userId);
    }
  }, []);

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            {item.name} - Quantity: {item.quantity}, Price: ₱{item.totalPrice.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Cart;
