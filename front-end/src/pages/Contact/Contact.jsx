import React from 'react';
import { Card, Typography, Space, Button } from 'antd';
import { MailOutlined, SendOutlined } from '@ant-design/icons';
import './Contact.css';

const { Title, Text } = Typography;

const Contact = () => {
    return (
        <div className="contact-container">
            <div className="contact-background"></div>
            <Card className="contact-card">
                <Space direction="vertical" size="large" className="contact-content">
                    <div className="contact-icon-wrapper">
                        <MailOutlined className="contact-icon" />
                    </div>
                    <Title level={2} className="contact-title">Let's Connect</Title>
                    <Text className="contact-text">
                        Have a question or want to work together? We'd love to hear from you.
                    </Text>
                    <div className="contact-email-wrapper">
                        <span className="contact-email">qianying.chai.dev@gmail.com</span>
                    </div>
                    <Button 
                        type="primary" 
                        size="large" 
                        icon={<SendOutlined />}
                        className="contact-button"
                        href="mailto:qianying.chai.dev@gmail.com"
                    >
                        Send an Email
                    </Button>
                </Space>
            </Card>
        </div>
    );
};

export default Contact;