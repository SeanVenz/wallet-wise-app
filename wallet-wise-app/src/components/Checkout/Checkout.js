import React, { useState } from 'react';
import { db } from '../../utils/firebase';
import { collection, addDoc, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import authService from '../../utils/auth';

function Checkout({ cartItems, fullName, idNumber, phoneNumber }) {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const deleteCartItems = async (userId) => {
    try {
      const cartItemsCollectionRef = collection(db, 'carts', userId, 'items');
      const cartItemsQuery = query(cartItemsCollectionRef);
      const cartItemsSnapshot = await getDocs(cartItemsQuery);

      // Delete each cart item
      cartItemsSnapshot.forEach(async (itemDoc) => {
        const itemId = itemDoc.id;
        const cartItemRef = doc(db, 'carts', userId, 'items', itemId);
        await deleteDoc(cartItemRef);
      });
    } catch (error) {
      console.error('Error deleting cart items:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        const userId = user.uid;

        const deliveryCollectionRef = collection(db, 'orders');

        const itemsToCheckout = cartItems.map((item) => ({
          itemName: item.name,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        }));

        // Create a delivery document with user information and items
        await addDoc(deliveryCollectionRef, {
          userId: userId,
          userName: fullName,
          idNumber: idNumber,
          phoneNumber: phoneNumber,
          items: itemsToCheckout,
          timestamp: Date.now(),
        });

        // Delete cart items
        deleteCartItems(userId);

        // Close the modal
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <button onClick={handleOpenModal}>Checkout</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Checkout</h2>
            <button onClick={handleCheckout}>Confirm</button>
            <button onClick={handleCloseModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;