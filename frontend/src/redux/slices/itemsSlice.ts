import { createSlice } from '@reduxjs/toolkit';
import { ItemDataType } from '../../types/dataTypes/ItemDataType';

interface initialStateType {
    allItems: ItemDataType[];
    fiveRecentItems: ItemDataType[];
}

const initialState: initialStateType = {
    allItems: [],
    fiveRecentItems: [],
};

const itemsSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        setAllItems: (state, action) => {
            state.allItems = action.payload;
            state.fiveRecentItems = action.payload.reverse().slice(0, 5);
        },
    },
});

export const { setAllItems } = itemsSlice.actions;

export default itemsSlice.reducer;
