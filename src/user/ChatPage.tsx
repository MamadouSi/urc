// ChatPage.tsx
import React from 'react';
import UserList from './UserList';
import RoomList from './RoomList';
import Message from '../message/UserWithMessages';


const ChatPage: React.FC = () => {
    return (
        <div>
            <h1>Chat Page</h1>
            <UserList />
            <RoomList />
            <Message />

        </div>
    );
};

export default ChatPage;