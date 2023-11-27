// MessageForm.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../user/userSlice';
import { TextField, Button, Grid } from '@mui/material';

const MessageForm = ({ recipient, onSendMessage }) => {
    const [content, setContent] = useState('');
    const currentUser = useSelector(selectUser);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const storedToken = sessionStorage.getItem('token');
        const token = storedToken || (currentUser ? currentUser.token : null);

        if (!token) {
            console.error('Token non disponible');
            return;
        }

        const response = await fetch('/api/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ recipient, content }),
        });

        console.log('Formulaire soumis avec le contenu :', content, 'à :', recipient);

        if (response.ok) {
            if (typeof onSendMessage === 'function') {
                onSendMessage({ recipient, content });
                setContent('');
            } else {
                console.error('onSendMessage n\'est pas une fonction ou est indéfini');
            }
        } else {
            console.error('Erreur lors de l\'envoi du message :', response);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={9} style={{ border: 'none' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Entrez votre message"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        sx={{
                            borderRadius: '20px',
                            backgroundColor: '#f0f0f0',
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                            borderRadius: '20px',
                        }}
                    >
                        Envoyer
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default MessageForm;
