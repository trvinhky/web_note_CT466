import { createSlice } from '@reduxjs/toolkit';
import { UserData } from '~/types/dataType';
import { deleteCookie, setIdFromCookie } from '~/utils/cookieActions';

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
            setIdFromCookie('user_id', state.info._id as string)
        },
        LogOut: (state) => {
            state.isLogin = false;
            state.info = {};
            deleteCookie('user_id')
        },
        setInfo: (state, action) => {
            state.info = action.payload;
            setIdFromCookie('user_id', state.info._id as string)
        }
    },
});

export const { reducer: usersReducer, actions } = usersSlice;