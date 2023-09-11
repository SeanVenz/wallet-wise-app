import React from 'react';
import { db } from '../../utils/firebase';
import { collection, addDoc, query, getDocs, deleteDoc, doc } from 'firebase/firestore'; // Import deleteDoc and doc
import authService from "../../utils/auth";

function Checkout({ cartItems }) {
  const handleCheckout = async () => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        const userId = user.uid;

        // Reference to the "Delivery" collection
        const deliveryCollectionRef = collection(db, 'delivery');

        // Iterate through the user's cart items and add them to the "Delivery" collection
        cartItems.forEach(async (item) => {
          await addDoc(deliveryCollectionRef, {
            userId: userId,
            itemName: item.name,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            timestamp: new Date(),
          });

          // Reference to the specific item in the user's cart
          const cartItemRef = doc(db, 'carts', userId, 'items', item.id);

          // Delete the item document from the user's cart
          await deleteDoc(cartItemRef);
        });

        console.log('Checkout completed.');
      } else {
        console.error('User is not authenticated.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
}

export default Checkout;
