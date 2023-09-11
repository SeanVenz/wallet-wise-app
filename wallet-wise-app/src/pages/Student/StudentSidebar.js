import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Logo from "../../images/logo.png";

import "./index.css";

const StudentSidebar = () => {
  return (
    <div
      style={{
        top: 0,
        left: 0,
        height: "100vh",
        width: "300px",
        background: "#f8b4b4",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        zIndex: "1",
        paddingLeft: "20px",
      }}
    >
      <img
        src={Logo}
        width={100}
        height={100}
        alt="logo"
        style={{ height: "200px", width: "200px" }}
      />
      <ul className="student-side-ul">
        <li className="student-side-li">
          <NavLink
            to="/student/market"
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
            <div className="student-side-category">Market</div>
          </NavLink>
        </li>
        <li className="student-side-li">
          <NavLink
            to="/student/orders"
            activeStyle={{
              fontWeight: "bold",
              backgroundColor: "white", // Background color on click
              color: "black", // Text color on click
            }}
            style={{ textDecoration: "none", color: "black", width: "100%" }}
          >
            <div className="student-side-category">Orders</div>
          </NavLink>
        </li>
        <li className="student-side-li">
          <NavLink
            to="/student/profile"
            activeStyle={{
              fontWeight: "bold",
              backgroundColor: "white", // Background color on click
              color: "black", // Text color on click
            }}
            style={{ textDecoration: "none", color: "black", width: "100%" }}
          >
            <div className="student-side-category">Profile</div>
          </NavLink>
        </li>
        <li className="student-side-li">
          <NavLink
            to="/student/cart"
            activeStyle={{
              fontWeight: "bold",
              backgroundColor: "white", // Background color on click
              color: "black", // Text color on click
            }}
            style={{ textDecoration: "none", color: "black", width: "100%" }}
          >
            <div className="student-side-category">Cart</div>
          </NavLink>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};

export default StudentSidebar;
