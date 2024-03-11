import React, { useState } from 'react';

function Login({onExitClick}) {
    var email;
    var password;

    const [message, setMessage] = useState('');
    const [showOverlay, setShowOverlay] = useState(true); // State to track overlay visibility

    const app_name = 'g26-big-project-6a388f7e71aa'
    function buildPath(route) {
        console.log("ENVIRONMENT " + process.env.NODE_ENV);
        if (process.env.NODE_ENV === 'production') {
            console.log('https://' + app_name + '.herokuapp.com/' + route);
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            console.log('http://localhost:5000/' + route);
            return 'http://localhost:5000/' + route;
        }
    }

    const doLogin = async event => {
        event.preventDefault();

        var obj = { email: email.value, password: password.value };
        var js = JSON.stringify(obj);
        console.log(js)

        try {

            // Fetch users id and username
            const response = await fetch(buildPath("api/login"),
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());
            console.log(res);
            console.log("HERE");
            
            // If username does not exist display a notice
            if ((res.displayName == '') || (res.displayName == null)) {
                setMessage('User/Password combination incorrect');
            }
            else {
                var user = { id: res.id, displayName: res.displayName }
                
                // Save user id and username in "user_data"
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                console.log("HERE");
                //window.location.href = '/LargeProject';
            }
        }
        catch (e) {
            alert(e.toString());
            return;
        }
    };

    const handleExitButtonClick = () => {
        onExitClick();
        // Toggle the state to hide the overlay
        setShowOverlay(false);
    };

    return (
        showOverlay && (
            <div className="overlay"> 
                <div className="form-container">

                    <button className="exit-button" onClick={handleExitButtonClick}>
                        <img src="../images/x-button.png" alt="EXIT"></img>
                    </button>

                    <div className="form-group">
                        
                        <label>Email</label><br />
                        <input type="text" id="email" placeholder="Enter your email"
                            ref={(c) => email = c} /><br />

                    </div>

                    <div className="form-group">
                        <label>Password</label><br />
                        <input type="password" id="login-password" placeholder="Enter your password"
                            ref={(c) => password = c} /><br />
                    </div>
                    <input type="submit" className="submit-button" value="Sign in" onClick={doLogin} />
                    <span id="loginResult">{message}</span>
                </div>
            </div>
        )
    );
};

export default Login;