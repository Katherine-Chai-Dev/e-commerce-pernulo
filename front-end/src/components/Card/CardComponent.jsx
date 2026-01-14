import React from "react"
import { Card, ConfigProvider, Button } from 'antd';
import "./CardComponent.css"
import { useNavigate } from 'react-router-dom';

const CardComponent = ({ product }) => {
    const navigate = useNavigate()
    console.log(product.image_paths[0])
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
                            style={{ minHeight: "180px", minWidth: "180px" }}
                            alt="example"
                            src={`http://localhost:8000/uploads/products/${product.image_paths[0]}`}
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
                                        <span style={{ color: 'green' }}>${product.discounted_price}</span>
                                        <span style={{ textDecoration: 'line-through', color: 'grey', padding: "0 3px", fontSize: "12px" }}>
                                            ${product.original_price}
                                        </span>
                                    </p>
                                    <Button variant="solid" className="card-button" size="small">
                                        Buy now
                                    </Button>
                                </div>
                            ) : (
                                <div className="product-description">
                                    <span className="product-price">
                                        ${product.original_price}
                                    </span>
                                    <Button variant="solid" className="card-button" size="small">
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