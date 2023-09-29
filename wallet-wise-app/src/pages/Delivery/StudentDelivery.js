import React, { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase"; // Import your Firebase configuration
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import ChatModal from "../../components/ChatModal/ChatModal";
import authService from "../../utils/auth";
import "./Delivery.scss";

function StudentDelivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [isChatOpen, setChatOpen] = useState(false);
  const [sender, setSender] = useState();
  const [recipient, setRecipient] = useState();
  const [ordererName, setOrdererName] = useState();
  const [hasCurrentDelivery, setHasCurrentDelivery] = useState(false);
  const [hasCurrentOrder, setHasCurrentOrder] = useState(false);

  const openChat = async () => {
    setChatOpen(true);
  };

  useEffect(() => {
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

  const addHasCurrentDelivery = async (uid) => {
    try {
      const userInfoRef = doc(db, "users", uid);
      await updateDoc(userInfoRef, {
        hasPendingDelivery: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const checkHasCurrentDelivery = async (uid) => {
    try {
      const userInfoRef = doc(db, "users", uid);
      const userInfoSnapshot = await getDoc(userInfoRef);
      return userInfoSnapshot.data().hasPendingDelivery === true;
    } catch (error) {
      console.log(error);
    }
  };

  const getChatRooms = async () => {
    const chatCollection = collection(db, "chatrooms");
    const chatSnapshot = await getDocs(chatCollection);
    return chatSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  };

  //when handlebutton clicked
  const fetchRoomData = async () => {
    try {
      const user = auth.currentUser.uid;
      setCurrentUser(user);
      const roomData = await getChatRooms();
      for (var i = 0; i < roomData.length; i++) {
        if (user === roomData[i].recipient || user === roomData[i].sender) {
          setSender(roomData[i].sender);
          setRecipient(roomData[i].recipient);
        }
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  //check if their convo is already existing
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const user = auth.currentUser.uid;
        setCurrentUser(user);
        const roomData = await getChatRooms();
        for (var i = 0; i < roomData.length; i++) {
          if (user === roomData[i].recipient || user === roomData[i].sender) {
            setSender(roomData[i].sender);
            setRecipient(roomData[i].recipient);
          }
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRoomData();
  }, []);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const roomData = await getChatRooms();
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
    try {
      const user = authService.getCurrentUser();
      const hasCurrentDelivery = await checkHasCurrentDelivery(user.uid);
      const hasCurrentOrder = await checkHasCurrentOrder(user.uid);
      setHasCurrentDelivery(hasCurrentDelivery);
      setHasCurrentOrder(hasCurrentOrder);

      if (!hasCurrentDelivery && !hasCurrentOrder) {
        setOrdererName(ordererName);

        //update not accepted order to accepted order
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { isOrderAccepted: true });

        const senderUID = auth.currentUser.uid;
        const courierName = auth.currentUser.displayName;
        const chatroomRef = getChatroomRef(senderUID, recipientId);

        addHasCurrentDelivery(senderUID);

        // Create a chatroom document in Firestore if it doesn't exist
        await setDoc(chatroomRef, {
          sender: senderUID,
          recipient: recipientId,
          ordererName: ordererName,
          courierName: courierName,
          orderId: orderId,
        });
        fetchRoomData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  function calculatePerPersonTotal(items) {
    let total = 0;
    items.forEach((item) => {
      total += item.totalPrice;
    });
    console.log(deliveries[0]);
    return total;
  }

  return (
    <div className="orders-student-delivery">
      <h2 className="orders-header">Orders</h2>
      <ul className="order-parent">
        {deliveries.map((delivery) => (
          <li key={delivery.id} className="order-card">
            <h3 className="text"> {delivery.userName}</h3>
            <p className="text">ID Number: {delivery.idNumber}</p>
            <p className="text">Phone Number: {delivery.phoneNumber}</p>
            <h4>Order Summary:</h4>
            <ul className="scrollable-list">
              {delivery.items.map((item, index) => (
                <li key={index} className="order-list">
                  {item.itemName} - x{item.quantity} ₱
                  {item.totalPrice.toFixed(2)}
                  <p>Store: {item.storeName}</p>
                </li>
              ))}
            </ul>
            <p className="total">
              Total: ₱{calculatePerPersonTotal(delivery.items).toFixed(2)}
            </p>
            {
              // this is the view of the orderer, mag agad if na accept naba iyang order or wala pa
            }
            {currentUser === delivery.userId ? (
              <>
                {delivery.isOrderAccepted ? (
                  <>
                    <div className="chat-container">
                      <button
                        className="chat"
                        onClick={() => openChat(delivery.userId)}
                      >
                        Chat
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="order-not-accepted">Order not yet accepted</p>
                )}
              </>
            ) : (
              <>
                {
                  // mao ni ang view sa mga tao na pwede maka deliver (d ka ka deliver sa imo own order)
                  // if wala na accept, accept order na button imo makita
                  // if na accept, mag agad pa if ang user kay ang nag click sa accept order or di
                  // if ang user nag click sa accept order iya makita kay chat
                  // if dili kay order accepted ra
                }
                {!delivery.isOrderAccepted ? (
                  hasCurrentDelivery || hasCurrentOrder ? (
                    <p className="order-not-accepted">
                      Finish your current transaction first
                    </p>
                  ) : (
                    <>
                      <div className="accept-order-parent">
                        <button
                          className="accept-order"
                          onClick={() =>
                            handleOrderAccepted(
                              delivery.id,
                              delivery.userId,
                              delivery.userName
                            )
                          }
                        >
                          Accept Order
                        </button>
                      </div>
                    </>
                  )
                ) : (
                  <>
                    {currentUser === sender ? (
                      <>
                        <div className="chat-container">
                          <button
                            className="chat"
                            onClick={() => openChat(delivery.userId)}
                          >
                            Chat
                          </button>
                        </div>
                      </>
                    ) : (
                      <p>Order is already accepted</p>
                    )}
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
      {isChatOpen && (
        <ChatModal isOpen={isChatOpen} onClose={() => setChatOpen(false)} />
      )}
    </div>
  );
}

export default StudentDelivery;
