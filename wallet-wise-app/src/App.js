import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
  Outlet, // Import Outlet
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./utils/firebase";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/LogIn";
import SignUp from "./pages/SignUp/SignUp";
import Admin from "./pages/Admin/Admin";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Vendor from "./pages/Vendor/Vendor";
import Student from "./pages/Student/Student";
import StudentSidebar from "./pages/Student/StudentSidebar";
import StudentMarket from "./pages/Market/Market";
import StudentProfile from "./pages/Student/Profile";
import StudentDelivery from "./pages/Delivery/StudentDelivery";
import Dashboard from "./pages/Dashboard";
import VendorSidebar from "./pages/Vendor/VendorSidebar";
import Cart from "./pages/Cart/Cart";
import Spinner from "./components/Spinner/Spiner";

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <Spinner />;
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
            user && user.emailVerified ? <Navigate to="/student" /> : <Login />
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
            user && user.emailVerified ? <Admin /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/vendor/*"
          element={
            user && user.emailVerified ? (
              <div style={{ display: "flex" }}>
                <VendorSidebar />
                <Routes>
                  <Route index={true} element={<Vendor />} />
                </Routes>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/student/*"
          element={
            user && user.emailVerified ? (
              <div style={{ display: "flex" }}>
                <StudentSidebar />
                <Routes>
                  <Route index={true} element={<StudentMarket />} />
                  <Route path="market" element={<StudentMarket />} />
                  <Route path="profile" element={<StudentProfile />} />
                  <Route path="orders" element={<StudentDelivery />} />
                  <Route path="cart" element={<Cart />} />
                </Routes>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/404" element={<PageNotFound />} />
          	<Route path="*" element={<Navigate to="/404" />} />
      </Routes>
      <Outlet />
    </Router>
  );
}

function PageNotFound() {
  return (
    <div>
        <p>404 Page not found</p>
    </div>
  );
}

export default App;
