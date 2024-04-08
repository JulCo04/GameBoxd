import React from "react";

function ProfileUI({ displayName, onSettingsClick}) {

  // console.log(displayName);

  return(
    <div className="container mx-13 text-white mt-4">
      <div className="d-flex ">
        <img className="me-4" src="profile.svg" />
        <h1 className="col-auto my-auto">{displayName}</h1>
        <button className="btn btn-primary ms-auto my-auto mb-0 h1 px-2 py-0" onClick={onSettingsClick}>
          <i className="bi bi-gear fs-3" style={{color: "white"}} />
        </button>
      </div>
      <hr className="opacity-50 "/>
    </div>
  );

};

export default ProfileUI;