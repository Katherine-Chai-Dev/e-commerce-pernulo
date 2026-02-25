
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../Login/Login.css";
import { API_BASE_URL } from '../../constants/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (errors.general || errors.email) {
            setErrors({});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setErrors({ email: 'Email is required' });
            return;
        }

        if (!validateEmail(email)) {
            setErrors({ email: 'Please enter a valid email address' });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 404) {
                    setErrors({
                        notFound: true,
                        general: "This email hasn't been registered yet."
                    });
                } else {
                    setErrors({ general: data.error || 'Something went wrong' });
                }
                return;
            }

            setIsSubmitted(true);

        } catch (error) {
            setErrors({ general: 'Something went wrong. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="login-wrapper">
                <div className="login-container">
                    <div className="login-form">
                        <h3 className="login-title">Check Your Email</h3>
                        <p className="login-subtitle">
                            If an account exists for {email}, you will receive a password reset link shortly.
                        </p>
                        <Link to="/login" className="submit-btn" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                            Back to Sign In
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
                    <h3 className="login-title">Forgot Password</h3>
                    <p className="login-subtitle">Enter your email to receive a reset link</p>

                    {errors.general && (
                        <div className="error-banner">
                            {errors.general}
                            {errors.notFound && (
                                <p style={{ marginTop: '8px', marginBottom: 0 }}>
                                    Please <Link to="/register" style={{ color: 'black', fontWeight: '600', textDecoration: 'underline' }}>create an account</Link> first.
                                </p>
                            )}
                        </div>
                    )}

                    <label htmlFor="email">Email*</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="mail@example.com"
                        value={email}
                        onChange={handleEmailChange}
                        className={errors.email ? 'input-error' : ''}
                        disabled={isLoading}
                        autoComplete="off"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}

                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <p className="signup-text">
                        Remember your password? <Link to="/login">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;