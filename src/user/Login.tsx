import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import { loginUser } from "./loginApi";
import { Session } from "../model/common";
import { CustomError } from "../model/CustomError";
import { setUser, clearUser } from "./userSlice";

export function Login() {
    const [error, setError] = useState({} as CustomError);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);

        loginUser(
            {
                user_id: -1,
                username: data.get("login") as string,
                password: data.get("password") as string,
            },
            (result: Session) => {
                console.log(result);

                dispatch(
                    setUser({
                        token: result.token,
                        username: result.username || null,
                        externalId: result.externalId,
                        id: result.id || null,
                    })
                );

                form.reset();
                setError(new CustomError(""));
                navigate(`/messages`);
            },
            (loginError: CustomError) => {
                console.log(loginError);
                setError(loginError);

                dispatch(clearUser());
            }
        );
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Paper elevation={3} component={Box} p={4} mt={8}>
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Connexion
                </Typography>
                <form onSubmit={handleSubmit} style={{ marginTop: "1em" }}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="login"
                        label="Login"
                        name="login"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "1em" }}
                    >
                        Connexion
                    </Button>
                </form>
                <Grid container justifyContent="flex-end" style={{ marginTop: "1em" }}>
                    <Grid item>
                        <Link to="/register">Pas encore de compte ? Créez-en un</Link>
                    </Grid>
                </Grid>
                {error.message && (
                    <Typography color="error" variant="body2" style={{ marginTop: "1em" }}>
                        {error.message}
                    </Typography>
                )}
            </Paper>
        </Container>
    );
}
