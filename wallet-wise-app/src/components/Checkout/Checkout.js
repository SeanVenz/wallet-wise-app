import React, { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase";
import {
  collection,
  addDoc,
  query,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import authService from "../../utils/auth";

function Checkout({
  cartItems,
  fullName,
  idNumber,
  phoneNumber,
  foodId,
  number,
  quantity,
}) {
  const [showModal, setShowModal] = useState(false);
  const [hasOrder, setHasOrder] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const updateFoodQuantity = async () => {
    try {
      // Iterate through the arrays of foodId, number, and quantity
      for (let i = 0; i < foodId.length; i++) {
        const food = foodId[i];
        const itemNumber = number[i];
        const itemQuantity = quantity[i];

        const foodItemRef = doc(db, "food", food);
        const newQuantity = itemNumber - itemQuantity;

        const foodRefSnapshot = await getDoc(foodItemRef);

        if (foodRefSnapshot.exists()) {
          // Update the quantity in Firestore
          await updateDoc(foodItemRef, {
            Quantity: newQuantity,
          });
        }
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const deleteCartItems = async (userId) => {
    try {
      const cartItemsCollectionRef = collection(db, "carts", userId, "items");
      const cartItemsQuery = query(cartItemsCollectionRef);
      const cartItemsSnapshot = await getDocs(cartItemsQuery);

      // Delete each cart item
      cartItemsSnapshot.forEach(async (itemDoc) => {
        const itemId = itemDoc.id;
        const cartItemRef = doc(db, "carts", userId, "items", itemId);
        await deleteDoc(cartItemRef);
      });
    } catch (error) {
      console.error("Error deleting cart items:", error);
    }
  };

  const addHasCurrentOrder = async (uid) => {
    try {
      const userInfoRef = doc(db, "users", uid); // Get a reference to the document
      await updateDoc(userInfoRef, {
        hasPendingOrder: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const checkHasCurrentOrder = async (uid) => {
    try {
      const userInfoRef = doc(db, "users", uid); // Get a reference to the document
      const userInfoSnapshot = await getDoc(userInfoRef);
      return userInfoSnapshot.data().hasPendingOrder === true;
    } catch (error) {
      console.error("Error checking current order:", error);
      return false;
    }
  };

  const handleCheckout = async () => {
    try {
      const user = authService.getCurrentUser();
      const hasCurrentOrder = await checkHasCurrentOrder(user.uid);
      setHasOrder(hasCurrentOrder); // Update the state with the result

      if (user && !hasCurrentOrder) {
        const userId = user.uid;

        const deliveryCollectionRef = collection(db, "orders");

        const itemsToCheckout = cartItems.map((item) => ({
          itemName: item.name,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          storeName: item.storeName,
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

        addHasCurrentOrder(userId);

        updateFoodQuantity();

        // Delete cart items
        deleteCartItems(userId);

        // Close the modal
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error during checkout:", error);
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
            {hasOrder === true ? (
              <p>Finish your current order first</p>
            ) : null}
            <button onClick={handleCheckout}>Confirm</button>
            <button onClick={handleCloseModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
