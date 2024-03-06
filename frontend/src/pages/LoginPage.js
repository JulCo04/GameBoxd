import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import Register from '../components/Register';
import NavigationBar from '../components/NavigationBar';

const LoginPage = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const toggleLogin = () => {
        setShowLogin(!showLogin);
    };

    const toggleRegister = () => {
        setShowRegister(!showRegister);
    };

    return (
        <div className="page-container">
            <NavigationBar onLoginClick={toggleLogin} onRegisterClick={toggleRegister}/>
            <div className="center-container">
                {showLogin && <Login />}
                {showRegister && <Register />}
            </div>
        </div>
    );
};

export default LoginPage;