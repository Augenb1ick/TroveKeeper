import { configureStore } from '@reduxjs/toolkit';
import usersSlice from './slices/usersSlice';
import snackBarsSlice from './slices/snackBarsSlice';
import collectionsSlice from './slices/collectionsSlice';
import itemsSlice from './slices/itemsSlice';
import tagsSlice from './slices/tagsSlice';
import searchSlice from './slices/searchSlice';

export const store = configureStore({
    reducer: {
        appUsers: usersSlice,
        snackBars: snackBarsSlice,
        collections: collectionsSlice,
        items: itemsSlice,
        appTags: tagsSlice,
        search: searchSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
