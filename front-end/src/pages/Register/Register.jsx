
import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import "../LogIn/LogIn.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const { login } = useUser();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '' }));
        }
        if (touched.name) {
            if (!value.trim()) {
                setErrors(prev => ({ ...prev, name: 'Name is required' }));
            } else {
                setErrors(prev => ({ ...prev, name: '' }));
            }
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '' }));
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
            setErrors(prev => ({ ...prev, general: '' }));
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
            setErrors(prev => ({ ...prev, general: '' }));
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

        if (field === 'name') {
            if (!name.trim()) {
                setErrors(prev => ({ ...prev, name: 'Name is required' }));
            } else {
                setErrors(prev => ({ ...prev, name: '' }));
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

        if (!name.trim()) {
            newErrors.name = 'Name is required';
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
        setTouched({ name: true, email: true, password: true, confirmPassword: true });

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8000/api/register", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name: name.trim() })
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ general: data.error || 'Registration failed' });
                return;
            }

            login(data);
            navigate('/');

        } catch (error) {
            setErrors({ general: 'Something went wrong. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit} noValidate>
                    <h3 className="login-title">Create Account</h3>
                    <p className="login-subtitle">Enter your details to get started</p>

                    {errors.general && (
                        <div className="error-banner">
                            {errors.general}
                        </div>
                    )}

                    <label htmlFor="name">Name*</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={handleNameChange}
                        onBlur={() => handleBlur('name')}
                        className={errors.name ? 'input-error' : ''}
                        disabled={isLoading}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}

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
                    {errors.password && passwordErrorMessage}

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
                        Already have an account? <Link to="/login" >Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;