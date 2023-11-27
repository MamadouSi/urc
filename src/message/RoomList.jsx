import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../user/userSlice';
import { useLocation } from 'react-router-dom';
import { Paper, Grid, Typography } from '@mui/material';
// ... (imports inchangés)

const RoomList = () => {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const location = useLocation();
    const nomsalon = location.pathname.split('/').pop();
    const currentUser = useSelector(selectUser);

    const [currentUsername, setCurrentUsername] = useState('');

    useEffect(() => {
        setCurrentUsername(currentUser?.username || sessionStorage.getItem('username') || '');
    }, [currentUser]);

    useEffect(() => {
        const fetchData = async () => {
            if (nomsalon && currentUsername) {
                try {
                    const storedToken = sessionStorage.getItem('token');
                    if (storedToken) {
                        const response = await fetch(`/api/messagesr?nomsalon=${encodeURIComponent(nomsalon)}`, {
                            headers: {
                                Authorization: `Bearer ${storedToken}`,
                            },
                        });

                        if (response.ok) {
                            const data = await response.json();
                            const sortedMessages = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                            setMessages(sortedMessages);
                            scrollToBottom();
                            localStorage.setItem('messages', JSON.stringify(sortedMessages));
                        } else {
                            console.error('Error fetching messages:', response);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        };

        fetchData();
    }, [currentUsername, nomsalon]);

    useEffect(() => {
        const storedMessages = localStorage.getItem('messages');
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);

    const isCurrentUserMessage = (message) => message.senderUser.username === currentUsername;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Conversation dans le salon : {nomsalon}
            </Typography>
            <Paper style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                <Grid container direction="column" spacing={2} style={{ padding: '10px' }}>
                    {messages.length > 0 && messages.map((message, index) => (
                        <Grid
                            key={index}
                            item
                            style={{
                                alignSelf: isCurrentUserMessage(message) ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <Typography
                                style={{
                                    padding: '5px',
                                    borderRadius: '5px',
                                    backgroundColor: isCurrentUserMessage(message) ? '#e6f7ff' : '#f0f0f0',
                                }}
                            >
                                <strong>{message.senderUser.username}</strong>: {message.content}({new Date(message.timestamp).toLocaleString()})
                            </Typography>
                        </Grid>
                    ))}
                    <div ref={messagesEndRef}></div>
                </Grid>
            </Paper>
        </div>
    );
};

export default RoomList;
