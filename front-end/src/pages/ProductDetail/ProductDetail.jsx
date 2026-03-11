import React, { useState, useEffect } from 'react';
import "./ProductDetail.css"
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Card, ConfigProvider, Button, Modal } from 'antd';
import { SketchOutlined, StarOutlined, GoldOutlined, ShoppingCartOutlined, LoginOutlined } from '@ant-design/icons';
import Toast from '../../components/Toast/Toast';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { API_BASE_URL } from '../../constants/api';

const ProductDetail = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [product, setProduct] = useState()
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);
    const { addToCart, cartItems } = useCart();
    const { user } = useUser();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleAddToCart = () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }

        const existingItem = cartItems.find(item => item.id === product.id);
        const message = existingItem ? 'Updated quantity in cart' : 'Added to cart';
        showToast(message, 'success');
        addToCart(product);
    };

    const handleBuyNow = () => {
        navigate('/buy-now', {
            state: {
                product: product,
                quantity: 1
            }
        });
    };

    const handleGoToLogin = () => {
        setShowLoginModal(false);
        navigate('/login');
    };

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching product:', err);
                setLoading(false);
            });
    }, [id]);

    const showToast = (message, type = 'success', callback) => {
        setToast({ message, type });
        setTimeout(() => {
            if (callback) callback();
        }, 500);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!product) {
        return <div className="error">Product not found</div>;
    }

    return (
        <ConfigProvider theme={{ token: {} }}>
            <Layout.Content className='content'>
                <div className='product-detail-container'>
                    <div className="gallery-container">
                        <div className="main-image-container">
                            <div className="image-wrapper">
                                <img
                                    src={product?.image_paths[selectedIndex]}
                                    alt={product.product_name}
                                    className="main-image"
                                />
                            </div>
                        </div>
                        <div className="thumbnail-strip">
                            {product?.image_paths?.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedIndex(index)}
                                    className={`thumbnail-button ${selectedIndex === index ? 'active' : ''}`}
                                >
                                    <img
                                        src={image}
                                        alt={product.product_name}
                                        className="thumbnail-image"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="product-info-wrapper">
                        <Card title={product.product_name} className='product-info-card'>
                            <div className="detail-product-price">
                                {Number(product.discount) > 0 ?
                                    <>
                                        <div>
                                            <span className='price'>${product.discounted_price}</span>
                                            <span className="price-original">${product.original_price}</span>
                                        </div>
                                        <div className="detail-discount-row">
                                            <span className="detail-discount-badge">{parseInt(product.discount)}% off</span>
                                        </div>
                                    </> : <span className='price'>${product.original_price}</span>
                                }
                            </div>
                            {product.description && (
                                <p className="detail-product-description">{product.description}</p>
                            )}
                            <div className="product-details">
                                {product.gemstone && (
                                    <div className="product-detail-item">
                                        <SketchOutlined />
                                        <span className="detail-label">Gemstone:</span>
                                        <span className="detail-value">{product.gemstone}</span>
                                    </div>
                                )}
                                {product.materials && (
                                    <div className="product-detail-item">
                                        <StarOutlined />
                                        <span className="detail-label">Materials:</span>
                                        <span className="detail-value">{product.materials}</span>
                                    </div>
                                )}
                                {product.size && (
                                    <div className="product-detail-item">
                                        <GoldOutlined />
                                        <span className="detail-label">Size:</span>
                                        <span className="detail-value">{product.size}</span>
                                    </div>
                                )}
                            </div>

                            <div className="button-container">
                                <Button className="add-to-cart-btn" onClick={handleAddToCart}>
                                    <ShoppingCartOutlined /> Add to Cart
                                </Button>
                                <Button className="buy-now-btn" color="cyan" onClick={handleBuyNow}>
                                    Buy Now
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </Layout.Content>

            {/* Login Required Modal */}
            <Modal
                open={showLoginModal}
                onCancel={() => setShowLoginModal(false)}
                footer={null}
                centered
                width={400}
                className="login-modal"
            >
                <div className="login-modal-content">
                    <div className="login-modal-icon">
                        <LoginOutlined />
                    </div>
                    <h2 className="login-modal-title">Sign In Required</h2>
                    <p className="login-modal-text">
                        Please sign in to your account to add items to your cart.
                    </p>
                    <div className="login-modal-buttons">
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleGoToLogin}
                            className="login-modal-signin-btn"
                        >
                            Sign In
                        </Button>
                        <Button
                            size="large"
                            onClick={() => setShowLoginModal(false)}
                            className="login-modal-cancel-btn"
                        >
                            Continue Browsing
                        </Button>
                    </div>
                </div>
            </Modal>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </ConfigProvider>
    );
};

export default ProductDetail;
