import React from "react";
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <div>
      <h1>Dashboard Page</h1>
      <button onClick={handleLogOut}>Log Out</button>
    </div>
  );
};

export default Dashboard;
