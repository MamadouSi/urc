// roomsSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Room {
    room_id: number;
    name: string;
    created_on: string;
}

interface RoomsState {
    rooms: Room[];
}

const initialState: RoomsState = {
    rooms: [],
};

const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        setRooms: (state, action: PayloadAction<Room[]>) => {
            state.rooms = action.payload;
        },
    },
});

export const { setRooms } = roomsSlice.actions;
export const selectRooms = (state: { rooms: RoomsState }) => state.rooms.rooms;

export default roomsSlice.reducer;
