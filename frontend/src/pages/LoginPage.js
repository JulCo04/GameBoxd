import React, { useState } from 'react';
import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import Register from '../components/Register';
import NavigationBar from '../components/NavigationBar';
import HomePageUI from '../components/HomePageUI';

const LoginPage = () => {
    const [showForm, setShowForm] = useState(null);

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
            <NavigationBar onLoginClick={() => toggleForm('login')} onRegisterClick={() => toggleForm('register')}/>
            <div className="center-container">
                {showForm === 'login' && 
                    <Login onExitClick={() => setShowForm(null)}/>
                }
                {showForm === 'register' && 
                    <Register  onExitClick={() => setShowForm(null)}/>
                }
            </div>
            <HomePageUI onLoginClick={()=> toggleForm('login')} onRegisterClick={()=> toggleForm('register')}/>
        </div>
    );
};

export default LoginPage;
