import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PopularGames = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGames();
  }, []);

  const app_name = 'g26-big-project-6a388f7e71aa';
  
  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    } else {
      return 'http://localhost:5000/' + route;
    }
  }

  const loadGames = async () => {
    try {
      const limit = 12;
      const offset = 0;
      const newReleases = true; // Set flag for new releases
      const response = await fetch(buildPath("api/games"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limit, offset, newReleases }) // Include newReleases flag in request body
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
    <div className='games-horizontal'>
      <h1 className="page-title" style={{ textAlign: 'left' }}>New Games</h1>
      <div style={{ borderBottom: '1px solid #ccc', margin: '5px 0 20px' }} /> {/* Line under Popular Games */}
      <div className="games-scrollable">
        {games.map((game) => (
          <div className="game-card" key={game.id}>
            <Link to={{
              pathname: `/games/${game.name}/${game.id}`,
            }}>
              <img
                src={game.cover ? parseCoverUrl(game.cover.url) : 'placeholder_url'}
                alt={game.name}
                className="img-fluid height-10"
                style={{ maxHeight: '200px' }}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularGames;




  