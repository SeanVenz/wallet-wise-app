import React, { useEffect, useState } from 'react';
import { db, auth } from '../../utils/firebase';
import { collection, query, getDocs, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import Checkout from '../../components/Checkout/Checkout';
import { calculatePerPersonTotal } from 'utils/utils';
function Cart() {

  const [cartItems, setCartItems] = useState([]);
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [foodId, setFoodId] = useState([]);
  const [number, setNumber] = useState([]);
  const [quantity, setQuantity] = useState([]);

  const fetchCartItems = async (userId) => {
    try {
      const cartCollectionRef = collection(db, 'carts', userId, 'items');
      const cartQuery = query(cartCollectionRef);
      const cartSnapshot = await getDocs(cartQuery);
      const items = cartSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data()})); 

      const fetchedFoodIds = [];
      const fetchedNumbers = [];
      const fetchedQuantities = [];
  
      items.forEach((item) => {
        fetchedFoodIds.push(item.foodId);
        fetchedNumbers.push(item.number);
        fetchedQuantities.push(item.quantity);
      });
  
      setFoodId(fetchedFoodIds);
      setNumber(fetchedNumbers);
      setQuantity(fetchedQuantities);

      console.log(items);
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const removeItemFromCart = async (itemId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;

        const cartItemRef = doc(db, 'carts', userId, 'items', itemId);

        await deleteDoc(cartItemRef);

        fetchCartItems(userId);
      } else {
        console.error('User is not authenticated.');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const updateItemQuantity = async (itemId, newQuantity) => {
    try {
      if(newQuantity === 0){
        removeItemFromCart(itemId);
        return false;
      }
      const user = auth.currentUser;
      var unitPrice = 0;
      var newTotalPrice = 0;
      if (user) {
        const userId = user.uid;

        const cartItemRef = doc(db, 'carts', userId, 'items', itemId);

        const itemRefSnapshot = await getDoc(cartItemRef);

        if (itemRefSnapshot.exists()) {
          unitPrice = itemRefSnapshot.data().unitPrice;
          newTotalPrice = unitPrice * newQuantity;
        }

        await updateDoc(cartItemRef, { quantity: newQuantity, totalPrice: newTotalPrice });

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
    <div className='cart'>
      <h2>Your Cart</h2>
      <ul>
        {cartItems.map((item, index) => (
          <div>
          <li key={index}>
            <img src={item.img} alt={item.name} />
            {item.name} - Quantity: {item.quantity}, Total Price: ₱{item.totalPrice.toFixed(2)}
            <button onClick={() => removeItemFromCart(item.id)}>Remove</button>
            <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</button>
            <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
          </li> 
          </div>
        ))}
      </ul>
      <h3>Total: {calculatePerPersonTotal(cartItems).toFixed(2)}</h3>
      <Checkout
        cartItems={cartItems}
        fullName={fullName}
        idNumber={idNumber}
        phoneNumber={phoneNumber}
        foodId = {foodId}
        number = {number}
        quantity = {quantity}
      />
    </div>
  );
}

export default Cart;
