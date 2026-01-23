
// import React, { useState, useEffect } from "react";
// import Nav from "../Nav/Nav";
// import "./Header.css";
// import { Layout, Tooltip, ConfigProvider, Input, Dropdown, Badge } from 'antd';
// import { SearchOutlined, UserOutlined, CloseOutlined, ShoppingCartOutlined, LogoutOutlined } from '@ant-design/icons';
// import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
// import { useProducts } from '../../context/ProductContext';
// import { useUser } from "../../context/UserContext";
// import { useCart } from '../../context/CartContext';


// const Header = () => {
//     const [showSearch, setShowSearch] = useState(false);
//     const [searchValue, setSearchValue] = useState("");
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [searchParams] = useSearchParams();
//     const { setSelectedNav } = useProducts();
//     const { user, logout } = useUser();
//     const { cartItems } = useCart();
//     const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);


//     useEffect(() => {
//         const query = searchParams.get('q');
//         if (query) {
//             setSearchValue(query);
//             if (location.pathname === '/search') {
//                 setShowSearch(true);
//             }
//         } else {
//             setSearchValue("");
//         }
//     }, [searchParams, location.pathname]);

//     const items = [
//         {
//             key: '1',
//             label: 'My Account',
//             disabled: true,
//             icon: <UserOutlined />,
//         },
//         {
//             key: '2',
//             label: 'Cart',
//             icon: <ShoppingCartOutlined />,
//             onClick: () => {
//                 navigate('/cart');
//             },
//         },
//         {
//             type: 'divider',
//         },
//         {
//             key: '3',
//             label: 'Sign Out',
//             icon: <LogoutOutlined />,
//             onClick: () => {
//                 logout(() => navigate('/'));
//             },
//         },
//     ];

//     const toggleSearch = () => {
//         setShowSearch(!showSearch);
//         if (showSearch && !searchParams.get('q')) {
//             setSearchValue("");
//         }
//     };

//     const showSearchContent = (e) => {
//         const newValue = e.target.value;
//         setSearchValue(newValue);
        
//         if (newValue === '' && location.pathname === '/search') {
//             navigate('/');
//         }
//     };
//     const handleSearch = (value) => {
//         if (value.trim()) {
//             setSelectedNav(null);
//             navigate(`/search?q=${encodeURIComponent(value)}`);
//         } else {
//             navigate('/');
//         }
//     };
//     const getFirstName = (fullName) => {
//         if (!fullName) return '';
//         return fullName.trim().split(' ')[0];
//     };


//     return (
//         <ConfigProvider
//             theme={{
//                 token: {
//                     padding: 24,
//                     colorBorder: "#009B9E"
//                 },
//             }}>
//             <Layout.Header className="header">
//                 <div className="header-content">
//                     <img
//                         src='/images/logo.png'
//                         alt="Logo"
//                         className="nav-logo"
//                     />

//                     <div className="brand">
//                         <span className="brand-name">PERNULO</span>
//                         <span className="brand-describe">Pearl Jewelry Studio</span>
//                     </div>

//                     <div className={`header-right ${user ? 'logged-in' : ''}`}>
//                         <div className={`search-container ${showSearch ? 'expanded' : ''}`}>
//                             <Input
//                                 placeholder="Search..."
//                                 className="search-input"
//                                 allowClear
//                                 onPressEnter={(e) => handleSearch(e.target.value)}
//                                 autoFocus={showSearch}
//                                 value={searchValue}
//                                 onChange={showSearchContent}
//                             />
//                         </div>

//                         <div className="header-icons">
//                             {showSearch ? (
//                                 <CloseOutlined
//                                     className="search-icon"
//                                     onClick={toggleSearch}
//                                 />
//                             ) : (
//                                 <Tooltip title="Search">
//                                     <SearchOutlined
//                                         className="search-icon"
//                                         onClick={toggleSearch}
//                                     />
//                                 </Tooltip>
//                             )}
//                             {user ?
//                                 <>
//                                     <Dropdown menu={{ items }} placement="bottomRight">
//                                         <div className="user-account">
//                                             <UserOutlined className="user-icon" />
//                                             <div className="user-info">
//                                                 <span className="user-greeting">Hi, {getFirstName(user.name)}</span>
//                                                 <span className="user-account-text">Account</span>
//                                             </div>
//                                         </div>
//                                     </Dropdown>

