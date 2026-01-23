import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "../Login/Login.css";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

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

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setIsValidToken(false);
                return;
            }

            try {
                const response = await fetch("http://localhost:8000/api/verify-reset-token", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });

                const data = await response.json();
                setIsValidToken(data.valid);
            } catch (error) {
                setIsValidToken(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

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

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8000/api/reset-password", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ general: data.error || 'Something went wrong' });
                return;
            }

            setIsSuccess(true);

        } catch (error) {
            setErrors({ general: 'Something went wrong. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Loading state
    if (isValidToken === null) {
        return (
            <div className="login-wrapper">
                <div className="login-container">
                    <div className="login-form">
                        <h3 className="login-title">Verifying...</h3>
                        <p className="login-subtitle">Please wait while we verify your reset link.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isValidToken) {
        return (
            <div className="login-wrapper">
                <div className="login-container">
                    <div className="login-form">
                        <h3 className="login-title">Invalid Link</h3>
                        <p className="login-subtitle">
                            This password reset link is invalid or has expired.
                        </p>
                        <Link to="/forgot-password" className="submit-btn" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                            Request New Link
                        </Link>
                    </div>
                </div>
            </div>
        );
    }


    if (isSuccess) {
        return (
            <div className="login-wrapper">
                <div className="login-container">
                    <div className="login-form">
                        <h3 className="login-title">Password Reset!</h3>
                        <p className="login-subtitle">
                            Your password has been reset successfully.
                        </p>
                        <Link to="/login" className="submit-btn" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit} noValidate>
                    <h3 className="login-title">Reset Password</h3>
                    <p className="login-subtitle">Enter your new password</p>

                    {errors.general && (
                        <div className="error-banner">
                            {errors.general}
                        </div>
                    )}

                    <label htmlFor="password">New Password*</label>
                    <div className="password-input-wrapper">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={errors.confirmPassword ? 'input-error' : ''}
                            disabled={isLoading}
                            autoComplete="new-password"
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
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;