import { createSlice } from '@reduxjs/toolkit';
import { UserDataType } from '../../types/dataTypes/userData';
import { defaultUserData } from '../../utills/constants';

const usersSlice = createSlice({
    name: 'appUsers',
    initialState: {
        currentUser: defaultUserData,
        users: [] as UserDataType[],
        isLoggedIn: false,
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setIsLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },
    },
});

export const { setCurrentUser, setUsers, setIsLoggedIn } = usersSlice.actions;

export default usersSlice.reducer;
