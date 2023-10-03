import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../utils/auth";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../Login/LogIn.css";

import PotatoMagni from "images/potato-magnifying-glass.png";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogIn = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await authService.logIn(email, password);
      const user = authService.getCurrentUser();

      if (!user.emailVerified) {
        setError("Please verify your email first.");
        authService.logOut();
      } else {
        // Retrieve the user's role from Firestore
        const role = await authService.getUserRoleFromFirestore(user.uid);

        role === "vendor" ? navigate("/vendor") : navigate("/student");
      }
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message);
    }
  };

  return (
    <div className="flex bg-gray-100 w-screen h-screen items-center lg:justify-between lg:px-20">
      <Image
        src={PotatoMagni}
        alt="Magnifying glass"
        className="w-[500px] h-[500px] hidden lg:block"
      />
      <div className="login-form flex flex-col bg-[#F9F2E2] p-5 shadow-md rounded-lg border w-full h-full lg:h-[90%] lg:w-[60%]">
        <div className="lg:hidden flex w-full items-center justify-center">
          <Image
            src={PotatoMagni}
            alt="Magnifying glass"
            className="w-[150px] h-[150px] md:w-[300px] md:h-[300px] block lg:hidden"
          />
        </div>

        <form
          onSubmit={handleLogIn}
          className="flex flex-col w-full h-full justify-start lg:justify-center"
        >
          <div className="text-box1 flex lg:ml-[18%]">Welcome to</div>
          <div className="text-box2 flex justify-center w-full item-center -mt-7 font-bold">
            WALLET
          </div>
          <div className="text-box3 w-full flex justify-center -mt-10">
            WISE
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex w-full justify-center">
              <input
                className="login-email flex w-[70%] h-[50px] pl-2"
                type="email"
                placeholder="Enter Username or Email Adress"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex w-full justify-center">
              <input
                className="login-password flex w-[70%] h-[50px] pl-2"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex w-full justify-center text-red-600">
            {error && <p>{error}</p>}
          </div>

          <div className="w-full flex flex-col justify-center items-center">
            <button
              type="login-submit"
              className="bg-[#f9f2e2] text-black shadow-md rounded-lg border-[10px] border-black flex items-center w-auto px-10 text-[20px] transition-all duration-300 ease-in-out hover:bg-rose-300 mt-6 h-[50px] text-[source-code-pro] font-semibold"
            >
              LOGIN
            </button>
            <div className="flex w-full items-center justify-start -ml-[180px]">
              <Link to="/forgot-password" className="login-forgot-password">
                Forgot password?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
