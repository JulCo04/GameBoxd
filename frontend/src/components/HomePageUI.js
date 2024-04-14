import React from "react";
import HomePageInfoBoxes from "./HomePageInfoBoxes/HomePageInfoBoxes";
import PopularGames from "./PopularGames";

function HomePageUI({onLoginClick, onRegisterClick})
{
    return(
        <>

        <div className="container text-white">
            <div className="col" align="center">
                <img src="controllericon1.png" width="250" className="mt-n5 mb-n5"></img>
                <h1 className="display-title fw-bold mt-0 mb-0"><strong>GameGrid</strong></h1>
                <p className="fs-3 fw-semibold">
                    Never forget your games <br />
                    Save what you want to play next <br />
                    Tell your friends what they have to check out <br />
                </p>
                <button type="button" className="btn btn-primary text-white fw-semibold" onClick={onRegisterClick}>Create a free account</button><br/>
                <button type="button" className="btn btn-link fw-light text-white" onClick={onLoginClick}>or <span className="fw-normal">log in</span></button>
                <PopularGames />
                <HomePageInfoBoxes />
            </div>
        </div>

        </>
    );


    
}

export default HomePageUI;