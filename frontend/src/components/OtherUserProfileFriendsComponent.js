import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import UserLookUp from "./UserLookUp";

const OtherUserProfileFriendsComponent = ({displayName, userId}) => {

  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [showForm, setShowForm] = useState(null);

  // let userData = JSON.parse(localStorage.getItem('user_data'));
//   let userId = userData.id;

  useEffect(() => {
    fetchFriends();
  }, [userId]);

  const app_name = 'g26-big-project-6a388f7e71aa'
  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    }
    else {
      return 'http://localhost:5000/' + route;
    }
  }



  const fetchFriends = async () => {

    try {
      const response = await fetch(buildPath("api/friends/" + userId));

      let res = JSON.parse(await response.text());

      let arr = []

      // purges friend list of null entries
      for(let i = 0; i < res.friends.length; ++i) {
        if(res.friends[i] !== null) {
          arr.push(res.friends[i]);
        }
      }

      setFriends(arr);
    } catch (e) {
      alert(e.toString() + "fetchFriends()");
      return;
    }

  }



  return (
    <div className="">
      <div className="d-flex justify-content-between">
        <span className="my-auto fw-semibold fs-3">Friends</span>
      </div>

      <hr className="mt-2 opacity-50" />
      <div className="overflow-scroll" style={{height: '60vh'}}>
        {friends.map((friend) => (
          <div className="d-flex justify-content-between mb-3">
            <div className="">
              <Link className="link" to={{
                pathname: `/Profile/${friend.displayName}`,
              }}>
                <img className=" " width="" height="" src="/user.svg" style={{ height: '40px', width: 'auto' }} />
                <span className="mx-4 align-middle fw-semibold fs-4">
                  {friend.displayName}
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="position-absolute top-0">
      </div>
    </div>
  );
}

export default OtherUserProfileFriendsComponent;
