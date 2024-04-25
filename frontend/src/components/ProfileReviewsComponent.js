import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

const ProfileReviewsComponent = ({ formToggler }) => {
  const [reviewsFullInfo, setReviewsFullInfo] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReviews = async () => {
      await fetchReviews();
      await fetchGamesById();
      mergeReviewsInfo();
    }

    loadReviews();
  }, []);

  const parseCoverUrl = (url) => {
    return url.replace('t_thumb', 't_cover_big');
  };

  const app_name = 'g26-big-project-6a388f7e71aa'
  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    }
    else {
      return 'http://localhost:5000/' + route;
    }
  }

  let _reviews;
  let _reviewedGamesIds;
  let _reviewedGamesData;
  let _reviewsFullInfo;

  const fetchReviews = async () => {

    let userData = JSON.parse(localStorage.getItem('user_data'));
    let userDisplayName = userData.displayName;


    try {
      const response = await fetch(buildPath("api/reviews/search/" + userDisplayName));

      let res = JSON.parse(await response.text());

      if (res.error) {
        console.log("There was an error in fetchReviews(): " + res.error);
        return;
      }

      _reviews = res.reviews;

      let arr = [];
      for (let i = 0; i < _reviews.length; ++i) {
        arr.push(_reviews[i].videoGameId);
      }
      _reviewedGamesIds = [...arr];

    } catch (e) {
      alert(e.toString() + "fetchReviews()");
      return;
    }

  }

  const fetchGamesById = async () => {
    let gameIds = _reviewedGamesIds;

    if (!gameIds.length) {
      return;
    }

    try {
      const limit = 0;
      const offset = 0;

      const response = await fetch(buildPath("api/games"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limit, offset, gameIds })
      });


      if (!response.ok) {
        throw new Error("Failed to fetch game");
      }
      const gameData = await response.json();

      _reviewedGamesData = gameData;

    }
    catch (e) {
      console.error("Error fetching games:", error.message);
      setError("Failed to fetch games. Please try again later.");
    }

  }

  const mergeReviewsInfo = () => {
    let arr = [];
    for (let i = 0; i < _reviews.length; ++i) {
      for(let j = 0; j < _reviewedGamesData.length; ++j) {

        if(_reviews[i].videoGameId == _reviewedGamesData[j].id) {
          let obj = { ..._reviews[i], name: _reviewedGamesData[j].name, cover: _reviewedGamesData[j].cover, first_release_date: _reviewedGamesData[j].first_release_date };
          arr.push(obj)
          break;
        }

      }
    }

    _reviewsFullInfo = [...arr];
    _reviewsFullInfo = _reviewsFullInfo.reverse();
    setReviewsFullInfo(_reviewsFullInfo);
  }

  const formatReviewDateWritten = (date) => {

    let formattedDate = new Date(date);
    formattedDate = formattedDate.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    return formattedDate;
  }

  return (
    <div className="me-4">
      <div className="d-flex justify-content-between ">
        <span className="my-auto fw-semibold fs-3">Your Reviews</span>
        {/* <button onClick={() => formToggler('reviews')} className="btn btn-primary text-white fw-semibold">All</button> */}
      </div>

      <hr className="ps-0 mt-2 opacity-50" />
      <div className="overflow-scroll " style={{height: '60vh'}}>
        {reviewsFullInfo.map((review) => (
          <>
          <div className="d-flex mb-4">
            <div className="game-card mb-auto">
              <Link to={{
                pathname: `/games/${review.name}/${review.videoGameId}`,
              }}>
                <img
                  src={review.cover ? parseCoverUrl(review.cover.url) : 'placeholder_url'}
                  alt={review.name}
                  className="img-fluid "
                  style={{ height: "140px" }}
                />
              </Link>
            </div>

            <div className="ms-4 my-auto">
              <p className="fw-semibold fs-3 mb-n1" >
                <Link className="link" to={{pathname: `/games/${review.name}/${review.videoGameId}`,}}> {review.name} ({new Date(review.first_release_date * 1000).getFullYear()}) 
                </Link>
              </p>
              <p className="fs-5 fw-light ">{Array.from({ length: review.rating }, (_, i) => <span key={i} style={{ color: '#0A9396'}}>★</span>)} Reviewed {formatReviewDateWritten(review.dateWritten)}</p>
              <p className="fs-5 ">{review.textBody} </p>
              {/* {index !== reviews.length - 1 && <hr className="opacity-50" />} */}
            </div>
          </div>
          <hr className="mx-1 mt-2 opacity-25"/>
          </>

        ))}
      </div>

    </div>
  );
}

export default ProfileReviewsComponent;