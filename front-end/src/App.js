import './App.css';
import React, { Suspense, lazy } from 'react';
import { Flex, Layout } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { UserProvider } from './context/UserContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from "./pages/Home/Home";
import { CartProvider } from './context/CartContext';

const AboutUs = lazy(() => import("./pages/AboutUs/AboutUs"));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const Earrings = lazy(() => import('./pages/Earrings/Earrings'));
const Necklaces = lazy(() => import('./pages/Necklaces/Necklaces'));
const Bracelets = lazy(() => import('./pages/Bracelets/Bracelets'));
const Broochs = lazy(() => import("./pages/Broochs/Broochs"));
const AllPearlJewelry = lazy(() => import('./pages/AllPearlJewelry/AllPearlJewelry'));
const PeoductDetail = lazy(() => import("./pages/ProductDetail/ProductDetail"));
const SearchResults = lazy(() => import("./pages/SearchResults/SearchResults"));
const Login = lazy(() => import("./pages/Login/Login"));
const Cart = lazy(() => import('./pages/Cart/Cart'));
const BuyNow = lazy(() => import('./pages/BuyNow/BuyNow'));
const Register = lazy(() => import('./pages/Register/Register'));
const ForgotPassword = lazy(() => import('./pages/Login/ForgotPassword'));
const ResetPassword = lazy(() => import("./pages/Login/ResetPassword"));


const App = () => (
  <BrowserRouter>
    <ProductProvider>
      <UserProvider>
        <CartProvider>

          <Flex gap="middle" wrap>
            <Layout className="layout-container">
              <Header />
              <div className="main-content">
                <Suspense fallback={<div className="loading">Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/product-detail/:id" element={<PeoductDetail />} />
                  <Route path="/shop/earrings" element={<Earrings />} />
                  <Route path="/shop/necklaces" element={<Necklaces />} />
                  <Route path="/shop/bracelets" element={<Bracelets />} />
                  <Route path="/shop/broochs" element={<Broochs />} />
                  <Route path='/shop/all-pearl-jewelry' element={<AllPearlJewelry />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/buy-now" element={<BuyNow />} />
                </Routes>
                </Suspense>
              </div>
              <Footer />
            </Layout>
          </Flex>
        </CartProvider>
      </UserProvider>
    </ProductProvider>

  </BrowserRouter>
);

export default App;