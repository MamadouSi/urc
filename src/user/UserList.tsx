//UserList.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from './userSlice';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';

interface User {
    user_id: number;
    username: string;
    last_login: string;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const { token, id: currentUserId } = useSelector(selectUser);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        const authToken = storedToken || token;

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
    }, [token]);

    // Filtrer la liste des utilisateurs pour exclure l'utilisateur connecté
    const filteredUsers = users.filter((user) => user.user_id !== currentUserId);

    return (
        <div>
            <h2>Liste des utilisateurs</h2>
            <List>
                {filteredUsers.length > 0 &&
                    filteredUsers.map((user) => (
                        <ListItem key={user.user_id} button component={Link} to={`/messages/user/${user.user_id}`}>
                            <ListItemAvatar>
                                <Avatar>
                                    {/* Use the Person icon (you can replace it with any other Material-UI icon) */}
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={user.username}
                                secondary={`Dernière connexion : ${user.last_login}`}
                            />
                        </ListItem>
                    ))}
            </List>
        </div>
    );
};

export default UserList;
