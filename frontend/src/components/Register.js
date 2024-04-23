import React, { useState } from 'react';

// Comment
function Register({onExitClick}) {

    var displayName;    
    var password;
    var email;

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

    const doRegister = async event => {
    event.preventDefault();

    // Check if any field is empty
    if (!email.value || !password.value || !displayName.value) {
        setMessage('All fields are required.');
        return;
    }

    // Check password complexity
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z0-9]).{8,}$/;
    if (!passwordRegex.test(password.value)) {
        setMessage('Password must be at least 8 characters long and contain at least 1 special character.');
        return;
    }

    var obj = {email: email.value, password: password.value, displayName: displayName.value};
    var js = JSON.stringify(obj);

    console.log(js);

    try {
        // Register user
        console.log("Registering....");
        const response = await fetch(buildPath('api/register'),
            { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

        var res = JSON.parse(await response.text());
        console.log(res);

        setMessage('Successfully Registered! We have sent you an email to verify your account.');
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
        // Conditional rendering based on the state of showOverlay
        showOverlay && (
            <div className="overlay">
                <div className="form-container">
                    <h1 className="text-white mb-4 fw-bold">Signup</h1>

                    <button className="exit-button" onClick={handleExitButtonClick}>
                        <img src="/x-button.png" alt="EXIT"></img>
                    </button>

                    <div className="form-group">
                        <label className="fw-semibold fs-4">Username</label><br />
                        <input className="fs-5" type="text" id="displayName" placeholder="Username" ref={(c) => displayName = c} /><br />
                    </div>

                    <div className="form-group"> 
                        <label className="fw-semibold fs-4">Email</label><br />
                        <input className="fs-5" type="text" id="email" placeholder="Email" ref={(c) => email = c} /><br />
                    </div>

                    <div className="form-group"> 
                        <label className="fw-semibold fs-4">Password</label><br />
                        <input className="fs-5" type="text" id="password" placeholder="Password" ref={(c) => password = c} /><br />
                    </div>

                    <input type="submit" id="registerButton" className="btn btn-primary text-white w-100 fs-5" value="Sign Up" onClick={doRegister} />
                    <span className="text-white fw-semibold fs-5" id="registerResult">{message}</span>
                    
                </div>
            </div>
        )
    );
};

export default Register;
