/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux";



export const PrivateRouteGuest = ({ children }) => {

  let guestUser = JSON.parse(localStorage.getItem("guestUser"));

  if (!guestUser) {
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

  if (guestUser) {
    return children;
  }

  return <Navigate to="/guest-cart" />;
};


export const PublicRoute = ({children}) => {
  const user = useSelector((state) => state.auth.user);

    return (!user) ? children : <Navigate to="/dashboard" replace />;
  };
export const PublicRouteAdmin = ({children}) => {
  const admin = useSelector((state) => state.authAdmin.admin);

    return (!admin) ? children : <Navigate to="/admin/dashboard" replace />;
  };

