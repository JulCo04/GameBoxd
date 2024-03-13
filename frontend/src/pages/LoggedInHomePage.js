import React, { useState, useEffect } from 'react';
import LoggedInNavBar from '../components/LoggedInNavBar';
import LoggedInHomeUI from '../components/LoggedInHomeUI';

const LoggedInHomePage = () => {
    
    const doLogout = event => {
        event.preventDefault();

        localStorage.removeItem("user_data")
        console.log(localStorage.getItem("user_data"));
        window.location.href = '/';

    };

    return (
        <div className="page-container">
            <LoggedInNavBar/>
            <LoggedInHomeUI/>
            
        </div>
    );
};

export default LoggedInHomePage;
