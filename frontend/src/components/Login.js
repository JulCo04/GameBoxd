import React, { useState } from 'react';

function Login() {
    var loginName;
    var loginPassword;

    const [message, setMessage] = useState('');
    const [showOverlay, setShowOverlay] = useState(true); // State to track overlay visibility

    const app_name = 'g26-big-project'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }

    const doLogin = async event => {
        event.preventDefault();

        var obj = { login: loginName.value, password: loginPassword.value };
        var js = JSON.stringify(obj);

        try {

            // Fetch users id and username
            const response = await fetch('http://localhost:5000/api/login',
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());
            console.log(res);

            // If username does not exist display a notice
            if (res.username == '') {
                setMessage('User/Password combination incorrect');
            }
            else {
                var user = { id: res.id, username: res.username }
                
                // Save user id and username in "user_data"
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                window.location.href = '/LargeProject';
            }
        }
        catch (e) {
            alert(e.toString());
            return;
        }
    };

    const handleExitButtonClick = () => {
        // Toggle the state to hide the overlay
        setShowOverlay(false);
    };

    return (
        showOverlay && (
            <div class="overlay"> 
                <div class="form-container">

                    <button className="exit-button" onClick={handleExitButtonClick}>
                        <img src="../images/x-button.png" alt="EXIT"></img>
                    </button>

                    <div class="form-group">
                        
                        <label>Login Name</label><br />
                        <input type="text" id="login-name" placeholder="Enter your login name"
                            ref={(c) => loginName = c} /><br />

                    </div>

                    <div class="form-group">
                        <label>Password</label><br />
                        <input type="password" id="login-password" placeholder="Enter your password"
                            ref={(c) => loginPassword = c} /><br />
                    </div>
                    <input type="submit" class="submit-button" value="Sign in" onClick={doLogin} />
                    <span id="loginResult">{message}</span>
                </div>
            </div>
        )
    );
};

export default Login;