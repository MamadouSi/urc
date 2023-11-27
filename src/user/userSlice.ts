// userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    token: string | null;
    username: string | null;
    externalId: string | null;
    id: number | null;
}

const initialState: UserState = {
    token: null,
    username: null,
    externalId: null,
    id: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            const { token, username, externalId, id } = action.payload;
            state.token = token;
            state.username = username;
            state.externalId = externalId;
            state.id = id;
        },
        clearUser: (state) => {
            state.token = null;
            state.username = null;
            state.externalId = null;
            state.id = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export const selectUser = (state: { user: UserState }) => state.user;

export default userSlice.reducer;