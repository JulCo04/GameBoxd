import React from 'react';
import { Link } from 'react-router-dom';
import PopularGames from './PopularGames';
import NewGames from './NewGames';
import RecentReviews from './RecentReviews';

const LoggedInHomeUI = () => {

  var _ud = localStorage.getItem('user_data');
  var ud = JSON.parse(_ud);
  var displayName = ud.displayName;


  return (
    <div style={{ textAlign: 'center' }}>
      <span className='text-white' style={{ fontSize: '24px' }}>Welcome {displayName}! Here is what we've been playing</span>
      <PopularGames />
      <NewGames />
      <RecentReviews />
    </div>
  );
}

export default LoggedInHomeUI;


