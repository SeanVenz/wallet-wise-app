import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAllFoods } from "../service/FoodService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      // Fetch full name from the user profile
      if (auth.currentUser.displayName) {
        setFullName(auth.currentUser.displayName);
      }

      // Fetch ID number from Firestore
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setIdNumber(docSnap.data().idNumber);
      } else {
        console.log("No such document!");
      }
    };

    fetchUserData();

    // Fetch all foods from the API
    const fetchFoods = async () => {
      try {
        const foodsData = await getAllFoods();
        setFoods(foodsData);
        console.log(foodsData);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods();
  }, []);

  const handleLogOut = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div>
      <h1>Dashboard Page</h1>
      <p>Full Name: {fullName}</p>
      <p>ID Number: {idNumber}</p>
      <button onClick={handleLogOut}>Log Out</button>
      <h2>Available Foods:</h2>
      {foods.map((food, index) => (
        <div>
          <h3>Food Type: {food.foodType}</h3>
          <p>Food Name: {food.name}</p>
          <p>
            Availability: {food.isAvailable ? "Available" : "Not Available"}
          </p>
          <p>Price: {food.price}</p>
          <p>Price: {food.price}</p>
          <img src={food.imageUrl} alt= {food.name}></img>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
