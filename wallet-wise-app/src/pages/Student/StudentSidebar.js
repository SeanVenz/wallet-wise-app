import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Logo from "../../images/logo.png";

const StudentSidebar = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "250px",
        background: "#f8b4b4",
        padding: "20px",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <img
        src={Logo}
        width={100}
        height={100}
        alt="logo"
        style={{ height: "200px", width: "200px" }}
      />
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <NavLink
            to="/student/market"
            activeStyle={{ fontWeight: "bold" }}
            style={{ textDecoration: "none", color: "black" }}
          >
            Market
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/student/delivery"
            activeStyle={{ fontWeight: "bold" }}
            style={{ textDecoration: "none", color: "black" }}
          >
            Delivery
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/student/profile"
            activeStyle={{ fontWeight: "bold" }}
            style={{ textDecoration: "none", color: "black" }}
          >
            Profile
          </NavLink>
        </li>
      </ul>
      <Outlet />
    </div>
  );
};

export default StudentSidebar;
