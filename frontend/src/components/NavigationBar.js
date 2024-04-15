import React from 'react';
import { Link } from "react-router-dom";

function NavigationBar({ onLoginClick, onRegisterClick }) {


    return (
        <div className="blurred-background">
            <nav className="nav bg-primary bg-opacity-25">
                <Link to="/" className="ps-3 pt-0 py-0" >
                    <img src="/controllericon1.png"  width="60"  className="mb-n2 py-0 my-0 me-2 "></img>
                    <span className="site-title">GameGrid</span>
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
