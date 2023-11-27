import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from './userSlice';
import { Link } from 'react-router-dom'; // Importer le composant Link depuis react-router-dom

interface Room {
    room_id: number;
    name: string;
    created_on: string;
}

const RoomList: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const { token } = useSelector(selectUser);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token');
        const authToken = storedToken || token;

        if (authToken) {
            fetch('/api/room', {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
                .then((response) => response.json())
                .then((data: Room[]) => setRooms(data))
                .catch((error) => console.error('Error fetching rooms:', error));
        }
    }, [token]);

    return (
        <div>
            <h2>Liste des salons</h2>
            <ul>
                {rooms.length > 0 && rooms.map((room) => (
                    <li key={room.room_id}>
                        {/* Utiliser le composant Link pour créer un lien cliquable */}
                        <Link to={`/salon/${room.name}`}>
                            {room.name} - Créé le {room.created_on}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RoomList;
