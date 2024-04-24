import React, { useState, useEffect } from 'react';
import LoggedInNavBar from '../components/LoggedInNavBar';
import NavigationBar from '../components/NavigationBar';
import OtherUserProfileUI from '../components/OtherUserProfileUI';
import OtherUserProfileFriendsComponent from '../components/OtherUserProfileFriendsComponent';
import OtherUserProfileReviewsComponent from '../components/OtherUserProfileReviewsComponent';
import OtherUserProfileGamesListComponent from '../components/OtherUserProfileGamesListComponent';
import { useParams } from 'react-router-dom';

const OtherUserProfilePage = () => {
  const { userName } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showForm, setShowForm] = useState(null);
  const [userProfileData, setUserProfileData] = useState(null);

  let _userProfileData = null;

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
      getUserProfileData();
  }, [userName]); 

  const app_name = 'g26-big-project-6a388f7e71aa'
  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    }
    else {
      return 'http://localhost:5000/' + route;
    }
  }

  const getUserProfileData = async () => {

    let obj = { displayName: userName }
    let js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath("api/searchusers"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: js 
      });

      let res = JSON.parse(await response.text());

      if(res.error) {
        console.log("There was an error in fetchUsers(): " + res.error);
        return;
      }

      _userProfileData = res.user;
      setUserProfileData(res.user);

    } catch (e) {
      alert(e.toString());
      return;
    }
  }

  const toggleForm = (form) => {
    console.log("Current Form Status:", form)
    setShowForm(form);
    logClick(form);
  };

  const logClick = (action) => {
    console.log(`${action} clicked!`);
  };

  return(
    <div className="page-container">
      {isLoggedIn ? (
        <LoggedInNavBar />
      ) : (
        <NavigationBar
          onLoginClick={() => toggleForm('login')}
          onRegisterClick={() => toggleForm('register')}
        />
      )}

      <OtherUserProfileUI displayName={userName} />
      <div className="container-fluid text-white justify-content-evenly mt-n1">
        <div className="row mx-xxl-10 mx-xl-8 mx-5">

          <div className="col px-0">
            <OtherUserProfileReviewsComponent displayName={userName}/>
          </div>
          <div className="col-4 px-0 ">
            {userProfileData !== null &&
               <OtherUserProfileFriendsComponent displayName={userName} userId={userProfileData.id}/>
            }
          </div>

          <div className="">
            {userProfileData !== null &&
              <OtherUserProfileGamesListComponent displayName={userName} userId={userProfileData.id}/>
            }
          </div>


        </div>
      </div>
      <div className="position-absolute top-0">
      </div>
    </div>
  );

}

export default OtherUserProfilePage;