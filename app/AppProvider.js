// AppProvider.js
import React, { useEffect, useState, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

export const UserContext = createContext(null);

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return null; // You can replace this with a loading screen if needed
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default AppProvider;
