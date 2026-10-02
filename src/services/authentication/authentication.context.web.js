// Web build only (Metro picks this file over authentication.context.js when
// bundling for the browser). The portfolio demo runs without Firebase: logging
// in or signing up with any details, or none, enters the app as a demo user.
// iOS and Android builds are untouched and still use Firebase sign-in.
import React, { useState, createContext } from "react";

export const AuthenticationContext = createContext();

const demoUser = (email) => ({
  uid: "web-demo",
  email: email && email.trim() ? email.trim() : "demo@greengetaway.dk",
});

export const AuthenticationContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const onLogin = (email) => {
    setError(null);
    setUser(demoUser(email));
  };

  const onRegister = (email, password, repeatedPassword) => {
    if (password !== repeatedPassword) {
      setError("Error: Password do not match");
      return;
    }
    setError(null);
    setUser(demoUser(email));
  };

  const onLogout = () => setUser(null);

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isLoading: false,
        error,
        onLogin,
        onRegister,
        onLogout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
