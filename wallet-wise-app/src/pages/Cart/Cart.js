import React, { useEffect, useState } from 'react';
import { db, auth } from '../../utils/firebase';
import { collection, query, getDocs, deleteDoc, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import Checkout from '../../components/Checkout/Checkout';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

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
      const user = auth.currentUser;
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

  // Function to update the quantity of an item in the cart and Firestore
  const updateItemQuantity = async (itemId, newQuantity) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;

        // Reference to the specific item in the cart
        const cartItemRef = doc(db, 'carts', userId, 'items', itemId);

        // Update the quantity in Firestore
        await updateDoc(cartItemRef, { quantity: newQuantity });

        // Fetch the updated cart items
        fetchCartItems(userId);
      } else {
        console.error('User is not authenticated.');
      }
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {

      if(auth.currentUser.displayName){
        setFullName(auth.currentUser.displayName);
      }

      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        fetchCartItems(userId);

        // Fetch user information from Firestore
        const userDocRef = doc(db, "users", userId);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setIdNumber(userData.idNumber || "");
          setPhoneNumber(userData.phoneNumber || "");
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            {item.name} - Quantity: {item.quantity}, Price: ₱{item.totalPrice.toFixed(2)}
            <button onClick={() => removeItemFromCart(item.id)}>Remove</button>
            <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</button>
            <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
          </li> 
        ))}
      </ul>
      <Checkout
        cartItems={cartItems}
        fullName={fullName}
        idNumber={idNumber}
        phoneNumber={phoneNumber}
      />
    </div>
  );
}

export default Cart;
