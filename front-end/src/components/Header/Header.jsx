import React, { useState } from "react";
import Nav from "../Nav/Nav";
import "./Header.css";
import { Layout, Tooltip, ConfigProvider, Input } from 'antd';
import { SearchOutlined, UserOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { useProducts } from '../../context/Context';

const { Search } = Input;
const onSearch = (value, _e, info) => console.log("info?.source",info?.source, "value",value);

const Header = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [searchValue, setSearchValue] = useState("")
    const navigate = useNavigate();
    const { setSelectedNav } = useProducts();

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

   const  showSearchContent =(e)=>{
    setSearchValue(e.target.value)
   }

    const handleSearch = (value)=>{
        if (value.trim()) {
            setSelectedNav(null);
            navigate(`/search?q=${encodeURIComponent(value)}`);
            setShowSearch(false); 
        }else{
            navigate('/');
        }
        setShowSearch(false)
    }
    console.log(searchValue)

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
                                onSearch={handleSearch}
                                autoFocus={showSearch}
                                value={searchValue}
                                onChange={showSearchContent}
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

