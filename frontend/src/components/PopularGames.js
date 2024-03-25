import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PopularGames = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGames();
  });
  
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

  const loadGames = async () => {
    try {
        const limit = 12;
        const offset = 0;
        const response = await fetch(buildPath("api/games"), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({limit, offset})
        });

        if (!response.ok) {
            throw new Error('Failed to fetch games');
        }
        const gamesData = await response.json();
        
        setGames(gamesData);
    } catch (error) {
        console.error('Error fetching games:', error.message);
        setError('Failed to fetch games. Please try again later.');
    }
  };

  const parseCoverUrl = (url) => {
    return url.replace('t_thumb', 't_cover_big');
  };
 
  return (
    <div>
    
        <h1 className="page-title">Popular Games</h1>
        <div className="games-horizontal">
        {games.map((game) => (
                    <div className="game-card" key={game.id}>
                        <Link to={{
                            pathname: `/games/${game.name}/${game.id}`,    
                        }}>
                            <div
                                className="game-image"
                                style={{
                                    backgroundImage: `url(${game.cover ? parseCoverUrl(game.cover.url) : 'placeholder_url'})`, // Check if cover exists before accessing url
                                }}
                            ></div>
                            <h3>{game.name}</h3>
                        </Link>
                    </div>
                ))}
        </div>
    </div>
    
  );
}

export default PopularGames;