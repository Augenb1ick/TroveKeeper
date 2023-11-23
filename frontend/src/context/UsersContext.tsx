import React, { createContext, useState, ReactNode, useContext } from 'react';
import { UserDataType, UsersContextType } from '../types/dataTypes/userData';
import { defaultUserData } from '../utills/constants';

export const UsersContext = createContext<UsersContextType>({
    currentUser: defaultUserData,
    users: [],
    isLoggedIn: false,
    setCurrentUser: () => {},
    setUsers: () => {},
    setIsLoggedIn: () => {},
});

export const UsersProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [currentUser, setCurrentUser] =
        useState<UserDataType>(defaultUserData);
    const [users, setUsers] = useState<UserDataType[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const contextValue: UsersContextType = {
        currentUser,
        users,
        isLoggedIn,
        setCurrentUser,
        setUsers,
        setIsLoggedIn,
    };

    return (
        <UsersContext.Provider value={contextValue}>
            {children}
        </UsersContext.Provider>
    );
};

export const useUsers = () => {
    const context = useContext(UsersContext);
    return context;
};
