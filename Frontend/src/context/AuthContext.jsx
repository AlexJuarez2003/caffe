import { createContext, useContext, useEffect, useState } from "react";
import { fetchWithAuth } from "../helper/FetchWithAuth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {

      const response = await fetchWithAuth(
        "http://localhost:8000/accounts/profile/customer/"
      );

      const data = await response.json();

      setUser(data);

      localStorage.setItem("user", JSON.stringify(data));

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {

    const localUser = localStorage.getItem("user");

    if (localUser) {
      setUser(JSON.parse(localUser));
    }

    refreshUser().finally(() => setLoading(false));

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        refreshUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);