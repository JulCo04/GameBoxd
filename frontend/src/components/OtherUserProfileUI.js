import React from "react";

function OtherUserProfileUI({ displayName }) {

  return (
    <div className="container-fluid text-white mt-4">
      <div className="d-flex mx-xxl-10 mx-xl-8 mx-5">
        <img className="me-4" src="/user.svg" />
        <h1 className="col-auto my-auto">{displayName}</h1>
      </div>
      <hr className="opacity-50 mx-xxl-10 mx-xl-8 mx-5" />
    </div>
  );

};

export default OtherUserProfileUI;