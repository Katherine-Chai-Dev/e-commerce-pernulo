import React, { useState, useEffect } from 'react';
import './Toast.css';
import { CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose && onClose(), 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose && onClose(), 300);
    };

    return (
        <div className={`toast toast-${type} ${isVisible ? 'toast-visible' : 'toast-hidden'}`}>
            <div className="toast-content">
                <CheckCircleOutlined className="toast-icon" />
                <span className="toast-message">{message}</span>
                <CloseOutlined className="toast-close" onClick={handleClose} />
            </div>
        </div>
    );
};

export default Toast;