import React, { createContext } from "react";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const user = {
    name: "",
    income: "",
    email: "",
    Budget:'',
  };

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
