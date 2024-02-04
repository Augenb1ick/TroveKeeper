export type UserDataType = {
    email: string;
    isBlocked: boolean;
    lastLogin: string;
    name: string;
    regDate: string;
    _id: string;
    role: string;
};

export type UsersContextType = {
    currentUser: UserDataType;
    users: UserDataType[];
    isLoggedIn: boolean;
    setCurrentUser: (user: UserDataType) => void;
    setUsers: (users: UserDataType[]) => void;
    setIsLoggedIn: (loggedIn: boolean) => void;
};
