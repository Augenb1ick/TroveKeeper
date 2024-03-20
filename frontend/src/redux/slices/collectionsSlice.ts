import { createSlice } from '@reduxjs/toolkit';
import { CollectionDataType } from '../../types/dataTypes/CollectionDataType';

interface initialStateType {
    allCollections: CollectionDataType[];
    usersCollections: CollectionDataType[];
    fiveRecentCollections: CollectionDataType[];
    fiveBiggestCollections: CollectionDataType[];
    changedCollection: string;
}

const initialState: initialStateType = {
    allCollections: [],
    usersCollections: [],
    fiveRecentCollections: [],
    fiveBiggestCollections: [],
    changedCollection: '',
};

const collectionsSlice = createSlice({
    name: 'сollections',
    initialState,
    reducers: {
        setAllCollections: (state, action) => {
            state.allCollections = action.payload;
            state.fiveRecentCollections = action.payload.reverse().slice(0, 5);
            state.fiveBiggestCollections = action.payload
                .sort(
                    (a: CollectionDataType, b: CollectionDataType) =>
                        b.items.length - a.items.length
                )
                .slice(0, 5);
        },
        setUsersCollections: (state, action) => {
            state.usersCollections = action.payload;
        },
        setChangedCollection: (state, action) => {
            state.changedCollection = action.payload;
        },
    },
});

export const { setAllCollections, setChangedCollection, setUsersCollections } =
    collectionsSlice.actions;

export default collectionsSlice.reducer;
