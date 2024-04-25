import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const UserLookUp = ({ onExitClick }) => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchUsers();
    // console.log("Test");
  }, [searchTerm]);

  const handleExitButtonClick = () => {
    onExitClick();
    // Toggle the state to hide the overlay
    setShowOverlay(false);
  };

  const app_name = 'g26-big-project-6a388f7e71aa'
  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    }
    else {
      return 'http://localhost:5000/' + route;
    }
  }

  const fetchUsers = async () => {
    setUser(null);
    let userDisplayName = JSON.parse(localStorage.getItem('user_data')).displayName;
    if(searchTerm === userDisplayName) {
      return;
    }

    let obj = { displayName: searchTerm}
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

      setUser(res.user);
      // console.log(JSON.stringify(user));
    
    }
    catch(e) {
      alert(e.toString());
      return;
    }
  }

  const sendFriendRequest = async (friendId) => {
    setSuccessMessage('');
    setErrorMessage('');
    let userData = JSON.parse(localStorage.getItem('user_data'));
    let userId = userData.id;

    let obj = { userId: userId, friendId: friendId}
    let js = JSON.stringify(obj);

    try {

      const response = await fetch(buildPath("api/friends/send-request"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: js 
      });

      let res = JSON.parse(await response.text());

      if(res.error) {
        console.log("There was an error in sendFriendRequest(): " + res.error);
        setErrorMessage(res.error);
        return;
      }

      if(res.message) {
        setSuccessMessage("Friend Request Sent!");
      }

    }
    catch(e) {
      alert(e.toString());
      return;
    }
  }

  return (
    showOverlay && (
      <div className="overlay">
        <div className="form-container">
          <h1 className="text-white mb-4 fw-bold">User Lookup</h1>
          <button className="exit-button" onClick={handleExitButtonClick}>
            <img src="/x-button.png" alt="EXIT"></img>
          </button>

          <div className="form-group">
            <input
              className="games-search-bar me-2 fs-5 fw-semibold"
              type="text"
              placeholder="Search User"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {user !== null &&
              <div className="my-4 py-3 px-3 d-flex text-white fs-4 bg-dark border-white shadow-lg justify-content-between">
                <Link className="link my-auto" to={{
                pathname: `/Profile/${user.displayName}`,
              }}>
                <img className="me-2" width="" height="" src="/user.svg" style={{ height: '40px', width: 'auto' }} />
                <span className=" align-middle my-auto fw-semibold ">
                  {user.displayName}
                </span>
              </Link>
                {/* <img className="my-auto" width="64" src="profile.svg" />
                <span className=" my-auto fw-semibold ">{user.displayName}</span> */}
                <button className="btn btn-primary fw-semibold text-white my-4" onClick={()=>sendFriendRequest(user.id)}>
                  Send Request
                </button>
              </div>
            }
            <span className="text-success fw-semibold fs-5">{successMessage}</span>
            <span className="text-danger fw-semibold fs-5">{errorMessage}</span>
          </div>
        </div>
      </div>
    )
  );

}

export default UserLookUp;