import React, { useState } from "react";
import { Layout, Tooltip, ConfigProvider, Input } from 'antd';
import { SearchOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons';
import Nav from "../Nav/Nav";
import "./Header.css";

const { Search } = Input;
const onSearch = (value, _e, info) => console.log(info?.source, value);

const Header = () => {
    const [showSearch, setShowSearch] = useState(false);
    
    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    padding: 24,
                    colorBorder: "#009B9E"
                },
            }}>
            <Layout.Header className="header">
                <div className="header-content">
                    <img
                        src='/images/logo.png'
                        alt="Logo"
                        className="nav-logo"
                    />

                    <div className="brand">
                        <span className="brand-name">PERNULO</span>
                        <span className="brand-describe">Pearl Jewelry Studio</span>
                    </div>

                    <div className="header-right">
                        <div className={`search-container ${showSearch ? 'expanded' : ''}`}>
                            <Search
                                placeholder="Search..."
                                className="search-button"
                                allowClear
                                onSearch={onSearch}
                                autoFocus={showSearch}
                            />
                        </div>

                        <div className="header-icons">
                            {showSearch ? (
                                <CloseOutlined 
                                    className="search-icon" 
                                    onClick={toggleSearch}
                                />
                            ) : (
                                <Tooltip title="Search">
                                    <SearchOutlined 
                                        className="search-icon" 
                                        onClick={toggleSearch}
                                    />
                                </Tooltip>
                            )}
                            <UserOutlined className="account-icon" />
                        </div>
                    </div>
                </div>
                <Nav />
            </Layout.Header>
        </ConfigProvider>
    );
};

export default Header;

