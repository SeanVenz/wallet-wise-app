import { Routes, Route, BrowserRouter as Router, Navigate } from "react-router-dom"; // Rename BrowserRouter to Router
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import authService from "./service/auth";

import Landing from "./pages/Landing";
import Login from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            user && user.emailVerified ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/signup"
          element={
            user && user.emailVerified ? (
              <Navigate to="/login" />
            ) : (
              <SignUp />
            )
          }
        />
        <Route
          path="/verify-email"
          element={
            user && !user.emailVerified ? (
              <VerifyEmail />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin"
          element={
            user && user.emailVerified && authService.isAdmin(user) ? (
              <Admin />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            user && user.emailVerified ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
