import React from "react";
import ReviewsIU from "./ReviewsUI";

function GameDetails({ gameName, gameSummary, gameImage }) {

  return (
    <div className="details-container text-white row px-12 mt-4">
      <img className=" rounded px-0 me-4 w-25 " src={gameImage} alt={gameName} />
      <div className=" col-5 ">
        <h1 className="display-2 fw-bold text-uppercase">{gameName}</h1>
        <p className="fs-5">{gameSummary}</p>
      </div>
      <ReviewsIU />

    </div>
  );

}

export default GameDetails;