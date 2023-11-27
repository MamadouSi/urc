// conversationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConversationState {
    selectedUserId: number | null;
    // Ajoutez d'autres informations sur la conversation au besoin
}

const initialState: ConversationState = {
    selectedUserId: null,
};

const conversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        selectUser: (state, action: PayloadAction<number>) => {
            state.selectedUserId = action.payload;
        },
        clearSelectedUser: (state) => {
            state.selectedUserId = null;
        },
        // Ajoutez d'autres actions au besoin pour gérer la conversation
    },
});

export const { selectUser, clearSelectedUser } = conversationSlice.actions;
export const selectConversation = (state: { conversation: ConversationState }) => state.conversation;

export default conversationSlice.reducer;
