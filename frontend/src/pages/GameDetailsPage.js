import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoggedInNavBar from '../components/LoggedInNavBar';
import NavigationBar from '../components/NavigationBar';
import GameDetails from '../components/GameDetails';
import Login from '../components/Login'; // Assuming Login and Register components are imported
import Register from '../components/Register'; // Assuming Login and Register components are imported

const app_name = 'g26-big-project-6a388f7e71aa';

function buildPath(route) {
  console.log("ENVIRONMENT " + process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'production') {
    console.log('https://' + app_name + '.herokuapp.com/' + route);
    return 'https://' + app_name + '.herokuapp.com/' + route;
  } else {
    console.log('http://localhost:5000/' + route);
    return 'http://localhost:5000/' + route;
  }
}

const GameDetailPage = () => {
  const { gameName, gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    console.log("GAME NAME: ", gameName);
    console.log("GAME ID: ", gameId);

    // Some games don't have some of this data, so it was crashing the site on load.
    // This function checks if any of the game data doesn't exist, and if it doesn't then
    // it provides some dummy data to allow the page to load.
    const checkGameData = (gameData) => {

      if (!gameData.involved_companies) {
        gameData.involved_companies = [{company: {name: "N/A"}}];
      }

      if (!gameData.platforms) {
        gameData.platforms = [{name: "N/A"}];
      }

      return gameData
    }

    const fetchGameDetails = async () => {
      try {
        const response = await fetch(buildPath("api/games/gameName"), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ gameName: gameName, gameId: gameId })
        });
        if (!response.ok) {
          throw new Error('Failed to fetch game details');
        }
        let gameData = await response.json();

        gameData = checkGameData(gameData[0]);

        console.log(gameData);
        setGame(gameData); // Assuming the API returns an array with a single game object
        setLoading(false);
      } catch (error) {
        console.error('Error fetching game details:', error.message);
      }
    };

    fetchGameDetails();
  }, [gameName, gameId]);

  const parseCoverUrl = (url) => {
    return url.replace('t_thumb', 't_cover_big');
  };

  const toggleForm = (form) => {
    console.log("Current Form Status:", form)
    setShowForm(form);
    logClick(form);
  };

  const logClick = (action) => {
    console.log(`${action} clicked!`);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="page-container">
        {isLoggedIn ? <LoggedInNavBar /> : <NavigationBar />}
      </div>
    );
  }


  // Render game details
  return (
    <div className="page-container">
      {isLoggedIn ? (
        <LoggedInNavBar />
      ) : (
        <NavigationBar
          onLoginClick={() => toggleForm('login')}
          onRegisterClick={() => toggleForm('register')}
        />
      )}

      <div className="center-container">
        {showForm === 'login' && <Login onExitClick={() => setShowForm(null)} />}
        {showForm === 'register' && <Register onExitClick={() => setShowForm(null)} />}
      </div>

      <GameDetails
        gameName = {gameName}
        gameId = {gameId}
        gameReleaseDate = {game.first_release_date}
        gameSummary = {game.summary}
        gameImage = {game.cover ? parseCoverUrl(game.cover.url) : 'placeholder_url'}
        gameCreators={game.involved_companies.map(company => (
          <div key={company.id}>{company.company.name}</div>
        ))}
        gamePlatforms={game.platforms.map(platform => (
          <div key={platform.id}>{platform.name}</div>
        ))}
      />

      <div className="mb-5"></div>
    </div>
  );
};

export default GameDetailPage;

