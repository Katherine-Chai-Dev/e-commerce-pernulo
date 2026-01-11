import React from "react"
import { Card, ConfigProvider, Button } from 'antd';
import "./CardComponent.css"
import { useNavigate } from 'react-router-dom';

const getLocalImage = (url) => {
    if (!url) return url;
    const filename = url.split('/').pop().replace('.png', '.webp');
    return `/product-images/480-webp/${filename}`;
};

const CardComponent = ({ product }) => {
    const navigate = useNavigate()
    const handleBuyNow = (e) => {
        e.stopPropagation();
        navigate('/buy-now', {
            state: {
                product: product,
                quantity: 1
            }
        });
    };
    return (
        <ConfigProvider
            theme={{
                components: {
                    Button: {

                    },
                },
            }}
        >
            <div>
                <Card
                    hoverable
                    style={{ maxWidth: 240 }}
                    className='card'
                    cover={
                        <img
                            draggable={false}
                            // style={{ minHeight: "180px", minWidth: "180px" }}
                            alt="example"
                            loading="lazy"
                            src={getLocalImage(product.image_paths[0])}
                            onClick={() => navigate(`/product-detail/${product.id}`)}
                        />
                    }
                >
                    <Card.Meta
                        title={product.product_name}
                        description={
                            Number(product.discount) > 0 ? (
                                <div className="product-description">
                                    <p className="product-price">
                                        <span className="discounted_price">${product.discounted_price}</span>
                                        <span  className="original_price">
                                            ${product.original_price}
                                        </span>
                                    </p>
                                    <Button variant="solid" className="card-button" size="small" onClick={handleBuyNow}>
                                        Buy now
                                    </Button>
                                </div>
                            ) : (
                                <div className="product-description">
                                    <span className="product-price">
                                        ${product.original_price}
                                    </span>
                                    <Button variant="solid" className="card-button" size="small" onClick={handleBuyNow}>
                                        Buy now
                                    </Button>
                                </div>
                            )
                        }
                    />
                </Card>
            </div>
        </ConfigProvider>
    )
}

export default CardComponent