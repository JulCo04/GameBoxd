import React, { useState, useEffect } from 'react';
import LoggedInNavBar from "../components/LoggedInNavBar";
import ProfileUI from "../components/ProfileUI";
import Settings from '../components/Settings';
import ProfileFriendsComponent from '../components/ProfileFriendsComponent';
import UserLookUp from '../components/UserLookUp';
import ProfileReviewsComponent from '../components/ProfileReviewsComponent';
import ProfileGamesListComponent from '../components/ProfileGamesListComponent';

const ProfilePage = () => {
  const [showForm, setShowForm] = useState(null);
  let userData = JSON.parse(localStorage.getItem("user_data"));

  const toggleForm = (form) => {
    setShowForm(form);
  };

  return(
    <div className="page-container">
      <LoggedInNavBar />
      <ProfileUI displayName={userData.displayName} onSettingsClick={()=>toggleForm('settings')}/>
      <div className="container-fluid text-white justify-content-evenly mt-n1">
        <div className="row mx-xxl-10 mx-xl-8 mx-5">

          <div className="col px-0">
            <ProfileReviewsComponent formToggler={toggleForm} />
          </div>
          <div className="col-4 px-0 ">
            <ProfileFriendsComponent formToggler={toggleForm}/>
          </div>

          <div className="">
            <ProfileGamesListComponent />
          </div>

          {/* <hr className="mt-0 opacity-50"/> */}

        </div>
      </div>
      <div className="position-absolute top-0">
        {showForm === 'settings' &&
          <Settings onExitClick={() => setShowForm(null)} currentEmail={userData.email} currentDisplayName={userData.displayName}/>
        }
        {showForm === 'userLookup' &&
          <UserLookUp onExitClick={() => setShowForm(null)} />
        }
      </div>
    </div>
  );

};

export default ProfilePage;