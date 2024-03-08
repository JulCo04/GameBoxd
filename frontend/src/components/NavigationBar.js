import React from 'react';
import { Link } from "react-router-dom";

function NavigationBar({ onLoginClick, onRegisterClick }) {
    return (
        <div className="blurred-background">
            <nav className="nav bg-primary bg-opacity-25">
                <Link to="/" className="site-title ps-3 pt-2">
                    GamerBoxd
                </Link>
                <ul>
                    <li><button class="text-button" onClick={onLoginClick}>Login</button></li>
                    <li><button class="text-button" onClick={onRegisterClick}>Create Account</button></li>
                    <li><Link to="/games">Games</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default NavigationBar;
