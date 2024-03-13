import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PopularGames = () => {
  const [games, setGames] = useState([]);
  const pageSize = 10;

  useEffect(() => {
    loadGames();
  });

  async function loadGames() {
    let url = `https://api.rawg.io/api/games?key=7c58f099418e411c90980dce79d165f2&page_size=${pageSize}}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setGames(data.results);
    } catch (error) {
      console.error("An error occurred while fetching games:", error);
    }
  }
 
  return (
    <div>
    
        <h1 className="page-title">Popular Games</h1>
        <div className="games-horizontal">
            {games.map(game => (
            <div className="game-card" key={game.id}>
                <Link to={`/games/${game.name}`}>
                <div className="game-image" style={{ backgroundImage: `url(${game.background_image})` }}></div>
                <h3>{game.name}</h3>
                </Link>
            </div>
            ))}
        </div>
    </div>
    
  );
}

export default PopularGames;