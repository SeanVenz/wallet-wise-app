import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../utils/auth";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";

import PotatoMagni from "images/potato-magnifying-glass.png";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogIn = async (e) => {
    e.preventDefault();
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
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex bg-gray-100 w-screen h-screen items-center lg:justify-between lg:px-20">
      <Image
        src={PotatoMagni}
        alt="Magnifying glass"
        className="w-[600px] h-[600px] hidden lg:block"
      />
      <div className="flex flex-col bg-[#F9F2E2] p-5 shadow-md rounded-lg border w-full h-full lg:h-[80%] lg:w-[60%]">
        <div className="lg:hidden flex w-full items-center justify-center">
          <Image
            src={PotatoMagni}
            alt="Magnifying glass"
            className="w-[150px] h-[150px] md:w-[300px] md:h-[300px] block lg:hidden"
          />
        </div>
        <div className="flex text-[30px] font-[junge]">Welcome to</div>
        <form
          onSubmit={handleLogIn}
          className="flex flex-col w-full h-full justify-start lg:justify-center"
        >
          <div className="w-full flex justify-center font-[julius-sans-one] text-[70px]">
            WALLET
          </div>
          <div className="w-full flex justify-center font-[monoton] text-[50px]">
            WISE
          </div>
          <div className="flex flex-col gap-5 mt-5">
            <div className="flex w-full justify-center">
              <input
                className="flex w-[70%] h-[50px] pl-2"
                type="email"
                placeholder="Enter Username or Email Adress"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex w-full justify-center">
              <input
                className="flex w-[70%] h-[50px] pl-2"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="login-error-message">{error && <p>{error}</p>}</div>

          <div className="w-full flex flex-col justify-center items-center">
            <button
              type="submit"
              className="bg-[#f9f2e2] text-black shadow-md rounded-lg border-[10px] border-black flex items-center w-auto px-10 text-[20px] transition-all duration-300 ease-in-out hover:bg-rose-300 mt-6 h-[50px] text-[source-code-pro] font-semibold"
            >
              LOGIN
            </button>
            <Link to="/forgot-password" className="">
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
