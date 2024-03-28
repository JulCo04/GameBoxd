import React from 'react';
import { Link } from "react-router-dom";

function NavigationBar({ onLoginClick, onRegisterClick }) {


    return (
        <div className="blurred-background">
            <nav className="nav bg-primary bg-opacity-25">
                <Link to="/" className="site-title ps-3 pt-2">
                    GameGrid
                </Link>
                <ul>
                    <li><button className="text-button" onClick={onLoginClick}>Login</button></li>
                    <li><button className="text-button" onClick={onRegisterClick}>Create Account</button></li>
                </ul>
            </nav>
        </div>
    );
}

export default NavigationBar;
