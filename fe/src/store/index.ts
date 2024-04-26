import { configureStore } from '@reduxjs/toolkit';
import { usersReducer } from './usersSlice';
import { groupsReducer } from './groupsSlice';

const store = configureStore({
    reducer: {
        users: usersReducer,
        groups: groupsReducer
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>