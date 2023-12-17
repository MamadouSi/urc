//RoomList.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from './userSlice';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

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
            <List>
                {rooms.length > 0 &&
                    rooms.map((room) => (
                        <ListItem key={room.room_id} button component={Link} to={`/salon/${room.name}`}>
                            <ListItemAvatar>
                                <Avatar>
                                    {/* Use the GroupAddIcon for three people */}
                                    <GroupAddIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={room.name}
                                secondary={`Créé le ${room.created_on}`}
                            />
                        </ListItem>
                    ))}
            </List>
            <p>
                {/* Style the link as a button with the AddCircleOutlineIcon */}
                <Link to="/registerRoom" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                    <AddCircleOutlineIcon />
                    <span style={{ marginLeft: '8px' }}>Créez un salon ici</span>
                </Link>
            </p>
        </div>
    );
};

export default RoomList;
