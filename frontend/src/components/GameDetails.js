import React, { useState } from "react";
import ReviewsIU from "./ReviewsUI";
import StarRating from './StarRating'; // Adjust the path as per your project structure

function GameDetails({ gameName, gameId, gameSummary, gameImage, gameCreators, gamePlatforms }) {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false); // Changed initial state to false

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

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const submitReview = async () => {
    try {
      console.log(reviewText);
      console.log(rating);
      console.log(gameId);
      const response = await fetch(buildPath("api/reviews"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          textBody: reviewText,
          rating: rating,
          videoGameId: gameId // You need to define videoGameId
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
  
      const data = await response.json();
      // Handle response, maybe show a success message
    } catch (error) {
      // Handle error, maybe show an error message
      console.error('Error submitting review:', error);
    }
  };

  const toggleReview = () => {
    setShowReview(!showReview);
  };

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  return (
    <>
      {showOverlay && (
        <div className="review-overlay"> 
          <div className="review-overlay-content">
            <h1 className="text-white mb-4 fw-bold">Add a Review</h1>
            
            

            <div className="form-group">
              {/* Your form elements for review input */}
              <button className="exit-button" onClick={toggleOverlay}>
                <img src="/x-button.png" alt="EXIT"></img>
              </button>
              <textarea
              className="form-control mb-3"
              placeholder="Write your review..."
              value={reviewText}
              onChange={handleReviewTextChange}
              />
              <div> 
                <span className="text-white">Rating</span>
                <StarRating
                  value={rating}
                  onClick={(value) => setRating(value)}
                />
              </div>
              
            </div>

            <input type="submit" className="btn btn-primary text-white w-100 fs-5" value="Submit Review" onClick={submitReview} />
          </div>
        </div>
      )}


      <div className="details-container text-white row px-12 mt-4">

        {/* game image */}
        <div className="col-md-3">
          <img className="rounded w-100" src={gameImage} alt={gameName} />
        </div>

        {/* game description */}
        <div className="col-md-5">
          <div className="details-content">
            <h1 className="display-2 fw-bold text-uppercase">{gameName}</h1>
            <p className="fs-5">{gameSummary}</p>
            <div>
              <h6>Developed by:</h6>
              <span>{gameCreators}</span>
            </div>
            <div>
              <h6>Platforms:</h6>
              <span>{gamePlatforms}</span>
            </div>
          </div>
        </div>

        {/* review items */}
        <div className="col-md-3 d-flex flex-column justify-content-center align-items-center mx-auto my-auto">
          <button className="btn btn-primary text-white w-10 fs-5 mb-3 mt-3" style={{ width: '150px' }} onClick={toggleOverlay}>Add a Review</button>
          <button className="btn btn-primary text-white w-10 fs-5 mb-3 mt-3" style={{ width: '150px' }}>Add to List</button>
        </div>

        <ReviewsIU />
      </div>
    </>
  );
}

export default GameDetails;



{/* <button className="btn btn-primary mt-4 text-white" onClick={toggleReview}>
          {showReview ? 'Close' : 'Make a Review'}
        </button>
        {showReview && (
          <>
            <textarea
              className="form-control mb-3"
              placeholder="Write your review..."
              value={reviewText}
              onChange={handleReviewTextChange}
            />
            <span>Rating</span>
            <StarRating
              value={rating}
              onClick={(value) => setRating(value)}
            />
            <button className="btn btn-primary mt-4" onClick={submitReview}>Submit Review</button>
            <button className="btn btn-primary mt-4" >Add To Watchlist</button>
          </>
        )}
        <button className="btn btn-primary mt-4 text-white">Add to Watchlist</button> */}