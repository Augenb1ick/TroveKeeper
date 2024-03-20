import { createSlice } from '@reduxjs/toolkit';
import { TagDataType } from '../../types/dataTypes/TagDataType';

interface initialStateType {
    tags: TagDataType[];
    updatedTags: string[];
}

const initialState: initialStateType = {
    tags: [],
    updatedTags: [],
};

const tagsSlice = createSlice({
    name: 'appTags',
    initialState,
    reducers: {
        setTags: (state, action) => {
            state.tags = action.payload;
        },
        setUpdatedTags: (state, action) => {
            state.updatedTags = action.payload;
        },
    },
});

export const { setTags, setUpdatedTags } = tagsSlice.actions;

export default tagsSlice.reducer;
