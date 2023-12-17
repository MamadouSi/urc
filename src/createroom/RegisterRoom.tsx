import React, { useState, useEffect } from "react";
import { createRoom } from "./roomApi";
import { CustomError } from "../model/CustomError";
import {Link, useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";



// Define the type for the user state
interface UserState {
    id: string | null;
    // other properties if any
}

const RegisterRoom = () => {
    const [error, setError] = useState({} as CustomError);
    const [createdBy, setCreatedBy] = useState<string | null>("");
    const navigate = useNavigate();
    useDispatch();
    const userId = useSelector((state: { user: UserState }) => state.user.id);

    useEffect(() => {
        setCreatedBy(userId);
    }, [userId]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);

        const room = {
            name: data.get("name") as string,
            createdBy: createdBy !== null ? parseInt(createdBy, 10) : 0,
        };

        try {
            createRoom(
                room,
                () => {
                    form.reset();
                    setError(new CustomError(""));
                    navigate("/"); // Redirect to the desired page after creating the room
                },
                (createRoomError: CustomError) => {
                    setError(createRoomError);
                }
            );
        } catch (error) {
            console.error("Error during room creation:", error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} component={Box} p={4} mt={8}>
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5">
                    Créer une Room
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="name"
                        label="Room Name"
                        name="name"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Create Room
                    </Button>
                </Box>
                <Grid container justifyContent="flex-end" style={{ marginTop: "1em" }}>
                    <Grid item>
                        <Link to="/messages">Retour</Link>
                    </Grid>
                </Grid>
                {error.message && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {error.message}
                    </Typography>
                )}
            </Box>
            </Paper>
        </Container>
    );
};

export default RegisterRoom;
