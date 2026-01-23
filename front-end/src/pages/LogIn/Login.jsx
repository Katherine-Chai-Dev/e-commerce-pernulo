
import './Login.css';
import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LogIn = () => {
    const { login, user } = useUser();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email) && email.length <= 254;
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '', showRegisterLink: false }));
        }
        if (touched.email) {
            if (!value) {
                setErrors(prev => ({ ...prev, email: 'Email is required' }));
            } else if (!validateEmail(value)) {
                setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
            } else {
                setErrors(prev => ({ ...prev, email: '' }));
            }
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '', showRegisterLink: false }));
        }

        if (touched.password || errors.password) {
            if (!value) {
                setErrors(prev => ({ ...prev, password: 'Password is required' }));
            } else {
                setErrors(prev => ({ ...prev, password: '' }));
            }
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));

        if (field === 'email') {
            if (!email) {
                setErrors(prev => ({ ...prev, email: 'Email is required' }));
            } else if (!validateEmail(email)) {
                setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
            } else {
                setErrors(prev => ({ ...prev, email: '' }));
            }
        }

        if (field === 'password') {
            if (!password) {
                setErrors(prev => ({ ...prev, password: 'Password is required' }));
            } else {
                setErrors(prev => ({ ...prev, password: '' }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        setTouched({ email: true, password: true });

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8000/api/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.code === 'USER_NOT_FOUND') {
                    setErrors({
                        general: data.error,
                        showRegisterLink: true
                    });
                } else if (data.code === 'USE_GOOGLE') {
                    setErrors({
                        password: 'This account uses Google sign-in. Please use the Google button above.'
                    });
                } else if (data.code === 'WRONG_PASSWORD') {
                    setErrors({
                        password: 'Please enter a valid password'
                    });
                } else {
                    setErrors({ general: data.error || 'Login failed' });
                }
                setIsLoading(false);
                return;
            }

            login(data);


        } catch (error) {
            setErrors({ general: 'Something went wrong. Please try again.' });
            setIsLoading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await fetch('http://localhost:8000/api/auth/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ access_token: tokenResponse.access_token })
                });

                const data = await response.json();

                if (!response.ok) {
                    setErrors({ general: data.error || 'Google login failed' });
                    setIsLoading(false);
                    return;
                }

                login(data);


            } catch (error) {
                setErrors({ general: 'Something went wrong. Please try again.' });
                setIsLoading(false);
            }
        },
        onError: () => {
            setErrors({ general: 'Google login failed' });
            setIsLoading(false);
        },
    });

    const handleGoogleLogin = () => {
        setIsLoading(true);
        setErrors({});
        googleLogin();
    };


    if (user || isLoading) {
        return (
            <div className="login-wrapper">
                <div className="login-container">
                    <div className="login-form" style={{ textAlign: 'center', padding: '60px 40px' }}>
                        <div className="loading-spinner"></div>
                        <p style={{ marginTop: '20px', color: '#666' }}>Signing in...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit} noValidate>
                    <h3 className="login-title">Sign In</h3>
                    <p className="login-subtitle">Enter your email and password</p>

                    {errors.general && (
                        <div className="error-banner">
                            {errors.general}
                            {errors.showRegisterLink && (
                                <div style={{ marginTop: '8px' }}>
                                    <Link to="/register" className="register-link">
                                        Create an Account
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        type="button"
                        className="google-btn"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
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
                    <input
                        id="email"
                        type="email"
                        placeholder="mail@example.com"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={() => handleBlur('email')}
                        className={errors.email ? 'input-error' : ''}
                        disabled={isLoading}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}

                    <label htmlFor="password">Password*</label>
                    <div className="password-input-wrapper">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={() => handleBlur('password')}
                            className={errors.password ? 'input-error' : ''}
                            disabled={isLoading}
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.password && <span className="error-message">{errors.password}</span>}

                    <div className="form-options">
                        <label className="checkbox-label">
                            <input type="checkbox" defaultChecked />
                            <span>Keep me logged in</span>
                        </label>
                        <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
                    </div>

                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <p className="signup-text">
                        Not registered yet? <Link to="/register">Create an Account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LogIn;