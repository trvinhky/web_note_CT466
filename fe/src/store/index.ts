import { configureStore } from '@reduxjs/toolkit';
import { usersReducer } from '~/store/usersSlice';

const store = configureStore({
    reducer: {
        users: usersReducer,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>