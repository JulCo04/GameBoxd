import React from 'react';
import { Link } from 'react-router-dom';
import PopularGames from './PopularGames';
import NewGames from './NewGames';

const LoggedInHomeUI = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <span className='text-white' style={{ fontSize: '24px' }}>Welcome! Here is what we've been playing</span>
      <PopularGames />
      <NewGames />
    </div>
  );
}

export default LoggedInHomeUI;


