import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../user/userSlice';
import { useLocation } from 'react-router-dom';
import { Paper, Grid, Typography } from '@mui/material';

const MessageList = ({ selectedUser }) => {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);
    const location = useLocation();
    const recipientUserId = location.pathname.split('/').pop();
    const currentUser = useSelector(selectUser);

    const [currentUsername, setCurrentUsername] = useState('');

    useEffect(() => {
        setCurrentUsername(currentUser?.username || sessionStorage.getItem('username') || '');
    }, [currentUser]);

    useEffect(() => {
        const fetchData = async () => {
            if (recipientUserId && currentUsername) {
                try {
                    const storedToken = sessionStorage.getItem('token');
                    if (storedToken) {
                        const response = await fetch(`/api/messages?sender=${encodeURIComponent(currentUsername)}&recipient=${encodeURIComponent(recipientUserId)}`, {
                            headers: {
                                Authorization: `Bearer ${storedToken}`,
                            },
                        });

                        if (response.ok) {
                            const data = await response.json();
                            // Tri des messages par timestamp (ou tout autre critère de tri souhaité)
                            const sortedMessages = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                            setMessages(sortedMessages);
                            scrollToBottom();
                            // Sauvegarde des messages dans le stockage local
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
    }, [currentUsername, recipientUserId, selectedUser]);

    useEffect(() => {
        // Récupération des messages depuis le stockage local lors du montage du composant
        const storedMessages = localStorage.getItem('messages');
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }
    }, []);

    useEffect(() => {
        // Sauvegarde des messages dans le stockage local à chaque mise à jour
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
                Conversation entre {currentUsername} et {selectedUser?.username}
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

export default MessageList;