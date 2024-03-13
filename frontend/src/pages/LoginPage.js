import React, { useState, useEffect } from 'react';
import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import Register from '../components/Register';
import NavigationBar from '../components/NavigationBar';
import LoggedInNavBar from '../components/LoggedInNavBar';
import HomePageUI from '../components/HomePageUI';
import LoggedInHomeUI from '../components/LoggedInHomeUI';

const LoginPage = () => {
    const [showForm, setShowForm] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user_data');
        if (userData) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const toggleForm = (form) => {
        console.log("Current Form Status:", form)
        setShowForm(form);
        logClick(form);
    };

    const logClick = (action) => {
        console.log(`${action} clicked!`);
    };


    return (
        <div className="page-container">
            <NavigationBar onLoginClick={() => toggleForm('login')} onRegisterClick={() => toggleForm('register')} />
    
            <div className="center-container">
                {showForm === 'login' &&
                    <Login onExitClick={() => setShowForm(null)} />
                }
                {showForm === 'register' &&
                    <Register onExitClick={() => setShowForm(null)} />
                }
            </div>
            <div>
            <HomePageUI onLoginClick={()=> toggleForm('login')} onRegisterClick={()=> toggleForm('register')}/>
            </div>

        </div>
    );
};

export default LoginPage;

