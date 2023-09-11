import React, { useEffect, useState } from 'react';
import { db } from '../../utils/firebase';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Import deleteDoc and doc
import authService from "../../utils/auth";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  
  // Function to fetch cart items based on the user's UID
  const fetchCartItems = async (userId) => {
    try {
      const cartCollectionRef = collection(db, 'carts', userId, 'items');
      const cartQuery = query(cartCollectionRef);
      const cartSnapshot = await getDocs(cartQuery);
      const items = cartSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Include document ID
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  // Function to remove an item from the cart
  const removeItemFromCart = async (itemId) => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        const userId = user.uid;

        // Reference to the specific item in the cart
        const cartItemRef = doc(db, 'carts', userId, 'items', itemId);

        // Delete the item document
        await deleteDoc(cartItemRef);

        // Fetch the updated cart items
        fetchCartItems(userId);
      } else {
        console.error('User is not authenticated.');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
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
            <button onClick={() => removeItemFromCart(item.id)}>Remove</button> {/* Add a "Remove" button */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Cart;
