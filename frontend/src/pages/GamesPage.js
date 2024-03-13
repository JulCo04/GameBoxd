import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoggedInNavBar from '../components/LoggedInNavBar';

const genresData = [
  { id: 4, name: 'Action', slug: 'action' },
  { id: 51, name: 'Indie', slug: 'indie' },
  { id: 3, name: 'Adventure', slug: 'adventure' },
  { id: 10, name: 'Strategy', slug: 'strategy' },
  { id: 2, name: 'Shooter', slug: 'shooter' },
  { id: 40, name: 'Casual', slug: 'casual' },
  { id: 14, name: 'Simulation', slug: 'simulation' },
  { id: 7, name: 'Puzzle', slug: 'puzzle' },
  { id: 11, name: 'Arcade', slug: 'arcade' },
  { id: 83, name: 'Platformer', slug: 'platformer' },
  { id: 1, name: 'Racing', slug: 'racing' },
  { id: 59, name: 'Massively Multiplayer', slug: 'massively-multiplayer' },
  { id: 15, name: 'Sports', slug: 'sports' },
  { id: 6, name: 'Fighting', slug: 'fighting' },
  { id: 19, name: 'Family', slug: 'family' },
  { id: 28, name: 'Board Games', slug: 'board-games' },
  { id: 34, name: 'Educational', slug: 'educational' },
  { id: 17, name: 'Card', slug: 'card' }
];

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 12;
  const API_KEY = process.env.API_KEY
  useEffect(() => {
    loadGames();
  }, [currentPage, filter, selectedGenre]);

  async function loadGames() {
    let url = `https://api.rawg.io/api/games?key=7c58f099418e411c90980dce79d165f2&page_size=${pageSize}&page=${currentPage}`;

    if (filter) {
      url += `&dates=${filter}-01-01,${filter}-12-31&ordering=-added`;
    }
    if (selectedGenre) {
      url += `&genres=${selectedGenre}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setGames(data.results);
    } catch (error) {
      console.error("An error occurred while fetching games:", error);
    }
  }

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setSelectedGenre('');
    setShowFilters(true);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="page-container">
      <LoggedInNavBar/>
      <div className="top-games-container">
        <h1 className="page-title">Popular Games</h1>
        <div className="filter-container">
          <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>Filter by Genre</button>
          {showFilters && (
            <select className="genre-dropdown" value={selectedGenre} onChange={handleGenreChange}>
              <option value="">Select Genre</option>
              {genresData.map(genre => (
                <option key={genre.id} value={genre.slug}>{genre.name}</option>
              ))}
            </select>
          )}
          {selectedGenre && (
            <button className="clear-button" onClick={handleClearFilters}>Clear Filter</button>
          )}
        </div>
        <div className="games-grid">
          {games.map(game => (
            <div className="game-card" key={game.id}>
              <Link to={`/games/${game.name}`}>
                <div className="game-image" style={{ backgroundImage: `url(${game.background_image})` }}></div>
                <h3>{game.name}</h3>
                
              </Link>
            </div>
          ))}
        </div>
        <div className="pagination">
          <button className="page-button" onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
          <button className="page-button" onClick={handleNextPage}>Next</button>
          <span className="current-page">Page {currentPage}</span>
        </div>
      </div>
    </div>
  );
}

export default GamesPage;
