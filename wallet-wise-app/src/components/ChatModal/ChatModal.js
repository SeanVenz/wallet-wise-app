import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../../utils/firebase";

function ChatModal({ isOpen, onClose }) {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatRef, setChatRef] = useState(null);
  const [participants, setParticipants] = useState(null);
  const [recipient, setRecipient] = useState();
  const [currentUser, setSender] = useState();
  const [chatroom, setChatRoomId] = useState();
  const [ordererName, setOrdererName] = useState();
  const [courierName, setCourierName] = useState();

  const getChatRooms = async () => {
    const foodCollection = collection(db, "chatrooms");
    const foodSnapshot = await getDocs(foodCollection);
    return foodSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomData = await getChatRooms();
        console.log(roomData[0].sender);
        console.log(roomData[0].recipient);
        setSender(roomData[0].sender);
        setRecipient(roomData[0].recipient);
        setChatRoomId(roomData[0].id);
        setOrdererName(roomData[0].ordererName);
        setCourierName(roomData[0].courierName);
      } catch (error) {
        console.error("Error fetching all foods:", error);
      }
    };

    fetchRoomData();
  }, []);

  const getChatroomRef = () => {
    // Ensure both sender and recipient are defined before constructing the chatroom reference
    if (currentUser && recipient) {
      const chatroomID = [currentUser, recipient].sort().join("_");
      return doc(db, "chatrooms", chatroomID);
    }
    return null;
  };

  const getParticipants = async () => {
    try {
      const chatroomRef = getChatroomRef();

      if (chatroomRef) {
        const chatroomDoc = await doc(chatroomRef).get();

        if (chatroomDoc.exists()) {
          const data = chatroomDoc.data();
          const chatParticipants = [data.sender, data.recipient];
          setParticipants(chatParticipants);
        }
      }
    } catch (error) {
      console.error("Error fetching chat participants:", error);
    }
  };

  useEffect(() => {
    const fetchParticipants = async () => {
      await getParticipants();
    };

    fetchParticipants();

    if (recipient && currentUser && chatroom) {
      const chatroomRef = getChatroomRef();

      if (chatroomRef) {
        const chatMessagesRef = collection(chatroomRef, "messages");

        const unsubscribe = onSnapshot(
          query(chatMessagesRef, orderBy("timestamp")),
          (snapshot) => {
            const messagesData = snapshot.docs.map((doc) => doc.data());
            setChatMessages(messagesData);
          }
        );

        setChatRef(chatMessagesRef);

        return () => {
          unsubscribe();
        };
      }
    }
  }, [recipient, currentUser, chatroom]);

  const sendMessage = async () => {
    if (message && chatroom) {
      const newMessage = {
        sender: currentUser,
        text: message,
        timestamp: new Date(),
      };

      try {
        const chatroomRef = getChatroomRef();

        if (chatroomRef) {
          // Add the new message to the subcollection
          await addDoc(collection(chatroomRef, "messages"), newMessage);

          // Update the last message timestamp in the chatroom document
          await updateDoc(chatroomRef, {
            lastMessage: newMessage.text,
            lastMessageTimestamp: newMessage.timestamp,
          });

          setMessage("");
        }
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  const handleChatroomDelete = async () => {
    // Only allow the recipient to delete the chatroom
    if (participants && participants[1] === auth.currentUser.uid) {
      const chatroomRef = getChatroomRef();

      if (chatroomRef) {
        await deleteDoc(chatroomRef);
        onClose(); // Close the chat modal after deleting the chatroom
      }
    }
  };

  return (
    <div className={`chat-modal ${isOpen ? "open" : "closed"}`}>
      <div className="chat-header">
        {auth.currentUser.uid === recipient ? (
          <h3>Chat with {courierName}</h3>
        ) : (
          <h3>Chat with {ordererName}</h3>
        )}
        <button onClick={handleChatroomDelete}>Delete Chat</button>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="chat-messages">
        {chatMessages.map((message, index) => (
          <div key={index} className="message">
            <p>{message.text}</p>
            <span>{message.sender}</span>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatModal;
