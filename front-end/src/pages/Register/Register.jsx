
import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import "../Login/Login.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { API_BASE_URL } from '../../constants/api';

const Register = () => {
    const { login, user } = useUser();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email) && email.length <= 254;
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,100}$/;
        return passwordRegex.test(password);
    };

    const passwordErrorMessage = (
        <div className="password-requirements">
            <p>Your password must include the following:</p>
            <ul>
                <li>8–100 characters</li>
                <li>Upper & lowercase letters</li>
                <li>At least one number or special character</li>
            </ul>
        </div>
    );

    const handleFirstNameChange = (e) => {
        const value = e.target.value;
        setFirstName(value);
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '', showGoogleLogin: false, showLoginLink: false }));
        }
        if (touched.firstName) {
            if (!value.trim()) {
                setErrors(prev => ({ ...prev, firstName: 'First name is required' }));
            } else {
                setErrors(prev => ({ ...prev, firstName: '' }));
            }
        }
    };

    const handleLastNameChange = (e) => {
        const value = e.target.value;
        setLastName(value);
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '', showGoogleLogin: false, showLoginLink: false }));
        }
        if (touched.lastName) {
            if (!value.trim()) {
                setErrors(prev => ({ ...prev, lastName: 'Last name is required' }));
            } else {
                setErrors(prev => ({ ...prev, lastName: '' }));
            }
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '', showGoogleLogin: false, showLoginLink: false }));
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
            setErrors(prev => ({ ...prev, general: '', showGoogleLogin: false, showLoginLink: false }));
        }
        if (touched.password) {
            if (!value) {
                setErrors(prev => ({ ...prev, password: 'required' }));
            } else if (!validatePassword(value)) {
                setErrors(prev => ({ ...prev, password: 'invalid' }));
            } else {
                setErrors(prev => ({ ...prev, password: '' }));
            }
        }
        if (touched.confirmPassword && confirmPassword) {
            if (value !== confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
            } else {
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
            }
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '', showGoogleLogin: false, showLoginLink: false }));
        }
        if (touched.confirmPassword) {
            if (!value) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Please confirm your password' }));
            } else if (value !== password) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
            } else {
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
            }
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));

        if (field === 'firstName') {
            if (!firstName.trim()) {
                setErrors(prev => ({ ...prev, firstName: 'First name is required' }));
            } else {
                setErrors(prev => ({ ...prev, firstName: '' }));
            }
        }

        if (field === 'lastName') {
            if (!lastName.trim()) {
                setErrors(prev => ({ ...prev, lastName: 'Last name is required' }));
            } else {
                setErrors(prev => ({ ...prev, lastName: '' }));
            }
        }

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
                setErrors(prev => ({ ...prev, password: 'required' }));
            } else if (!validatePassword(password)) {
                setErrors(prev => ({ ...prev, password: 'invalid' }));
            } else {
                setErrors(prev => ({ ...prev, password: '' }));
            }
        }

        if (field === 'confirmPassword') {
            if (!confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Please confirm your password' }));
            } else if (confirmPassword !== password) {
                setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
            } else {
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'required';
        } else if (!validatePassword(password)) {
            newErrors.password = 'invalid';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true });

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setIsLoading(true);

        try {
            const fullName = `${firstName.trim()} ${lastName.trim()}`;

            const response = await fetch(`${API_BASE_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name: fullName })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.code === 'EMAIL_EXISTS_GOOGLE') {
                    setErrors({
                        general: 'This email is already registered with Google.',
                        showGoogleLogin: true
                    });
                } else if (data.code === 'EMAIL_EXISTS') {
                    setErrors({
                        general: 'This email is already registered.',
                        showLoginLink: true
                    });
                } else {
                    setErrors({ general: data.error || 'Registration failed' });
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
                const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
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
                        <p style={{ marginTop: '20px', color: '#666' }}>Creating account...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit} noValidate>
                    <h3 className="login-title">Create Account</h3>
                    <p className="login-subtitle">Enter your details to get started</p>

                    {errors.general && (
                        <div className="error-banner">
                            {errors.general}
                            {errors.showGoogleLogin && (
                                <div style={{ marginTop: '12px' }}>
                                    <button
                                        type="button"
                                        className="google-btn"
                                        onClick={handleGoogleLogin}
                                        disabled={isLoading}
                                    >
                                        <img src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png" alt="Google" />
                                        Sign in with Google
                                    </button>
                                </div>
                            )}
                            {errors.showLoginLink && (
                                <div style={{ marginTop: '8px' }}>
                                    <Link to="/login" className="register-link">
                                        Sign In Instead
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="name-row">
                        <div className="name-field">
                            <label htmlFor="firstName">First Name*</label>
                            <input
                                id="firstName"
                                type="text"
                                placeholder="First name"
                                value={firstName}
                                onChange={handleFirstNameChange}
                                onBlur={() => handleBlur('firstName')}
                                className={errors.firstName ? 'input-error' : ''}
                                disabled={isLoading}
                            />
                            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                        </div>

                        <div className="name-field">
                            <label htmlFor="lastName">Last Name*</label>
                            <input
                                id="lastName"
                                type="text"
                                placeholder="Last name"
                                value={lastName}
                                onChange={handleLastNameChange}
                                onBlur={() => handleBlur('lastName')}
                                className={errors.lastName ? 'input-error' : ''}
                                disabled={isLoading}
                            />
                            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                        </div>
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
                            placeholder="Create a password"
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={() => handleBlur('password')}
                            className={errors.password ? 'input-error' : ''}
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {errors.password === 'required' && <span className="error-message">Password is required</span>}
                    {errors.password === 'invalid' && passwordErrorMessage}

                    <label htmlFor="confirmPassword">Confirm Password*</label>
                    <div className="password-input-wrapper">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            onBlur={() => handleBlur('confirmPassword')}
                            className={errors.confirmPassword ? 'input-error' : ''}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}

                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <p className="signup-text">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;