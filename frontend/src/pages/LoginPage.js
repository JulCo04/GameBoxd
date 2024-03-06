import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import Register from '../components/Register';
import NavigationBar from '../components/NavigationBar';

const LoginPage = () => {
    const [showForm, setShowForm] = useState(null);

    const toggleForm = (form) => {
        setShowForm(prevForm => (prevForm === form) ? null : form);
        logClick(form);
    };

    const logClick = (action) => {
        console.log(`${action} clicked!`);
    };

    return (
        <div className="page-container">
            <NavigationBar onLoginClick={() => toggleForm('login')} onRegisterClick={() => toggleForm('register')}/>
            <div className="center-container">
                {showForm === 'login' && <Login />}
                {showForm === 'register' && <Register />}
            </div>
        </div>
    );
};

export default LoginPage;
