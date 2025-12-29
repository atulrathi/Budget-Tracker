import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Userproctedroute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    let auth = localStorage.getItem("token");
    if (!auth) {
      navigate("/");
    }
  }, []);

  return <div>{children}</div>;
};

export default Userproctedroute;
