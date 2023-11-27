import React, { useState } from "react";
import { registerUser } from "./registerApi";
import { CustomError } from "../model/CustomError";
import { useNavigate } from "react-router-dom";



const RegisterForm = () => {
    const [error, setError] = useState({} as CustomError);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);

        const user = {
            username: data.get('login') as string,
            email: data.get('email') as string,
            password: data.get('password') as string
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
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Login:
                    <input type="text" name="login" />
                </label>
                <br />
                <label>
                    Email:
                    <input type="email" name="email" />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <br />
                <button type="submit">Inscription</button>
            </form>
            {error.message && (
                <p style={{ color: 'red' }}>
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default RegisterForm;
