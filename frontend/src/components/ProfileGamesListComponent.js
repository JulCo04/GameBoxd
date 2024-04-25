import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const ProfileGamesListComponent = () => {
  const [gamesDetailsList, setGamesDetailsList] = useState([]);
  const [gamesEmpty, setGamesEmpty] = useState(true);

  useEffect(() => {
    const fetchGamesListData = async () => {
      await fetchGamesList();
      await fetchGamesById();
    }

    fetchGamesListData();
  }, []);

  let _gamesList;
  let _gamesDetailsList;

  const parseCoverUrl = (url) => {
    return url.replace('t_thumb', 't_cover_big');
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

  const fetchGamesList = async () => {
    let userData = JSON.parse(localStorage.getItem('user_data'));
    let userId = userData.id;

    try {
      const response = await fetch(buildPath("api/user/games/" + userId));

      let res = JSON.parse(await response.text());

      if (res.error) {
        console.log("There was an error in fetchGamesList(): " + res.error);
        return;
      }

      _gamesList = res.games;
      if(res.games) {
        setGamesEmpty(false);
      }

    } catch (e) {
      alert(e.toString() + "fetchGamesList()");
      return;
    }


  }

  const fetchGamesById = async () => {

    try {
      const limit = 0;
      const offset = 0;

      const response = await fetch(buildPath("api/games"), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limit, offset, gameIds: _gamesList })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch game");
      }

      const gamesData = await response.json();
      _gamesDetailsList = gamesData;
      // console.log(_gamesDetailsList);

      setGamesDetailsList(gamesData);


    } catch (e) {

    }

  }

  return (
    <div className="">
      <div className="d-flex justify-content-between ">
        <span className=" fw-semibold fs-3">Your Games List</span>
      </div>

      <hr className="ps-0 mt-2 opacity-50" />
      <div className="mx-0 px-0">

        {!gamesEmpty &&
          <div className="container-fluid overflow-scroll" style={ { height: '90vh' } }>
            <div className="row">
              {gamesDetailsList.map((game) => (
                <div className="col-2 my-auto mb-3" align="center">
                  <Link to={{
                    pathname: `/games/${game.name}/${game.id}`,
                  }}>
                    <img
                      src={game.cover ? parseCoverUrl(game.cover.url) : 'placeholder_url'}
                      alt={game.name}
                      className="img-fluid rounded" 
                      style={{ height: "260px" }}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        }
        {gamesEmpty &&
          <div className="text-center mb-6">
            <span className="fw-normal fs-5 my-4 ">Games list is empty</span>
          </div>
        }

        <hr className="mx-0 mt-2 mb-2 opacity-50" />
      </div>
    </div>
  );

}

export default ProfileGamesListComponent;