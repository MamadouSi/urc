import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { selectUser } from '../user/userSlice';
import RoomList from './RoomList';
import RoomForm from './RoomForm';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import { Container, Paper, Typography } from '@mui/material';

interface User {
    user_id: number;
    username: string;
    last_login: string;
}

const UserWithMessages: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<any[]>([]); // State for messages
    const currentUser = useSelector(selectUser);
    const { userId, nomdusalon } = useParams();
    const location = useLocation();

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        const authToken = storedToken || currentUser?.token;

        if (authToken) {
            fetch('/api/users', {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
                .then((response) => response.json())
                .then((data: User[]) => setUsers(data))
                .catch((error) => console.error('Error fetching users:', error));
        }
    }, [currentUser]);

    useEffect(() => {
        const userById = users.find((user) => user.user_id === Number(userId));
        setSelectedUser(userById || null);
    }, [userId, users]);

    const handleSendMessage = (message: any) => {
        // Update the messages state with the new message
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    return (
        <Container>
            {location.pathname.startsWith('/salon') && nomdusalon && (
                <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
                    <Typography variant="h5" gutterBottom>
                        Salon: {nomdusalon}
                    </Typography>
                    <RoomList />
                    <RoomForm
                        nomdusalon={nomdusalon}
                        onSendMessage={(message: any) => handleSendMessage(message)}
                    />
                </Paper>
            )}
            {location.pathname.startsWith('/messages/user') && selectedUser && (
                <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
                    <Typography variant="h5" gutterBottom>
                        Messages with {selectedUser.username}
                    </Typography>
                    <MessageList selectedUser={selectedUser} />
                    <MessageForm
                        recipient={selectedUser.user_id || ''}
                        onSendMessage={(message: any) => handleSendMessage(message)}
                    />
                </Paper>
            )}
        </Container>
    );
};

export default UserWithMessages;

