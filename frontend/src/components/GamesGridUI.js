import React from "react";
import { Link } from 'react-router-dom';

const parseCoverUrl = (url) => {
  return url.replace('t_thumb', 't_cover_big');
};

function GamesGridUI({games}) {

  return (
    <div className="games-grid">
      {games.map((game) => (
        // if(games.length === 0)
        // { <div>No Results Found</div>}
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
            <h3 className="fs-5">{game.name}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default GamesGridUI;