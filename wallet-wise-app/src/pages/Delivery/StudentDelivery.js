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

function StudentDelivery() {
  const [deliveries, setDeliveries] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [isChatOpen, setChatOpen] = useState(false);
  const [sender, setSender] = useState();
  const [recipient, setRecipient] = useState();
  const [ordererName, setOrdererName] = useState();

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
    setOrdererName(ordererName);
    
    //update not accepted order to accepted order
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { isOrderAccepted: true });

    const senderUID = auth.currentUser.uid;
    const courierName = auth.currentUser.displayName;
    const chatroomRef = getChatroomRef(senderUID, recipientId);

    // Create a chatroom document in Firestore if it doesn't exist
    await setDoc(chatroomRef, {
      sender: senderUID,
      recipient: recipientId,
      ordererName: ordererName,
      courierName: courierName,
    });
    fetchRoomData();
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
            {
              // this is the view of the orderer, mag agad if na accept naba iyang order or wala pa
            }
            {currentUser === delivery.userId ? (
              <>
                {delivery.isOrderAccepted ? (
                  <button onClick={() => openChat(delivery.userId)}>
                    Chat
                  </button>
                ) : (
                  <p>Order not yet accepted</p>
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
                  <button
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
                ) : null}
                {delivery.isOrderAccepted ? (
                //   <button onClick={() => openChat(delivery.userId)}>
                //   Chat
                // </button>
                  <>
                    {currentUser === sender ? (
                      <button onClick={() => openChat(delivery.userId)}>
                        Chat
                      </button>
                    ) : (
                      <p>Order is already accepted</p>
                    )}
                  </>
                ) : null}
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