//                                     <Tooltip title="Cart"   color="#ffffff"
//                                       >
//                                         <div
//                                             className="cart-icon-wrapper"
//                                             onClick={() => navigate('/cart')}
//                                         >
//                                             <Badge
//                                                 count={cartCount}
//                                                 offset={[0, 0]}
//                                                 size="small"
//                                             >
//                                                 <ShoppingCartOutlined className="cart-icon" />
//                                             </Badge>
//                                         </div>
//                                     </Tooltip>
//                                 </>
//                                 :
//                                 <UserOutlined className="account-icon" onClick={() => { navigate('/login'); }} />
//                             }
//                         </div>
//                     </div>
//                 </div>
//                 <Nav />
//             </Layout.Header>
//         </ConfigProvider>
//     );
// };

// export default Header;

import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import "./Header.css";
import { Layout, Tooltip, ConfigProvider, Input, Dropdown, Badge } from 'antd';
import { SearchOutlined, UserOutlined, CloseOutlined, ShoppingCartOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useProducts } from '../../context/ProductContext';
import { useUser } from "../../context/UserContext";
import { useCart } from '../../context/CartContext';



const Header = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { setSelectedNav } = useProducts();
    const { user, logout } = useUser();
    const { cartItems } = useCart();
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);


    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setSearchValue(query);
            if (location.pathname === '/search') {
                setShowSearch(true);
            }
        } else {
            setSearchValue("");
        }
    }, [searchParams, location.pathname]);

    const items = [
        {
            key: '1',
            label: 'My Account',
            disabled: true,
            icon: <UserOutlined />,
        },
        {
            key: '2',
            label: 'Cart',
            icon: <ShoppingCartOutlined />,
            onClick: () => {
                navigate('/cart');
            },
        },
        {
            type: 'divider',
        },
        {
            key: '3',
            label: 'Sign Out',
            icon: <LogoutOutlined />,
            onClick: () => {
                logout(() => navigate('/'));
            },
        },
    ];

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        if (showSearch && !searchParams.get('q')) {
            setSearchValue("");
        }
    };

    const showSearchContent = (e) => {
        const newValue = e.target.value;
        setSearchValue(newValue);
        
        if (newValue === '' && location.pathname === '/search') {
            navigate('/');
        }
    };
    const handleSearch = (value) => {
        if (value.trim()) {
            setSelectedNav(null);
            navigate(`/search?q=${encodeURIComponent(value)}`);
        } else {
            navigate('/');
        }
    };
    const getFirstName = (fullName) => {
        if (!fullName) return '';
        return fullName.trim().split(' ')[0];
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

                    <div className={`header-right ${user ? 'logged-in' : ''}`}>
                        <div className={`search-container ${showSearch ? 'expanded' : ''}`}>
                            <Input
                                placeholder="Search..."
                                className="search-input"
                                allowClear
                                onPressEnter={(e) => handleSearch(e.target.value)}
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
                            {user ?
                                <>
                                    <Dropdown menu={{ items }} placement="bottomRight">
                                        <div className="user-account">
                                            <UserOutlined className="user-icon" />
                                            <div className="user-info">
                                                <span className="user-greeting">Hi, {getFirstName(user.name)}</span>
                                                <span className="user-account-text">Account</span>
                                            </div>
                                        </div>
                                    </Dropdown>

                                    <div
                                        className="cart-icon-wrapper"
                                        onClick={() => navigate('/cart')}
                                        title=""
                                    >
                                        <Badge
                                            count={cartCount}
                                            offset={[0, 0]}
                                            size="small"
                                            title=""
                                            style={{ pointerEvents: 'none' }}
                                        >
                                            <span title="">
                                                <ShoppingCartOutlined className="cart-icon" />
                                            </span>
                                        </Badge>
                                    </div>
                                </>
                                :
                                <UserOutlined className="account-icon" onClick={() => { navigate('/login'); }} />
                            }
                        </div>
                    </div>
                </div>
                <Nav />
            </Layout.Header>
        </ConfigProvider>
    );
};

export default Header;

