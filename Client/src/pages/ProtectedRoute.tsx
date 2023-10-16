import { useAppContext } from "../context/appContext";
import { Navigate, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

// not sure what the type for any React component is
const ProtectedRoute = ({ children }: any) => {
  const navigate = useNavigate();
  const { user } = useAppContext();

  useEffect(() => {
    if (user && window.location.pathname === "/") {
      navigate("/top-animes");
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/landing" />;
  }
  return children;
};

export default ProtectedRoute;
