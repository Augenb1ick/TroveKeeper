import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    successSnackText: '',
    isSuccessSnackOpen: false,
    errorSnackText: '',
    isErrorSnackOpen: false,
};

const snackBarsSlice = createSlice({
    name: 'snackBars',
    initialState,
    reducers: {
        handleSuccessSnackOpen: (state, action) => {
            state.isErrorSnackOpen = false;
            state.isSuccessSnackOpen = true;
            state.successSnackText = action.payload;
        },
        handleErrorSnackOpen: (state, action) => {
            state.isSuccessSnackOpen = false;
            state.isErrorSnackOpen = true;
            state.errorSnackText = action.payload;
        },
        handleSnacksClose: (state) => {
            state.isSuccessSnackOpen = false;
            state.isErrorSnackOpen = false;
        },
    },
});

export const {
    handleErrorSnackOpen,
    handleSuccessSnackOpen,
    handleSnacksClose,
} = snackBarsSlice.actions;

export default snackBarsSlice.reducer;
