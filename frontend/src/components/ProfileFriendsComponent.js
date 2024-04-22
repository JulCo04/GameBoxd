import React, { useEffect, useState } from "react";
import UserLookUp from "./UserLookUp";

const ProfileFriendsComponent = ({ formToggler }) => {

  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [showForm, setShowForm] = useState(null);

  let userData = JSON.parse(localStorage.getItem('user_data'));
  let userId = userData.id;

  useEffect(() => {
    const intervalId = setInterval(() => {
      // console.log("Interval");
      fetchFriendRequests();
      fetchFriends();
    }, 3000)

    return () => clearInterval(intervalId);

  }, []);

  const app_name = 'g26-big-project-6a388f7e71aa'
  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    }
    else {
      return 'http://localhost:5000/' + route;
    }
  }


  const fetchFriendRequests = async () => {
    try {
      const response = await fetch(buildPath("api/friends/received-requests/" + userId));

      let res = JSON.parse(await response.text());
      setFriendRequests(res.receivedRequests)

    } catch (e) {
      alert(e.toString() + "fetchFriendRequests()");
      return;
    }

  }

  const fetchFriends = async () => {

    try {
      const response = await fetch(buildPath("api/friends/" + userId));

      let res = JSON.parse(await response.text());
      setFriends(res.friends);
    } catch (e) {
      alert(e.toString() + "fetchFriends()");
      return;
    }

  }

  const acceptFriendRequest = async (friendId) => {
    let obj = { userId: userId, friendId: friendId };
    let js = JSON.stringify(obj);


    try {
      const response = await fetch(buildPath("api/friends/accept-request"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: js
      });

      let res = JSON.parse(await response.text())

      if (res.error) {
        console.log("There was an error in acceptFriendRequest(): " + res.error);
        return;
      }

      if (res.message) {
        fetchFriendRequests();
        fetchFriends();
      }

    }
    catch (e) {
      alert(e.toString() + "acceptFriendRequest()");
      return;
    }
  }

  const declineFriendRequest = async (friendId) => {
    let obj = { userId: userId, friendId: friendId };
    let js = JSON.stringify(obj);


    try {
      const response = await fetch(buildPath("api/friends/reject-request"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: js
      });

      let res = JSON.parse(await response.text())

      if (res.error) {
        console.log("There was an error in declineFriendRequest(): " + res.error);
        return;
      }

      if (res.message) {
        fetchFriendRequests();
        fetchFriends();
      }

    }
    catch (e) {
      alert(e.toString() + "in declineFriendRequest()");
      return;
    }

  }

  const removeFriend = async (friendId) => {
    let obj = { userId: userId, friendId: friendId };
    let js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath("api/friends/remove"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: js
      });

      let res = JSON.parse(await response.text())

      if (res.error) {
        console.log("There was an error in removeFriend(): " + res.error);
        return;
      }

      if (res.message) {
        fetchFriendRequests();
        fetchFriends();
      }

    }
    catch (e) {
      alert(e.toString() + "in removeFriend()");
      return;
    }

  }

  const removeFriendPrompt = (friendDisplayName, friendId) => {
    let text = "Are you sure you want to remove " + friendDisplayName + " from your friends list?";

    if (window.confirm(text) == true) {
      removeFriend(friendId);
    } else {

    }
  }

  return (
    <div className="">
      <div className="d-flex justify-content-between">
        <span className="my-auto fw-semibold fs-3">Friends</span>
        <button onClick={() => formToggler('userLookup')} className="fw-semibold btn btn-primary text-white px-0 py-0 my-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-plus " viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
          </svg>
        </button>
      </div>

      <hr className="mt-2 opacity-50" />
      <div className="overflow-scroll" style={{height: '60vh'}}>
        {friendRequests.map((friendRequest) => (
          <div className="d-flex justify-content-between mb-3">
            <div className=""> 
              <img className=" " width="" height="" src="profile.svg" style={{ height: '80px', width: 'auto' }} />
              <span className="align-middle mx-4 fw-semibold fs-4">{friendRequest.displayName}</span>
            </div>
            <div className="my-auto">
              <button onClick={() => acceptFriendRequest(friendRequest.id)} className="btn btn-primary my-auto text-white me-2">Accept</button>
              <button onClick={() => declineFriendRequest(friendRequest.id)} className="btn btn-danger my-auto text-white">Decline</button>
            </div>
          </div>
        ))}
        {friends.map((friend) => (
          <div className="d-flex justify-content-between mb-3">
            <div className="">
              <img className=" " width="" height="" src="profile.svg" style={{ height: '80px', width: 'auto' }} />
              <span className="mx-4 align-middle fw-semibold fs-4">{friend.displayName}</span>
            </div>
            <button onClick={() => removeFriendPrompt(friend.displayName, friend.id)} className="btn btn-danger text-white fw-semibold my-auto">Remove</button>
          </div>
        ))}
      </div>
      <div className="position-absolute top-0">
        {/* {showForm === 'userLookup' &&
          <UserLookUp onExitClick={()=>setShowForm(null)}/>
        } */}
      </div>
    </div>
  );
}

export default ProfileFriendsComponent;