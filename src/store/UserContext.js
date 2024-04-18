import React, { useEffect, useState } from "react";
import { httpService } from '../shared/service/service';

export const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [mode, changeViewMode] = useState('user');
  const [userLoading, setLoading] = useState(true);
  const [userError, setUserError] = useState(false);

  const getUser = async () => {
    setLoading(true);
    try {
      const response = await httpService("GET", "get_user");

      setUser(response.data);
      changeViewMode(response.data.data.view_mode);
      setUserError(false);
    } catch (error) {
      setUserError(true);
    } finally {
      setLoading(false);
    }
  };

  const changeUserViewMode = (mode) => {
    const fetch = async () => {
      try {
        // Здесь вы должны добавить вызов API для сохранения изменений в режиме просмотра на сервере
        // Но пока мы просто изменяем локальное состояние
        changeViewMode(mode);
      } catch (error) {
        setUserError(true);
      }
    }
    fetch();
  }

  return (
    <UserContext.Provider value={{ userLoading, user, getUser, changeUserViewMode, mode, userError }}>
      {children}
    </UserContext.Provider>
  );
};
