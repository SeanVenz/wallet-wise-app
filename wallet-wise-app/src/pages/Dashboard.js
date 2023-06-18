import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase';

const Dashboard = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userDocRef);
  
      if (docSnap.exists()) {
        setFullName(docSnap.data().fullName);
        setIdNumber(docSnap.data().idNumber);
      } else {
        console.log("No such document!");
      }
    }
  
    fetchUserData();
  }, []);

  const handleLogOut = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <div>
      <h1>Dashboard Page</h1>
      <p>Full Name: {fullName}</p>
      <p>ID Number: {idNumber}</p>
      <button onClick={handleLogOut}>Log Out</button>
    </div>
  );
};

export default Dashboard;
