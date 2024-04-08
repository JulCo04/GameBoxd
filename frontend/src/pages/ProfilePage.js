import React, { useState, useEffect } from 'react';
import LoggedInNavBar from "../components/LoggedInNavBar";
import ProfileUI from "../components/ProfileUI";
import Settings from '../components/Settings';

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
      <div className="center-container">
        {showForm === 'settings' &&
            <Settings onExitClick={() => setShowForm(null)} currentEmail={userData.email} currentDisplayName={userData.displayName}/>
        }
      </div>
      <div className="container row mx-13 border text-white justify-content-evenly">
        <div className="border border-primary col ">
          Content
        </div>
        <div className="border border-primary col-4 ">
          Content
        </div>

      </div>
    </div>
  );

};

export default ProfilePage;