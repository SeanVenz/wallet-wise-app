import React, { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase"; // Import your Firebase configuration
import { collection, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import ChatModal from "../../components/ChatModal/ChatModal";

function StudentDelivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [chatroomId, setChatroomId] = useState();
  const [isChatOpen, setChatOpen] = useState(false);
  const [chatroomRecipient, setChatroomRecipient] = useState("");
  const [ordererName, setOrdererName] = useState();

  const openChat = async (recipientUID) => {
    setChatroomRecipient(recipientUID);
    setChatOpen(true);
  };

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

  const getChatRooms = async () => {
    const foodCollection = collection(db, "chatrooms");
    const foodSnapshot = await getDocs(foodCollection);
    return foodSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  };

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const roomData = await getChatRooms();
        console.log(roomData[0].sender);
        console.log(roomData[0].recipient);
        setChatroomRecipient(roomData[0].recipient)
        setChatroomId(roomData[0].id);
      } catch (error) {
        console.error("Error fetching all foods:", error);
      }
    };

    fetchChatRooms();
  }, []);

  const getChatroomRef = (senderUID, recipientUID) => {
    const chatRoomID = [senderUID, recipientUID].sort().join("_");
    return doc(db, "chatrooms", chatRoomID);
  };

  const handleOrderAccepted = async (orderId, recipientId, ordererName) => {

    setOrdererName(ordererName)

    const senderUID = auth.currentUser.uid;
    const courierName = auth.currentUser.displayName;
    const chatroomRef = getChatroomRef(senderUID, recipientId);

    // Create a chatroom document in Firestore if it doesn't exist 
    await setDoc(chatroomRef, {
      sender: senderUID,
      recipient: recipientId,
      ordererName: ordererName,
      courierName: courierName
    });

    //update not accepted order to accepted order
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { isOrderAccepted: true });
  }

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
            {currentUser === delivery.userId ? (
              <p>
                Your Order is <strong>not</strong> yet accepted
              </p>
            ) : (
              <button onClick={() => handleOrderAccepted(delivery.id, delivery.userId, delivery.userName)}>Accept Order</button>
            )}
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
                    <button onClick={() => handleOrderAccepted(delivery.id, delivery.userId, delivery.userName)}>
                      Accept Order
                    </button>
                  ) : null}
                  {delivery.isOrderAccepted ? (
                    <button onClick={() => openChat(delivery.userId)}>Chat</button>
                  ) : null}
                </>
              )}
          </li>
        ))}
      </ul>
      {isChatOpen && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}

export default StudentDelivery;
