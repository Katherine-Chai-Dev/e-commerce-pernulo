import React from "react";
import { Layout, Button, Flex, Segmented, Tooltip, ConfigProvider } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import Nav from "../Nav/Nav";
import "./Header.css"


const Header = () => {
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
                    <Tooltip title="search">
                        <Button shape="circle" className="search-button" size="large" icon={<SearchOutlined />} />
                    </Tooltip>
                    <UserOutlined className="account-icon" />
                </div>
                </div>
          
                <Nav /> 

        

          
             
          


            </Layout.Header>
        </ConfigProvider>


    )

}

export default Header;