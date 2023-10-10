import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Logo from "../../images/logo.png";
import { BsList } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";

import "./index.css";

const StudentSidebar = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  return (
    <>
      <div
        style={{
          top: 0,
          left: 0,
          height: "100vh",
          width: "300px",
          background: "#f8b4b4",
          alignItems: "center",
          flexDirection: "column",
          position: "sticky",
          zIndex: "1",
          paddingLeft: "20px",
          fontSize: "3rem",
        }}
        className="lg:flex hidden"
      >
        <img
          src={Logo}
          width={100}
          height={100}
          alt="logo"
          className="h-[150px] w-[150px] "
        />
        <ul className="student-side-ul gap-10">
          <li>
            <div
              onClick={() => navigate("/student/market")}
              activeStyle={{
                fontWeight: "bold",
                backgroundColor: "white", // Background color on click
                color: "black", // Text color on click
              }}
              style={{
                textDecoration: "none",
                color: "black",
                width: "100%",
              }}
            >
              <div className="student-side-category font-semibold">Market</div>
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate("/student/orders")}
              activeStyle={{
                fontWeight: "bold",
                backgroundColor: "white", // Background color on click
                color: "black", // Text color on click
              }}
              style={{ textDecoration: "none", color: "black", width: "100%" }}
            >
              <div className="student-side-category font-semibold">Orders</div>
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate("/student/profile")}
              activeStyle={{
                fontWeight: "bold",
                backgroundColor: "white", // Background color on click
                color: "black", // Text color on click
              }}
              style={{ textDecoration: "none", color: "black", width: "100%" }}
            >
              <div className="student-side-category font-semibold">Profile</div>
            </div>
          </li>
          <li>
            <div
              onClick={() => navigate("/student/cart")}
              activeStyle={{
                fontWeight: "bold",
                backgroundColor: "white", // Background color on click
                color: "black", // Text color on click
              }}
              style={{ textDecoration: "none", color: "black", width: "100%" }}
            >
              <div className="student-side-category font-semibold">Cart</div>
            </div>
          </li>
        </ul>
        <Outlet />
      </div>

      {/* MOBILE */}
      <div className="lg:hidden absolute p-5 mt-4 bg-transparent h-10 bg-red-500">
        <button
          className="flex bg-bue-500 text-[30px]"
          onClick={() => setIsVisible(true)}
        >
          <BsList />
        </button>
      </div>
      {isVisible && (
        <div className="student-fadeIn bg-blue-400 left-0 absolute h-full z-[100]">
          This div will fade in.
          <button onClick={() => setIsVisible(false)}>
            <AiOutlineClose />
          </button>
        </div>
      )}
    </>
  );
};

export default StudentSidebar;
