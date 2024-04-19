import React, { useState, useEffect } from 'react';
import LoggedInNavBar from "../components/LoggedInNavBar";
import ProfileUI from "../components/ProfileUI";
import Settings from '../components/Settings';
import ProfileFriendsComponent from '../components/ProfileFriendsComponent';
import UserLookUp from '../components/UserLookUp';
import ProfileReviewsComponent from '../components/ProfileReviewsComponent';

const ProfilePage = () => {
  const [showForm, setShowForm] = useState(null);
  let userData = JSON.parse(localStorage.getItem("user_data"));
  console.log(userData);

  const toggleForm = (form) => {
    console.log("Current Form Status:", form)
    setShowForm(form);
  };

  return(
    <div className="page-container">
      <LoggedInNavBar />
      <ProfileUI displayName={userData.displayName} onSettingsClick={()=>toggleForm('settings')}/>
      <div className="container-fluid text-white justify-content-evenly mt-n1">
        <div className="row mx-xxl-10 mx-xl-8 mx-5">

          <div className="col px-0">
            <ProfileReviewsComponent />
          </div>
          <div className="col-4 px-0 ">
            <ProfileFriendsComponent formToggler={toggleForm}/>
          </div>

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