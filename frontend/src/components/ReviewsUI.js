import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

function ReviewsIU() {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  const app_name = 'g26-big-project-6a388f7e71aa'

  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    } else {
      return 'http://localhost:5000/' + route;
    }
  }

  async function fetchReviews() {
    const url = window.location.href;
    const videoGameId = url.substring(url.lastIndexOf('/') + 1);
    try {
      const response = await fetch(buildPath('api/getReviews'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ videoGameId: videoGameId })
      });
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setReviews(data.reviews);
      }
    } catch (error) {
      setError('An error occurred while fetching reviews.');
    }

    
  }

  useEffect(() => {
    fetchReviews();
  }, []); 

  return (
    <div className="details-reviews pt-4 px-0">
      <h1 className="">Reviews</h1>
      <hr className="opacity-50" />
      {error && <p>{error}</p>}
      {reviews.length > 0 ? (
        <div>
          {reviews.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-item" style={{ color: 'white', textAlign: 'left' }}>
                <Link className="link d-inline-flex" to={{
                  pathname: `/Profile/${review.displayName}`,
                }}>
                <img className="my-auto me-2" width="" height="" src="/user.svg" style={{ height: '20px', width: 'auto' }} />
                <p style={{ fontSize: '20px',  textAlign: 'left', margin: '0' }}><strong>{review.displayName}</strong> {Array.from({ length: review.rating }, (_, i) => <span key={i} style={{ fontSize: '24px', color: '#0A9396' }}>★</span>)}</p>
                </Link>
                <p style={{ textAlign: 'left', fontSize: '18px', margin: '5px 0 0', color: 'lightgray'}}>{review.textBody}</p>
              </div>
              {index !== reviews.length - 1 && <hr className="opacity-50" />}
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews available.</p>
      )}
    </div>
  );
}

export default ReviewsIU;


