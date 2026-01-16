import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; 
import './LogIn.css';

const LogIn = () => {
    const { login } = useUser();
    const navigate = useNavigate();

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
            }).then(res => res.json());

            console.log('Login Success:', userInfo);
            console.log('Name:', userInfo.name);
            console.log('Email:', userInfo.email);
            login(userInfo);
            navigate('/');

        },
        onError: () => console.log('Login Failed'),
    });

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <form className="login-form">
                    <h3 className="login-title">Sign In</h3>
                    <p className="login-subtitle">Enter your email and password</p>

                    <button
                        type="button"
                        className="google-btn"
                        onClick={() => googleLogin()}
                    >
                        <img src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png" alt="Google" />
                        Sign in with Google
                    </button>

                    <div className="divider">
                        <hr />
                        <span>or</span>
                        <hr />
                    </div>

                    <label htmlFor="email">Email*</label>
                    <input id="email" type="email" placeholder="mail@example.com" />

                    <label htmlFor="password">Password*</label>
                    <input id="password" type="password" placeholder="Enter a password" />

                    <div className="form-options">
                        <label className="checkbox-label">
                            <input type="checkbox" defaultChecked />
                            <span>Keep me logged in</span>
                        </label>
                        <a href="#" className="forgot-link">Forgot password?</a>
                    </div>

                    <button type="submit" className="submit-btn">Sign In</button>

                    <p className="signup-text">
                        Not registered yet? <a href="#">Create an Account</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LogIn;