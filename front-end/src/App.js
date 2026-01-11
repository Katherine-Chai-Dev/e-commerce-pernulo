import './App.css';
import React from 'react';
import { Flex, Layout } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from"./pages/Home/Home";
import AboutUs from "./pages/AboutUs/AboutUs"
import Contact from './pages/Contact/Contact';
import Earrings from './pages/Earrings/Earrings';
import Necklaces from './pages/Necklaces/Necklaces';
import Bracelets from './pages/Bracelets/Bracelets';
import Broochs from "./pages/Broochs/Broochs"
import AllPearlJewelry from './pages/AllPearlJewelry/AllPearlJewelry';
import PeoductDetail from "../src/pages/ProductDetail/ProductDetail"
import { ProductProvider } from './context/Context';

const App = () => (
  <BrowserRouter>
     <ProductProvider>
  <Flex gap="middle" wrap>
    <Layout className="layout-container">
      <Header/>
      <div className="main-content">
      <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product-detail/:id" element={<PeoductDetail />} />
                <Route path="/shop/earrings" element={<Earrings />} />
                <Route path="/shop/necklaces" element={<Necklaces />} />
                <Route path="/shop/bracelets" element={<Bracelets/>} />
                <Route path="/shop/broochs" element={<Broochs />} />
                <Route path='/shop/all-pearl-jewelry'element={<AllPearlJewelry/>} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
            </div>
            <Footer />
    </Layout>
  </Flex>
  </ProductProvider>
  </BrowserRouter>
);

export default App;