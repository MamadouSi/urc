//MessageComponent.tsx
import React, { useEffect, useState } from 'react';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
interface User {
    user_id: number;
    username: string;
    last_login: string;
}

const UserWithMessages: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        // Utilisez ici un appel API pour récupérer la liste des utilisateurs
        fetch('/api/users')
            .then((response) => response.json())
            .then((data: User[]) => setUsers(data))
            .catch((error) => console.error('Error fetching users:', error));
    }, []);

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
    };

    return (
        <div>
            <h2>Liste des utilisateurs</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.user_id} onClick={() => handleUserSelect(user)}>
                        {user.username} - Dernière connexion : {user.last_login}
                    </li>
                ))}
            </ul>

            {selectedUser && (
                <div>
                    <h2>Conversation avec {selectedUser.username}</h2>

                    <MessageList sender={currentUser} recipient={selectedUser} />
                   <MessageForm sender={currentUser} recipient={selectedUser} onSendMessage={undefined} />
                </div>
            )}
        </div>
    );
};

export default UserWithMessages;
