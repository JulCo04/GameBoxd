import React from "react";
import "./HomePageInfoBoxes.css";

function HomePageInfoBoxes()
{
    return(
        <div className="row mt-6 justify-items-center ">
            <p className="text-start mb-n3 text-light fw-semibold">With GameGrid you can...</p>
            <div className="InfoBox col rounded bg-secondary my-4 mx-2">
                <img className="mx-auto my-3 d-block" src="writing.svg"></img>
                <p className="BoxText fw-semibold text-center ">Keep track of every game you’ve played, are currently playing, and want to play.</p>
            </div>
            <div className="InfoBox col rounded bg-secondary my-4 mx-2">
                <img className="mx-auto my-3 d-block" src="star.svg"></img>
                <p className="BoxText fw-semibold text-center ">Review and rate games while also being able to see what everyone else thinks.</p>
            </div>
            <div className="InfoBox col rounded bg-secondary my-4 mx-2">
                <img className="mx-auto my-3 d-block" src="friends.svg"></img>
                <p className="BoxText fw-semibold text-center ">Add your friends and see their own games lists and reviews.</p>
            </div>
        </div>
    );

}

export default HomePageInfoBoxes;