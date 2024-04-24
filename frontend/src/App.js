import React from 'react';
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from './pages/LoginPage';
import GamesPage from './pages/GamesPage';
import GameDetailsPage from './pages/GameDetailsPage';
import LoggedInHomePage from './pages/LoggedInHomePage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OtherUserProfilePage from './pages/OtherUserProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<LoginPage />} />
        <Route path="/LoggedInHomePage" index element={<LoggedInHomePage/>} />
        <Route path="/Profile" index element={<ProfilePage/>}/>
        <Route path="/Games" index element={<GamesPage/>} />
        <Route path="/games/:gameName/:gameId" index element={<GameDetailsPage/>} />
        <Route path="/Profile/:userName" index element={<OtherUserProfilePage/>} />
        <Route path="/forgot-password" index element = {<ForgotPasswordPage/>} />
        <Route path="/verify" index element = {<ResetPasswordPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
