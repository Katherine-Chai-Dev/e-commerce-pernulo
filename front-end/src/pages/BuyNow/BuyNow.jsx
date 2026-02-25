
import React, { useState, useEffect } from 'react';
import '../Cart/Cart.css';
import { Layout, Card, Button, Empty, Divider } from 'antd';
import { DeleteOutlined, ShoppingOutlined, ArrowLeftOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const BuyNow = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();

    const [buyNowItem, setBuyNowItem] = useState(null);

    useEffect(() => {
        if (location.state?.product) {
            setBuyNowItem({
                ...location.state.product,
                quantity: location.state.quantity || 1
            });
        }
    }, [location.state]);

    const incrementQuantity = () => {
        setBuyNowItem(prev => ({
            ...prev,
            quantity: prev.quantity + 1
        }));
    };

    const decrementQuantity = () => {
        if (buyNowItem.quantity > 1) {
            setBuyNowItem(prev => ({
                ...prev,
                quantity: prev.quantity - 1
            }));
        }
    };

    const removeItem = () => {
        setBuyNowItem(null);
    };

    const calculateOriginalTotal = () => {
        if (!buyNowItem) return 0;
        return parseFloat(buyNowItem.original_price) * buyNowItem.quantity;
    };

    const calculateSubtotal = () => {
        if (!buyNowItem) return 0;
        const price = buyNowItem.discounted_price || buyNowItem.original_price;
        return parseFloat(price) * buyNowItem.quantity;
    };

    const calculateSavings = () => {
        if (!buyNowItem || !buyNowItem.discount || buyNowItem.discount <= 0) return 0;
        const saved = (parseFloat(buyNowItem.original_price) - parseFloat(buyNowItem.discounted_price)) * buyNowItem.quantity;
        return saved;
    };

    const handleContinueShopping = () => {
        navigate('/shop/all-pearl-jewelry');
    };

    const savings = calculateSavings();
    const hasSavings = savings > 0;


    if (!buyNowItem) {
        return (
            <Layout.Content className="cart-content">
                <div className="cart-container">
                    <div className="cart-header">
                        <h1>Buy Now</h1>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={handleContinueShopping}
                            className="continue-shopping-btn"
                        >
                            Continue Shopping
                        </Button>
                    </div>
                    <Card className="empty-cart-card">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No item selected"
                        >
                            <Button
                                type="primary"
                                icon={<ShoppingOutlined />}
                                onClick={handleContinueShopping}
                            >
                                Start Shopping
                            </Button>
                        </Empty>
                    </Card>
                </div>
            </Layout.Content>
        );
    }

    return (
        <Layout.Content className="cart-content">
            <div className="cart-container">
                <div className="cart-header">
                    <h1>Checkout</h1>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={handleContinueShopping}
                        className="continue-shopping-btn"
                    >
                        Continue Shopping
                    </Button>
                </div>

                <div className="cart-layout">
                    <div className="cart-items-section">
                        <Card className="cart-item-card">
                            <div className="cart-item">
                                <div className="item-image-container">
                                    <img
                                        src={buyNowItem.image_paths?.[0]}
                                        alt={buyNowItem.product_name}
                                        className="item-image"
                                        onClick={() => navigate(`/product-detail/${buyNowItem.id}`)}
                                    />
                                </div>

                                <div className="item-content">
                                    <div className="item-details">
                                        <h3
                                            className="item-name"
                                            onClick={() => navigate(`/product-detail/${buyNowItem.id}`)}
                                        >
                                            {buyNowItem.product_name}
                                        </h3>

                                        {buyNowItem.gemstone && (
                                            <p className="item-attribute">
                                                <span>Gemstone:</span> {buyNowItem.gemstone}
                                            </p>
                                        )}
                                        {buyNowItem.materials && (
                                            <p className="item-attribute">
                                                <span>Materials:</span> {buyNowItem.materials}
                                            </p>
                                        )}
                                        {buyNowItem.size && (
                                            <p className="item-attribute">
                                                <span>Size:</span> {buyNowItem.size}
                                            </p>
                                        )}

                                        <div className="item-price-section">
                                            {buyNowItem.discount > 0 ? (
                                                <>
                                                    <span className="item-price">${buyNowItem.discounted_price}</span>
                                                    <span className="item-price-original">${buyNowItem.original_price}</span>
                                                    <span className="item-discount-badge">
                                                        {parseInt(buyNowItem.discount)}% off
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="item-price">${buyNowItem.original_price}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="item-actions">
                                        <div className="quantity-control">
                                            <Button
                                                className="quantity-btn"
                                                icon={<MinusOutlined />}
                                                onClick={decrementQuantity}
                                                disabled={buyNowItem.quantity <= 1}
                                            />
                                            <span className="quantity-display">{buyNowItem.quantity}</span>
                                            <Button
                                                className="quantity-btn"
                                                icon={<PlusOutlined />}
                                                onClick={incrementQuantity}
                                            />
                                        </div>

                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={removeItem}
                                            className="remove-btn"
                                            size="small"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="cart-summary-section">
                        <Card className="summary-card">
                            <h2>Order Summary</h2>
                            <Divider />

                            <div className="summary-row">
                                <span>Subtotal ({buyNowItem.quantity} item{buyNowItem.quantity > 1 ? 's' : ''}):</span>
                                {hasSavings ? (
                                    <span className="original-total">${calculateOriginalTotal().toFixed(2)}</span>
                                ) : (
                                    <span>${calculateSubtotal().toFixed(2)}</span>
                                )}
                            </div>

                            {hasSavings && (
                                <>
                                    <div className="summary-row savings-row">
                                        <span>Savings:</span>
                                        <span className="savings-amount">-${savings.toFixed(2)}</span>
                                    </div>
                                    <div className="summary-row after-savings-row">
                                        <span></span>
                                        <span className="after-savings-amount">${calculateSubtotal().toFixed(2)}</span>
                                    </div>
                                </>
                            )}

                            <div className="summary-row">
                                <span>Shipping:</span>
                                <span className="free-shipping">FREE</span>
                            </div>

                            <div className="summary-row">
                                <span>Tax:</span>
                                <span>Calculated at checkout</span>
                            </div>

                            <Divider />

                            <div className="summary-row total-row">
                                <span>Estimated Total:</span>
                                <span className="total-amount">${calculateSubtotal().toFixed(2)}</span>
                            </div>

                            <Button
                                type="primary"
                                size="large"
                                block
                                className="checkout-btn"
                            >
                                {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                            </Button>

                            <div className="security-badges">
                                <p>🔒 Secure Checkout</p>
                                <p>✓ Free Shipping</p>
                                <p>✓ Easy Returns</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout.Content>
    );
};

export default BuyNow;