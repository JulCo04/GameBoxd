import React from 'react';
import { Link } from "react-router-dom";

function NavigationBar({ onLoginClick, onRegisterClick }) {
    return (
        <nav className="nav">
            <Link to="/" className="site-title">
                GamerBoxd
            </Link>
            <ul>
                <li><button class="text-button" onClick={onLoginClick}>Login</button></li>
                <li><button class="text-button" onClick={onRegisterClick}>Create Account</button></li>
                <li><Link to="/games">Games</Link></li>
            </ul>
        </nav>
    );
}

export default NavigationBar;
