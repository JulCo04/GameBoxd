import React from 'react';
import { Link } from "react-router-dom";

function LoggedInNavBar({ onLogoutClick }) {

    const onProfileClick = () => {
        window.location.href = '/Profile';
    };

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
                    <Link to="/LoggedInHomePage" className="ps-3 pt-0 py-0" >
                        <img src="/controllericon1.png"  width="60"  className="mb-n2 py-0 my-0 me-2 "></img>
                        <span className="site-title">GameGrid</span>
                    </Link>
                <ul>
                    <li><button className="text-button" onClick={onProfileClick}>Profile</button></li>
                    <li><button className="text-button" onClick={onGamesClick}>Games</button></li>
                    <li><button className="text-button" onClick={doLogout}>Logout</button></li>
                </ul>
            </nav>
        </div>
    );
}

export default LoggedInNavBar;