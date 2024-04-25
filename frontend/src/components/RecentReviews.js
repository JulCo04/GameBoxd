import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function RecentReviews() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const debouncedFetch = debounce(fetchRecentReviews, 1000); // 1000ms debounce delay

    debouncedFetch();

    return () => {
      debouncedFetch.cancel(); // Clean up debounced function on component unmount
    };
  }, []);

  const app_name = 'g26-big-project-6a388f7e71aa';

  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    } else {
      return 'http://localhost:5000/' + route;
    }
  }

  const parseCoverUrl = (url) => {
    return url.replace('t_thumb', 't_cover_big');
  };

  const fetchRecentReviews = async () => {
    try {
      const response = await fetch(buildPath("api/getRecentReviews"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pageSize: 5 })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recent reviews');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Fetch game details for each review
      const reviewsWithDetails = await Promise.all(data.recentReviews.map(async review => {
        const gameResponse = await fetch(buildPath("api/games/gameName"), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ gameName: review.videoGameName, gameId: review.videoGameId })
        });
        if (!gameResponse.ok) {
          throw new Error('Failed to fetch game details');
        }
        const gameData = await gameResponse.json();
        const gameCoverUrl = parseCoverUrl(gameData[0].cover.url); // Transform cover URL
        return { ...review, gameCoverUrl };
      }));

      setReviews(reviewsWithDetails);
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div style={{ color: 'white', textAlign: 'left' }}>Error: {error}</div>;
  }

  function debounce(func, delay) {
    let timeoutId;
    function debounced(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    }
    debounced.cancel = () => {
      clearTimeout(timeoutId);
    };
    return debounced;
  }

  return (
    <div className='recent-reviews-div' style={{ textAlign: 'left' }}>
      <h1 className="page-title" style={{ textAlign: 'left', color: 'white' }}>Recent Reviews</h1>
      <div style={{ borderBottom: '1px solid #ccc', margin: '5px 0 20px' }} />
      {reviews.length > 0 ? (
        <div>
          {reviews.map((review, index) => (
            <div key={index} className="recent-review-content" style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
              <Link to={`/games/${review.videoGameName}/${review.videoGameId}`} style={{ flex: '1', marginRight: '20px', textDecoration: 'none', color: 'white' }}>
                <img className="review-game-card" src={review.gameCoverUrl} alt={review.videoGameName} />
              </Link>
              <div style={{ width: '100%' }}>
              <div>
                <Link to={`/games/${review.videoGameName}/${review.videoGameId}`} className="game-link">
                  <h3 className="fw-semibold" style={{ textAlign: 'left', fontSize: '24px', margin: '0', marginBottom: '5px', display: 'inline-block'}}>
                    {review.videoGameName}
                  </h3>
                </Link>
              </div>
              <div className="review-item" style={{ color: 'white', textAlign: 'left' }}>
                <p style={{ fontSize: '14px', color: 'lightgrey', textAlign: 'left', margin: '0' }}>
                  <Link className="user-link d-inline-flex" to={`/Profile/${review.displayName}`}>
                    <img className="my-auto me-2" width="" height="" src="/user.svg" style={{ height: '15px', width: 'auto' }} />
                    <p style={{ fontSize: '16px', textAlign: 'left', margin: '0'}}> <strong>{review.displayName}</strong> {Array.from({ length: review.rating }, (_, i) => <span key={i} style={{ fontSize: '20px', color: '#0A9396' }}>★</span>)} </p>
                  </Link>
                </p>               
                <p style={{ textAlign: 'left', fontSize: '15px', margin: '5px 0 0', color: 'lightgray'}}>{review.textBody}</p>
              </div>
            </div>
              {index !== reviews.length - 1 && <hr style={{color: 'white'}} />}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: 'white', textAlign: 'left' }}></p>
      )}
    </div>
  );
  
}

export default RecentReviews;
