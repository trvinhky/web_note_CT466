import { createSlice } from '@reduxjs/toolkit';
import { GroupData } from '~/types/dataType';

type GroupStateType = {
    group?: GroupData
}

const initialState: GroupStateType = {
    group: undefined
}

const groupsSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        setGroup: (state, action) => {
            state.group = action.payload;
        }
    },
});

export const { reducer: groupsReducer, actions } = groupsSlice;