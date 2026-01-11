import React, { useState, useEffect } from 'react';
import "./ProductDetail.css"
import { useParams } from 'react-router-dom';
import { Layout, Card, ConfigProvider, Button } from 'antd';
import { SketchOutlined, StarOutlined, GoldOutlined, ShoppingCartOutlined, CreditCardOutlined } from '@ant-design/icons';

const ProductDetail = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [product, setProduct] = useState()
    const { id } = useParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8000/api/products/${id}`)
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
                                    src={`http://localhost:8000/uploads/products/${product?.image_paths[selectedIndex]}`}
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
                                        src={`http://localhost:8000/uploads/products/${image}`}
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
                            {Number(product.discount) > 0?
                                    <>
                                    <div>
                                    <span  className='price'>${product.discounted_price}</span>
                                        <span className="price-original">${product.original_price}</span>

                                        </div>
                                        <div className="detail-discount-row">
                                            <span className="detail-discount-badge">{parseInt(product.discount)}% off</span> 
                                        </div>
                                    </>: <span className='price'>${product.original_price}</span>
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
                                <Button className="add-to-cart-btn">
                                    <ShoppingCartOutlined /> Add to Cart
                                </Button>
                                <Button className="buy-now-btn" color="cyan">
                                    Buy Now
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </Layout.Content>
        </ConfigProvider>
    );
};

export default ProductDetail;
