import React from 'react';
import './Cart.css';
import { Layout, Card, Button, Empty, Divider } from 'antd';
import { DeleteOutlined, ShoppingOutlined, ArrowLeftOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';

const Cart = () => {
    const { user,loggingOut } = useUser();
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity } = useCart();



    const incrementQuantity = (productId, currentQuantity) => {
        updateQuantity(productId, currentQuantity + 1);
    };

    const decrementQuantity = (productId, currentQuantity) => {
        if (currentQuantity > 1) {
            updateQuantity(productId, currentQuantity - 1);
        }
    };

    const getTotalItemCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };


    const calculateOriginalTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (parseFloat(item.original_price) * item.quantity);
        }, 0);
    };

  
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.discounted_price || item.original_price;
            return total + (parseFloat(price) * item.quantity);
        }, 0);
    };

    
    const calculateSavings = () => {
        return cartItems.reduce((total, item) => {
            if (item.discount > 0 && item.discounted_price) {
                const saved = (parseFloat(item.original_price) - parseFloat(item.discounted_price)) * item.quantity;
                return total + saved;
            }
            return total;
        }, 0);
    };

    const handleContinueShopping = () => {
        navigate('/shop/all-pearl-jewelry');
    };

    const savings = calculateSavings();
    const hasSavings = savings > 0;

    if (loggingOut) {
        return null; 
    }

    return (
        <Layout.Content className="cart-content">
            <div className="cart-container">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={handleContinueShopping}
                        className="continue-shopping-btn"
                    >
                        Continue Shopping
                    </Button>
                </div>

                {cartItems.length === 0 ? (
                    <Card className="empty-cart-card">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Your cart is empty"
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
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items-section">
                            {cartItems.map((item) => (
                                <Card key={item.id} className="cart-item-card">
                                    <div className="cart-item">
                                        <div className="item-image-container">
                                            <img
                                                src={`http://localhost:8000/uploads/products/${item.image_paths?.[0]}`}
                                                alt={item.product_name}
                                                className="item-image"
                                                onClick={() => navigate(`/product-detail/${item.id}`)}
                                            />
                                        </div>

                                        <div className="item-content">
                                            <div className="item-details">
                                                <h3
                                                    className="item-name"
                                                    onClick={() => navigate(`/product-detail/${item.id}`)}
                                                >
                                                    {item.product_name}
                                                </h3>

                                                {item.gemstone && (
                                                    <p className="item-attribute">
                                                        <span>Gemstone:</span> {item.gemstone}
                                                    </p>
                                                )}
                                                {item.materials && (
                                                    <p className="item-attribute">
                                                        <span>Materials:</span> {item.materials}
                                                    </p>
                                                )}
                                                {item.size && (
                                                    <p className="item-attribute">
                                                        <span>Size:</span> {item.size}
                                                    </p>
                                                )}

                                                <div className="item-price-section">
                                                    {item.discount > 0 ? (
                                                        <>
                                                            <span className="item-price">${item.discounted_price}</span>
                                                            <span className="item-price-original">${item.original_price}</span>
                                                            <span className="item-discount-badge">
                                                                {parseInt(item.discount)}% off
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="item-price">${item.original_price}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="item-actions">
                                                <div className="quantity-control">
                                                    <Button
                                                        className="quantity-btn"
                                                        icon={<MinusOutlined />}
                                                        onClick={() => decrementQuantity(item.id, item.quantity)}
                                                        disabled={item.quantity <= 1}
                                                    />
                                                    <span className="quantity-display">{item.quantity}</span>
                                                    <Button
                                                        className="quantity-btn"
                                                        icon={<PlusOutlined />}
                                                        onClick={() => incrementQuantity(item.id, item.quantity)}
                                                    />
                                                </div>

                                                <Button
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="remove-btn"
                                                    size="small"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="cart-summary-section">
                            <Card className="summary-card">
                                <h2>Order Summary</h2>
                                <Divider />

                                <div className="summary-row">
                                    <span>Subtotal ({getTotalItemCount()} item{getTotalItemCount() > 1 ? 's' : ''}):</span>
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
                )}
            </div>
        </Layout.Content>
    );
};

export default Cart;