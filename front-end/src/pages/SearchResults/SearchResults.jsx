import "./SearchResults.css"
import React, { useState, useEffect } from 'react';
import { useSearchParams,useNavigate } from 'react-router-dom';
import { Row, Col, Layout, Spin, Space,Button,Result  } from 'antd';
import CardComponent from '../../components/Card/CardComponent';
import { useProducts } from '../../context/Context';


const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    console.log("query", query)
    const navigate = useNavigate();
  
    const { products, loading } = useProducts();
    if (loading) {
        return (
            <div className="search-loading">
                <Spin size="large" />
            </div>
        );
    }


    const filteredProducts = products?.filter(product => {
        const name = product.product_name.toLowerCase();
        
        const search = query
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .trim();
    
        const variations = [
            search,
            search.endsWith('s') ? search.slice(0, -1) : search,
            search.endsWith('ss') ? search.slice(0, -2) : search,
            search + 's',
        ];
    
        return variations.some(term => name.includes(term));
    });

if (!filteredProducts || filteredProducts.length === 0) {
    return (
        <div className="result-wrapper">
        <Result
            status="404"
            title="No products found"
            subTitle={`Sorry, we couldn't find any products matching "${query}"`}
            extra={
                <Button type="primary" onClick={() => navigate('/')}>
                    Back to Home Page
                </Button>
            }
        />
        </div>
    );
}




    return (
        <Layout.Content className='content'>
            <div className="products-section">
                <Space className='list-name' >Search Results</Space>
                <Row gutter={[20, 30]}>
                    {filteredProducts?.map((product) => (
                        <Col
                            xs={12}
                            sm={8}
                            md={6}
                            lg={6}
                            xl={4}
                            xxl={4}
                            key={product.id}
                        >
                            <CardComponent product={product} />
                        </Col>
                    ))}
                </Row>
            </div>
        </Layout.Content>

    );
};

export default SearchResults;