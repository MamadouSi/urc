// ChatPage.tsx
import React from 'react';
import UserList from './UserList';
import RoomList from './RoomList';
import Message from '../message/UserWithMessages';

const ChatPage: React.FC = () => {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: '0 0 250px', padding: '16px', borderRight: '5px solid #ccc', overflowY: 'auto' }}>
                <UserList />
                <RoomList />
            </div>
            <div style={{ flex: '1', padding: '16px' }}>
                <Message />
            </div>
        </div>
    );
};

export default ChatPage;
