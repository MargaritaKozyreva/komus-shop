import React, { useEffect, useState } from "react";
import { httpServiceMock } from '../../shared/service/service';
import userData from '../../mock_data/user.json'
import userData2 from '../../mock_data/user2.json'

export const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [mode, changeViewMode] = useState('user');
  const [userLoading, setLoading] = useState(true);
  const [userError, setUserError] = useState(false);

  const getUser = () => {
    const fetchUser = async () => {
      try {
        const data = await httpServiceMock(userData);
        if (data.statusText === 'success') {
          setUser(data.data);
          setLoading(false);
          changeViewMode(data.data.role);
        } else {
          setLoading(false);
          setUserError(true)
        }
      } catch (error) {
        setLoading(false);
        setUserError(true)
      }
    }
    fetchUser();
  };

  const changeUserViewMode = (mode) => {
    const fetch = async () => {
      try {
        // запрос на изменение состояния просмотра сохранить на бэке
        changeViewMode(mode)
      } catch (error) {
        setLoading(false);
        setUserError(true)
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

