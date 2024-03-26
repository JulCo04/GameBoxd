import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoggedInNavBar from '../components/LoggedInNavBar';
import GameDetails from '../components/GameDetails';

const app_name = 'g26-big-project-6a388f7e71aa'
  function buildPath(route) {
      console.log("ENVIRONMENT " + process.env.NODE_ENV);
      if (process.env.NODE_ENV === 'production') {
          console.log('https://' + app_name + '.herokuapp.com/' + route);
          return 'https://' + app_name + '.herokuapp.com/' + route;
      }
      else {
          console.log('http://localhost:5000/' + route);
          return 'http://localhost:5000/' + route;
      }
}

const GameDetailPage = () => {
  const { gameName, gameId } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    console.log("GAME NAME: ", gameName);
    console.log("GAME ID: ", gameId);
    const fetchGameDetails = async () => {
      try {
        const response = await fetch(buildPath("api/games/gameName"), {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({gameName : gameName, gameId : gameId})
      });
        if (!response.ok) {
          throw new Error('Failed to fetch game details');
        }
        const gameData = await response.json();
        
        setGame(gameData[0]); // Assuming the API returns an array with a single game object
        setLoading(false);
      } catch (error) {
        console.error('Error fetching game details:', error.message);
      }
    };

    fetchGameDetails();
  }, [gameName, gameId]);

  // Loading state
  if (loading) {
    return <div className="page-container"> 
              <LoggedInNavBar />
            </div>
  }

  const parseCoverUrl = (url) => {
    return url.replace('t_thumb', 't_cover_big');
  };

  // Render game details
  return (
    <div className="page-container"> 
      <LoggedInNavBar />
      <GameDetails
        gameName={game.name}
        gameSummary={game.summary}
        gameImage={game.cover ? parseCoverUrl(game.cover.url) : 'placeholder_url'}
      />
    </div>
  );
};

export default GameDetailPage;
