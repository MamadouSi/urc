import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Login } from './user/Login';
import ChatPage from './user/ChatPage'; // Utilisez l'import par défaut
import RegisterPage from './createuser/RegisterForm';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/messages/user/:userId" element={<ChatPage />} />
                <Route path="/messages" element={<ChatPage />} />
                <Route path="/salon/:nomdusalon" element={<ChatPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </Router>
    );
};

export default App;
