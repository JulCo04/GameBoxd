import React from "react";
import HomePageInfoBoxes from "./HomePageInfoBoxes/HomePageInfoBoxes";

function HomePageUI({onLoginClick, onRegisterClick})
{
    return(
        <>

        <div className="container text-white">
            <div className="col" align="center">
                <h1 className="display-title fw-bold mt-5 mb-0"><strong>GamerGrid</strong></h1>
                <p className="fs-3 fw-semibold">
                    Never forget your games <br />
                    Save what you want to play next <br />
                    Tell your friends what they have to check out <br />
                </p>
                <button type="button" className="btn btn-primary text-white fw-semibold" onClick={onRegisterClick}>Create a free account</button><br/>
                <button type="button" className="btn btn-link fw-light text-white" onClick={onLoginClick}>or <span className="fw-normal">log in</span></button>
                <HomePageInfoBoxes />
            </div>
        </div>

        </>
    );
}

export default HomePageUI;