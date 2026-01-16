import "./Nav.css"
import React, { useState, useRef, useEffect } from 'react';
import {useNavigate, useLocation } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Menu } from 'antd';
import { useProducts } from '../../context/ProductContext';

const Nav = () => {
  const navRef = useRef(null);
  const navigate = useNavigate();
  const { selectedNav, setSelectedNav } = useProducts();
  const location = useLocation();


  const items = [
    {
      label: 'Home',
      key: '/'
    },
    {
      label: 'Earrings',
      key: '/shop/earrings'
    },
    {
      label: 'Necklaces',
      key: '/shop/necklaces',
    },
    {
       label: 'Bracelets',
       key: '/shop/bracelets'
    },
    {

         label: 'Broochs',
          key: '/shop/broochs'
    },
    {
           label: 'All',
        key: '/shop/all-pearl-jewelry'
    },
    {
      label: 'About Us',
      key: '/about-us',
    },
    {
      label: 'Contact',
      key: '/contact',
    },
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const matchedItem = items.find(item => item.key === currentPath);
    if (matchedItem) {
      setSelectedNav(currentPath);
    } else{
      setSelectedNav(null); 
    }
  }, [location.pathname]);

  const handleClick = (e) => {
    setSelectedNav(e.key);
    navigate(e.key);
};


  return (
    <ConfigProvider
      theme={{
        token: {
          colorText:'rgb(40, 40, 40)',
          colorPrimary: 'rgb(2, 99, 2)',
        },
        components: {
          Menu: {
            itemHoverBg: 'rgba(78, 161, 163, 0.3)',  
            itemHoverColor: '#1db292',
            itemSelectedBg: 'rgba(230, 247, 243, 0.5)',  
            itemSelectedColor: '#1db292',
            subMenuItemBg: '#ffffff',
            horizontalItemHoverColor: '#1db292',
          },
        }
      }}
    >
      <div className='nav-container' ref={navRef}>
        <Menu 
          mode="horizontal" 
          items={items} 
          className="nav"
          onClick={handleClick}
          selectedKeys={selectedNav ? [selectedNav] : []} 
        />
      </div >
    </ConfigProvider>
  )
}

export default Nav


