import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

function ResetPasswordPage() {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

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
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
    
        try {
            // Check password complexity
            const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z0-9]).{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                setMessage('Password must be at least 8 characters long and contain at least 1 special character.');
                return;
            }
    
            if (newPassword !== confirmPassword) {
                setMessage('Passwords do not match.');
                return;
            }
    
            const response = await fetch(buildPath("api/reset-password"), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, newPassword })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
            } else {
                setMessage('Password reset failed. Please try again.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again later.');
        }
    };
    

    return (
        <div className='page-container'>
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="form-container">                    
                    <div className="form-group mb-4">
                        <h1 className="fw-semibold fs-1 text-center" style={{ color: 'white' }}>Reset Password</h1>
                    </div>
                                    
                    <div className="form-group mb-4">
                        <label className="fw-semibold fs-4 mb-2">New Password</label>
                        <input 
                            className="form-control fs-5" 
                            type="password" 
                            placeholder="Enter your new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)} 
                            style={{ color: 'white' }}
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label className="fw-semibold fs-4 mb-2">Re-enter Password</label>
                        <input 
                            className="form-control fs-5" 
                            type="password" 
                            placeholder="Re-enter your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            style={{ color: 'white' }}
                        />
                    </div>

                    <button 
                        type="button" 
                        className="btn btn-primary text-white w-100 fs-5 mb-3"
                        onClick={handleResetPassword}
                    >
                        Reset Password
                    </button>
                    <span className="text-danger d-block" id="resetPasswordResult">{message}</span>
                </div>
            </div> 
        </div>
    );
};

export default ResetPasswordPage;

