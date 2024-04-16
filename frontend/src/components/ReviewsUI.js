import React, { useState, useEffect } from "react";

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
              <p style={{ fontSize: '14px' }}><strong></strong> {review.displayName} {Array.from({ length: review.rating }, (_, i) => <span key={i}>★</span>)}</p>
              <p>{review.textBody}</p>
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


