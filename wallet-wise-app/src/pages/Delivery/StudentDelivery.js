// StudentDelivery.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import ChatModal from "../../components/ChatModal/ChatModal";

function StudentDelivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [isChatOpen, setChatOpen] = useState(false);
  const [chatroomId, setChatroomId] = useState();
  const [chatroomRecipient, setChatroomRecipient] = useState("");
  const [isOrderAccepted, setOrderAccepted] = useState(false);

  const openChat = async (recipientUID) => {
    setChatroomRecipient(recipientUID);
    setChatOpen(true);
  };

  const getChatroomRef = (senderUID, recipientUID) => {
    const chatroomID = [senderUID, recipientUID].sort().join("_");
    return doc(db, "chatrooms", chatroomID);
  };

  const handleOrderAccepted = async (orderId, recipientUID) => {
    const senderUID = auth.currentUser.uid;
    const chatroomRef = getChatroomRef(senderUID, recipientUID);

    // Create a chatroom document in Firestore if it doesn't exist
    await setDoc(chatroomRef, {
      sender: senderUID,
      recipient: recipientUID,
    });

    // Create a subcollection for messages within the chatroom (if it doesn't exist)
    const messagesCollectionRef = collection(chatroomRef, "messages");

    // Handle the "Accept Order" button click
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { isOrderAccepted: true });

    setChatroomId(chatroomRef.id); // Update chatroomId with the chatroom ID
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser.uid;
      setCurrentUser(currentUser);
    };

    fetchUserData();

    const deliveryCollectionRef = collection(db, "orders");

    const unsubscribe = onSnapshot(deliveryCollectionRef, (snapshot) => {
      const deliveryData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDeliveries(deliveryData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function calculatePerPersonTotal(items) {
    let total = 0;
    items.forEach((item) => {
      total += item.totalPrice;
    });
    return total;
  }

  return (
    <div>
      <h2>Order List</h2>
      <ul>
        {deliveries.map((delivery) => (
          <li key={delivery.id}>
            <div>
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
              <p>
                Total: ₱{calculatePerPersonTotal(delivery.items).toFixed(2)}
              </p>
              {currentUser === delivery.userId ? (
                <>
                  {delivery.isOrderAccepted ? (
                    <button onClick={() => openChat(delivery.userId)}>Chat</button>
                  ) : (
                    <p>Order not yet accepted</p>
                  )}
                </>
              ) : (
                <>
                  {!delivery.isOrderAccepted ? (
                    <button onClick={() => handleOrderAccepted(delivery.id, delivery.userId)}>
                      Accept Order
                    </button>
                  ) : null}
                  {delivery.isOrderAccepted ? (
                    <button onClick={() => openChat(delivery.userId)}>Chat</button>
                  ) : null}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      {isChatOpen && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setChatOpen(false)}
          recipient={chatroomRecipient}
          currentUser={currentUser}
          chatroom={chatroomId}
        />
      )}
    </div>
  );
}

export default StudentDelivery;
