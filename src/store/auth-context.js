import React, { useState, useEffect, useCallback } from 'react';

let logoutTimer;

const AuthContext = React.createContext({
  user: {},
  isLoggedIn: false,
  login: (user, expirationTime) => { },
  logout: () => { },
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredUser = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const storedExpirationDate = localStorage.getItem('expirationTime');

  const remainingTime = calculateRemainingTime(storedExpirationDate);
  if (remainingTime <= 3600) {
    localStorage.removeItem('user');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return {
    user: storedUser,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const userData = retrieveStoredUser();

  let initialUser;
  if (userData) {
    initialUser = userData.user;
  }

  const [user, setUser] = useState(initialUser);

  const userIsLoggedIn = !!user;

  const logoutHandler = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('expirationTime');

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (user, expirationTime) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('expirationTime', expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (userData) {
      console.log(userData.duration);
      logoutTimer = setTimeout(logoutHandler, userData.duration);
    }
  }, [userData, logoutHandler]);

  const contextValue = {
    user: user,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
