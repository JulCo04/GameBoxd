import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GameDetailPage = () => {
  // Fetching gameName from URL parameters
  const { gameName } = useParams();

  // State variables for game details and loading status
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch game details
    async function fetchGameDetails() {
      try {
        // Fetching the game ID first
        const idResponse = await fetch(`https://api.rawg.io/api/games?search=${gameName}&key=7c58f099418e411c90980dce79d165f2`);
        if (!idResponse.ok) {
          throw new Error('Failed to fetch game ID');
        }
        const idData = await idResponse.json();

        // Check if game is found
        if (idData.results.length === 0) {
          throw new Error('Game not found');
        }
        const gameId = idData.results[0].id;

        // Fetching game details using the game ID
        const detailsResponse = await fetch(`https://api.rawg.io/api/games/${gameId}?key=7c58f099418e411c90980dce79d165f2`);
        if (!detailsResponse.ok) {
          throw new Error('Failed to fetch game details');
        }
        const detailsData = await detailsResponse.json();

        // Extracting only the English description from the provided HTML
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(detailsData.description, 'text/html');
        const englishDescription = htmlDoc.querySelector('p').textContent;

        // Setting game state with fetched data
        setGame({ name: gameName, description: englishDescription, image: detailsData.background_image });
        setLoading(false);
      } catch (error) {
        console.error(error);
        // Handle error state
      }
    }

    // Call the fetchGameDetails function
    fetchGameDetails();
  }, [gameName]);

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render game details
  return (
    <div className="details-container">
      <img className="details-image" src={game.image} alt={game.name} />
      <div className="details-content">
        <h1>{game.name}</h1>
        <p>{game.description}</p>
        <div className="details-reviews">Reviews</div>
      </div>
    </div>
  );
};

export default GameDetailPage;
