import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from './userSlice';

interface User {
    user_id: number;
    username: string;
    last_login: string;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const { token } = useSelector(selectUser);

    useEffect(() => {
        // Récupérer le token depuis le sessionStorage
        const storedToken = sessionStorage.getItem('token');

        // Utiliser le token stocké ou celui dans le state s'il est disponible
        const authToken = storedToken || token;

        // Vérifier si le token est présent avant d'effectuer l'appel API
        if (authToken) {
            // Utiliser un appel API ici pour récupérer la liste des utilisateurs
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

    return (
        <div>
            <h2>Liste des utilisateurs</h2>
            <ul>
                {users.length > 0 && users.map((user) => (
                    <li key={user.user_id}>
                        <Link to={`/messages/user/${user.user_id}`}>
                            {user.username} - Dernière connexion : {user.last_login}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
