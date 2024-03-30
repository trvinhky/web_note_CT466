import { createSlice } from '@reduxjs/toolkit';
import { UserData } from '~/types/dataType';

type UserStateType = {
    info: UserData
    isLogin: boolean
}

const initialState: UserStateType = {
    info: {},
    isLogin: false
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        LoginAccount: (state, action) => {
            state.isLogin = true;
            state.info = action.payload;
        },
        LogOut: (state) => {
            state.isLogin = false;
            state.info = {};
        },
        setInfo: (state, action) => {
            state.info = action.payload;
        }
    },
});

export const { reducer: usersReducer, actions } = usersSlice;