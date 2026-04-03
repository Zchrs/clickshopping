/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Navigate, Outlet } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";



export const PrivateRoute = ({ children }) =>{
    const user = useSelector((state) => state.auth.user);

    return (user) ? children : <Navigate to="/auth/login" replace />;
}

export const PrivateRouteGuess = ({ children }) => {

  const user = JSON.parse(localStorage.getItem("user"));
  let guestUser = JSON.parse(localStorage.getItem("guestUser"));

  if (!user && !guestUser) {
    const guestId = localStorage.getItem("guest_id");

    if (guestId) {
      guestUser = {
        id: guestId,
        name: "Invitado",
        role: "guest",
        guest: true
      };

      localStorage.setItem("guestUser", JSON.stringify(guestUser));
    }
  }

  if (user || guestUser) {
    return children;
  }

  return <Navigate to="/guest-cart" />;
};

export const PrivateRouteAdmin = ({ children }) =>{
    const admin = useSelector((state) => state.authAdmin.admin);

    return (admin) ? children : <Navigate to="/admin/auth" replace />;
}
