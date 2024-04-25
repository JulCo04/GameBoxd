import React, { useState, useEffect } from "react";
import ReviewsIU from "./ReviewsUI";
import StarRating from './StarRating'; // Adjust the path as per your project structure
import Login from "./Login"; // Import the Login component
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';

function GameDetails({ gameName, gameId, gameReleaseDate, gameSummary, gameImage, gameCreators, gamePlatforms }) {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false); // Changed initial state to false
  const [formattedReleaseDate, setFormattedReleaseDate] = useState('');
  const [reviewStats, setReviewStats] = useState({ reviewCount: 0, rating: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track user login status
  const [buttonText, setButtonText] = useState("Add to list");
  const [gameInLibrary, setGameInLibrary] = useState(false);
  


  useEffect(() => {
    var utcSeconds = gameReleaseDate;
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(utcSeconds);
  
    var date = d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
    setFormattedReleaseDate(date);
  
    fetchReviewStats();
  
    const userData = localStorage.getItem('user_data');
    if (userData) {
      setIsLoggedIn(true);
  
      // Fetch user's games to check if the current game is in the library
      const userDataObj = JSON.parse(userData);
      const userId = userDataObj.id;
  
      const fetchUserGames = async () => {
        try {
          const response = await fetch(buildPath(`api/user/games/${userId}`));
          if (!response.ok) {
            throw new Error('Failed to fetch user games');
          }
          const data = await response.json();
          const userGames = data.games || [];
          // Check if the current game is in the user's library
          const gameIsInLibrary = userGames.includes(gameId);
          setGameInLibrary(gameIsInLibrary);
          
          if (gameIsInLibrary === true) {
            setButtonText("Remove from list");
          } else {
            setButtonText("Add to list");
          }

        } catch (error) {
          console.error('Error fetching user games:', error);
        }
      };
  
      fetchUserGames();
    } else {
      setIsLoggedIn(false);
    }
  }, [gameReleaseDate]);

  const app_name = 'g26-big-project-6a388f7e71aa';

  function buildPath(route) {
    console.log("ENVIRONMENT " + process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'production') {
      console.log('https://' + app_name + '.herokuapp.com/' + route);
      return 'https://' + app_name + '.herokuapp.com/' + route;
    } else {
      console.log('http://localhost:5000/' + route);
      return 'http://localhost:5000/' + route;
    }
  }

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const submitReview = async () => {
    try {

      if (rating === 0) {
        toast.info("Please select a rating before submitting your review.", {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
          });
        return; // Prevent submission if no rating is selected
      }
      
      if ((reviewText.trim().split(/\s+/).length < 1) || (reviewText === '')) {
        toast.info("Please write a review.", {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
          });
        return; // Prevent submission if review text has less than 5 words
      }
  
      const userData = localStorage.getItem('user_data');
      const userDataObj = JSON.parse(userData);
      const displayName = userDataObj.displayName;
  
      // Call addGame API to add the game to the user's library
      const addGameResponse = await fetch(buildPath("api/addGame"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userDataObj.email, // Assuming you have the user's email in the localStorage
          videoGameId: gameId
        })
      });
  
      if (!addGameResponse.ok) {
        throw new Error('Failed to add game to library');
      }
  
      // Submit review after adding the game to the library
      const response = await fetch(buildPath("api/reviews"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          displayName: displayName,
          textBody: reviewText,
          rating: rating,
          videoGameId: gameId,
          videoGameName: gameName
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
  
      const data = await response.json();
  
      if (data.error) {
        throw new Error(data.error);
      }
  
      setReviews([...reviews, {
        displayName: displayName,
        textBody: reviewText,
        rating: rating
      }]);
  
      toggleOverlay();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  
    window.location.reload();
  };
  

  const fetchReviewStats = async () => {
    try {
      const obj = { videoGameId: gameId };
      const js = JSON.stringify(obj);
      console.log("JS", js); // Fixed concatenation
  
      const response = await fetch(buildPath(`api/reviews/stats/${gameId}`), 
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }); // Removed body parameter
  
      if (!response.ok) {
        throw new Error('Failed to fetch review statistics');
      }
      const data = await response.json();
      setReviewStats(data);
    } catch (error) {
      console.error('Error fetching review statistics:', error);
    }
  };
  
  const toggleReview = () => {
    setShowReview(!showReview);
  };

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  // Extract company names and join them into a single string separated by commas
  const creatorsString = gameCreators.map(creator => creator.props.children).join(", ");
  const platformsString = gamePlatforms.map(platform => platform.props.children).join(", ");

  const addToLibrary = async () => {
    
    try {
      const userData = localStorage.getItem('user_data');
      const userDataObj = JSON.parse(userData);
  
      const addGameResponse = await fetch(buildPath("api/addGame"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userDataObj.email,
          videoGameId: gameId
        })
      });
  
      if (!addGameResponse.ok) {
        throw new Error('Failed to add game to library');
      }
  
      const data = await addGameResponse.json();

      if (data.error === "Game successfully added to your library!") {
        // Display a notification that the game is already in the library
        toast.info("Game successfully added to your library!", {
          position: "top-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Slide,
          });
      } 

      if (data.error) {
        throw new Error(data.error);
      }  
      console.log('Game added to library successfully:', data);
      setButtonText('Remove from list');
      setGameInLibrary(true);
    } catch (error) {
      setButtonText('Remove from list');
      setGameInLibrary(true);
    }
  };

  const removeFromLibrary = async () => {

    try {

      const userData = localStorage.getItem('user_data');
      const userDataObj = JSON.parse(userData);
      const userId = userDataObj.id;

      const deleteGameResponse = await fetch(buildPath(`api/user/games/${userId}/${gameId}`), {
        method: 'DELETE'
      });
  
      if (!deleteGameResponse.ok) {
        throw new Error('Failed to remove game from library');
      }

      toast.info("Game removed from your library!", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
        });
      setGameInLibrary(false);
      setButtonText('Add to list');
    } catch(error) {
      console.error(error);
    }



  }

  const addRemoveGame = async () => {

    if (gameInLibrary) {
      removeFromLibrary();
    } else {
      addToLibrary();
    }

  }

  const [showLoginOverlay, setShowLoginOverlay] = useState(false);

  const handleLoginClick = () => {
    setShowLoginOverlay(true);
  };

  return (
    <>
      {showOverlay && (
        <div className="review-overlay"> 
          <div className="review-overlay-content">
            <h1 className="text-white mb-4 fw-bold">Add a Review</h1>

            <div className="form-group">
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

      {showLoginOverlay && (
        <div className="review-overlay">
            <Login onExitClick={() => setShowLoginOverlay(false)} />
        </div>
      )}


      <div className="details-container text-white row px-12 mt-4">
        <div className="col-md-3">
          <img className="rounded w-100" src={gameImage} alt={gameName} />
          <hr></hr>
          <div className="mt-3 d-flex align-items-center justify-content-evenly">
            <p className="font-weight-bold">{reviewStats.reviewCount} total reviews</p>
            <div className="d-flex">
            <img src="/mario-star.png" style={{ width: '20px' }} />
            <p className="font-weight-bold ms-1">{reviewStats.rating !== null ? (reviewStats.rating !== 0 ? reviewStats.rating.toFixed(2) + " / 5" : "Unrated") : "Unrated"}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="details-content">
            <h1 className="display-2 fw-bold text-uppercase fs-1">{gameName} <span className="fs-6" style={{fontSize: 'small', fontWeight: 'normal'}}>{formattedReleaseDate}</span></h1>
            <p className="fs-6">{gameSummary}</p>
            <div>
              <h6>Developed by:</h6>
              <span>{creatorsString}</span>
            </div>
            <div>
              <h6 style={{ marginTop: '8px' }}>Platforms:</h6>
              <span>{platformsString}</span>
            </div>
          </div>
        </div>

        <div className="col-md-3 d-flex flex-column justify-content-center align-items-center mx-auto my-auto">
          {isLoggedIn ? (
            <>
              <button className="btn btn-primary text-white w-10 fs-5 mb-3 mt-3" style={{ width: '175px' }} onClick={toggleOverlay}>Add a Review</button>
              <button className="btn btn-primary text-white w-10 fs-5 mb-3 mt-3" style={{ width: '175px' }} onClick={addRemoveGame}>{buttonText}</button>
            </>
          ) : (
            <>
              <p className="btn btn-primary text-white w-10 fs-5 mb-3 mt-3" onClick={handleLoginClick}>Login to log, and review.</p> {/* Added onClick event */}           
            </>
          )}
        </div>

        <ReviewsIU />
        
      </div>
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide} // Pass Slide component as the value for the transition prop
      />

    </>
  );
}

export default GameDetails;
