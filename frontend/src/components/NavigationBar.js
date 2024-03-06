import React from 'react';
import { Link } from "react-router-dom";

function NavigationBar({ onLoginClick, onRegisterClick }) {
    return (
        <nav className="nav">
            <Link to="/" className="site-title">
                GamerBoxd
            </Link>
            <ul>
                <li onClick={onLoginClick}>Login</li>
                <li onClick={onRegisterClick}>Create Account</li>
                <li>Games</li>
            </ul>
        </nav>
    );
}

export default NavigationBar;
