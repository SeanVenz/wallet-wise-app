import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
  Outlet, // Import Outlet
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import authService from "./service/auth";

import Landing from "./pages/Landing";
import Login from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Admin from "./pages/Admin";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import Vendor from "./pages/Vendor";
import Student from "./pages/Student/Student";
import StudentSidebar from "./pages/Student/StudentSidebar";
import StudentMarket from "./pages/Student/Market";
import StudentProfile from "./pages/Student/Profile";
import StudentDelivery from "./pages/Student/StudentDelivery";
import Dashboard from "./pages/Dashboard";
import VendorSidebar from "./pages/Vendor/VendorSidebar";

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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/signup"
          element={
            user && user.emailVerified ? <Navigate to="/login" /> : <SignUp />
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
          path="/dashboard"
          element={
            user && user.emailVerified ? (
              <Dashboard />
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
          path="/student/*"
          element={
            <div style={{ display: "flex" }}>
              <StudentSidebar />
              <Routes>
                <Route index={true} element={<Student />} />
                <Route path="market" element={<StudentMarket />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="delivery" element={<StudentDelivery />} />
              </Routes>
            </div>
          }
        />

        {/* <Route
          path="/vendor"
          element={
            user && user.emailVerified ? <Vendor /> : <Navigate to="/login" />
          }
        /> */}
        <Route
          path="/vendor"
          element={
            <div style={{ display: "flex" }}>
              {/* <VendorSidebar /> */}
              <Vendor />
            </div>
          }
        />
      </Routes>
      <Outlet />
    </Router>
  );
}

export default App;
