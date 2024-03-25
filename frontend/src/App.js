import React from 'react';
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from './pages/LoginPage';
import GamesPage from './pages/GamesPage';
import GameDetailsPage from './pages/GameDetailsPage';
import LoggedInHomePage from './pages/LoggedInHomePage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<LoginPage />} />
        <Route path="/LoggedInHomePage" index element={<LoggedInHomePage/>} />
        <Route path="/Games" index element={<GamesPage/>} />
        <Route path="/games/:gameName/:gameId" index element={<GameDetailsPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
