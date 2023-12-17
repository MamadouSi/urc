import React, { useState } from "react";
import { registerUser } from "./registerApi";
import { CustomError } from "../model/CustomError";
import {Link, useNavigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid"; // Import Paper component

const RegisterForm = () => {
    const [error, setError] = useState({} as CustomError);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);

        const user = {
            username: data.get("login") as string,
            email: data.get("email") as string,
            password: data.get("password") as string,
        };

        try {
            registerUser(
                user,
                () => {
                    form.reset();
                    setError(new CustomError(""));

                    navigate("/");
                },
                (registerError: CustomError) => {
                    setError(registerError);
                }
            );
        } catch (error) {
            console.error("Error during registration:", error);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Paper elevation={3} component={Box} p={4} mt={8}>
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Inscription
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="login"
                            label="Login"
                            name="login"
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                        />
                        <TextField
                            margin="normal"
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Inscription
                        </Button>
                    </Box>
                    <Grid container justifyContent="flex-end" style={{ marginTop: "1em" }}>
                        <Grid item>
                            <Link to="/">Retour</Link>
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

export default RegisterForm;
