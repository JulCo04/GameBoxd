import React, { useState } from 'react';

function ForgotPasswordPage({ onBackClick }) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleGoBack = () => {
        window.location.href = '/';
    };

    const app_name = 'g26-big-project-6a388f7e71aa';
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

    const handleResetPassword = async () => {

        try {
            const response = await fetch(buildPath("api/forgot-password"), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
            } else {
                setMessage('Email not found. Please enter a valid email.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className='page-container'>
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="form-container">                    

                    <div className='form-group d-flex justify-content-end mb-5'> {/* Add mb-4 class for bottom margin */}
                        <label className="txt-click" onClick={handleGoBack}>Go Back</label>
                    </div>
                    
                    <div className='form-group mb-4'> {/* Add mb-5 class for bottom margin */}
                        <h1 className="fw-semibold fs-1 text-center" style={{ color: 'white' }}>Forgot Password</h1>
                    </div>
                                    
                    <div className="form-group mb-4"> {/* Add mb-4 class for bottom margin */}
                        <label className="fw-semibold fs-4 mb-2">Email</label> {/* Add mb-2 class for bottom margin */}
                        <input 
                            className="form-control fs-5" 
                            type="text" 
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            style={{ color: 'white' }} // Set input text color to white
                        />
                    </div>

                    <button 
                        type="button" 
                        className="btn btn-primary text-white w-100 fs-5 mb-3" // Add mb-3 class for bottom margin
                        onClick={handleResetPassword}
                    >
                        Reset Password
                    </button>
                    <span className="text-danger d-block" id="forgotPasswordResult">{message}</span>
                </div>
            </div> 
        </div>

    );
};

export default ForgotPasswordPage;
