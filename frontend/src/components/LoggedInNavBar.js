import React from 'react';
import { Link } from "react-router-dom";

function LoggedInNavBar({ onLogoutClick }) {

    const onGamesClick = () => {
        window.location.href = '/Games';
    };

    const doLogout = event => {
        event.preventDefault();

        localStorage.removeItem("user_data")
        console.log(localStorage.getItem("user_data"));
        window.location.href = '/';

    };

    return (
        <div className="blurred-background">
            <nav className="nav bg-primary bg-opacity-25">
                <Link to="/LoggedInHomePage" className="site-title ps-3 pt-2">
                    GameGrid
                </Link>
                <ul>
                    <li><button className="text-button" onClick={onGamesClick}>Games</button></li>
                    <li><button className="text-button" onClick={doLogout}>Logout</button></li>
                </ul>
            </nav>
        </div>
    );
}

export default LoggedInNavBar;