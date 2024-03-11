function LoggedInName() {

    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var displayName = ud.displayName;

    const doLogout = event => {
        event.preventDefault();

        localStorage.removeItem("user_data")
        console.log(localStorage.getItem("user_data"));
        window.location.href = '/';

    };

    return (
        <div id="loggedInDiv">
            <span id="userName">Logged In As {displayName}</span><br />
            <button type="button" id="logoutButton" className="buttons"
                onClick={doLogout}> Log Out </button>
        </div>
    );

};

export default LoggedInName;