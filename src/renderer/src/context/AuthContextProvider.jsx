import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { getUser } from "../server/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(localStorage.getItem("token"));

  const setToken = (newToken) => {
    localStorage.setItem("token", newToken)
    setToken_(newToken);
  };

  const LOGOUT = () => {
    setToken(null);
    localStorage.removeItem("token");
    axios.defaults.headers.common = { Authorization: null };
  }

  useEffect(() => {
    const getToken = async () => {
      const result = await localStorage.getItem("token");
      if (result) {
        setToken(result);
      }
    }

    getToken();
  }, [])


  useEffect(() => {
    if (token) {
      axios.defaults.headers.common = { Authorization: `Token ${token}` };
      localStorage.setItem("token", token);

    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");

    }
  }, [token]);

  const user_data = useQuery("profile", getUser, {
    enabled: false,
  });

  useEffect(() => {
    if (token) {
      user_data.refetch()
    }

  }, [token])


  useEffect(() => {

    if (user_data.error?.response?.status === 401) {
      LOGOUT()
      window.location.href = "/"
    }
  }, [user_data.data]);


  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      LOGOUT,
    }),
    [token]
  );

  if (user_data.isFetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center justify-center space-x-2 text-2xl font-semibold text-gray-800">
          <span className="font-mono">Syncing</span>
          <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-gray-800 rounded-full animate-bounce"></div>
        </div>
      </div>
    )
  }
  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
