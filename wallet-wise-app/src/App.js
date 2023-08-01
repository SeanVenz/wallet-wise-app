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
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import Vendor from "./pages/Vendor";
import Student from "./pages/Student/Student";
import StudentSidebar from "./pages/Student/StudentSidebar";
import StudentMarket from "./pages/Student/Market";
import StudentProfile from "./pages/Student/Profile";
import StudentDelivery from "./pages/Student/StudentDelivery";

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
          path="/admin"
          element={
            user && user.emailVerified && authService.isAdmin(user) ? (
              <Admin />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/student">
          <Route
            index={true}
            element={
              <>
                <StudentSidebar />
                <Student />
              </>
            }
          />
          <Route
            path="market"
            element={
              <>
                <StudentSidebar />
                <StudentMarket />
              </>
            }
          />
          <Route
            path="profile"
            element={
              <>
                <StudentSidebar />
                <StudentProfile />
              </>
            }
          />
          <Route
            path="delivery"
            element={
              <>
                <StudentSidebar />
                <StudentDelivery />
              </>
            }
          />
        </Route>
        <Route
          path="/vendor"
          element={
            user && user.emailVerified ? <Vendor /> : <Navigate to="/login" />
          }
        />
      </Routes>
      <Outlet />
    </Router>
  );
}

export default App;
