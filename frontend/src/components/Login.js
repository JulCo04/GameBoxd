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
        console.log("JS" + js)

        try {

            // Fetch users id and username
            const response = await fetch(buildPath("api/login"),
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });
            console.log("Response: "+response.ok);    
            
            var res = JSON.parse(await response.text());

            console.log("Login Fetch Result: " + JSON.stringify(res));
            
            // If username does not exist display a notice
            console.log(res.displayName == '');
            if ((res.displayName == '') || (res.displayName == null)) {
                setMessage(res.error);
            }
            else {
                var user = { id: res.id, displayName: res.displayName, email: res.email, dateCreated: res.dateCreated }
                
                // Save user id and username in "user_data"
                localStorage.setItem('user_data', JSON.stringify(user));
                console.log("user_data: " + localStorage.getItem('user_data'));
                setMessage('');
                console.log("Login Complete");
                window.location.href = '/LoggedInHomePage';
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

    const handleForgotPasswordClick = () => {
        window.location.href = '/forgot-password';
    };

    return (
        showOverlay && (
            <div className="overlay"> 
                <div className="form-container">
                    <h1 className="text-white mb-4 fw-bold">Login</h1>

                    <button className="exit-button" onClick={handleExitButtonClick}>
                        <img src="/x-button.png" alt="EXIT"></img>
                    </button>

                    <div className="form-group">
                        
                        <label className="fw-semibold fs-4">Email</label><br />
                        <input className="fs-5" type="text" id="email" placeholder="Enter your email"
                            ref={(c) => email = c} /><br />

                    </div>

                    <div className="form-group">
                        <label className="fw-semibold fs-4">Password</label><br />
                        <input className="fs-5" type="password" id="login-password" placeholder="Enter your password"
                            ref={(c) => password = c} /><br />
                    </div>

                    <input type="submit" className="btn btn-primary text-white w-100 fs-5" value="Log in" onClick={doLogin} />
                    <span className="text-danger" id="loginResult">{message}</span>

                    <div className="form-group d-flex justify-content-center mt-2"> {/* Add d-flex and justify-content-center classes */}
                        <label className="txt-click" onClick={handleForgotPasswordClick}>Forgot Password?</label><br />
                    </div>
                </div>
            </div>
        )
    );
};

export default Login;