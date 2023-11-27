import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "./loginApi";
import { Session } from "../model/common";
import { CustomError } from "../model/CustomError";
import { Link, useNavigate } from "react-router-dom";
import { setUser, clearUser } from "./userSlice"; // Import the setUser action

export function Login() {
    const [error, setError] = useState({} as CustomError);
    const dispatch = useDispatch(); // Get the dispatch function from the Redux store
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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

                // Dispatch the setUser action to store the user details in the Redux store
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

                // Dispatch the clearUser action in case of a login error
                dispatch(clearUser());
            }
        );
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input name="login" placeholder="login" />
                <br />
                <input name="password" placeholder="password" />
                <br />
                <button type="submit">connexion</button>
            </form>
            <p>
                Vous n&apos;avez pas de compte ?{" "}
                <Link to="/register">Créez un compte ici</Link>.
            </p>
            {error.message && <span>{error.message}</span>}
        </>
    );
}
