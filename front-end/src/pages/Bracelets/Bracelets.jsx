import { Layout, Space, Flex, ConfigProvider, Col, Row } from 'antd';
import { useProducts } from '../../context/ProductContext';
import CardComponent from '../../components/Card/CardComponent';
const  Bracelets= () => {
    const { products, loading } = useProducts();
    console.log("products", products)

    const filteredProducts = products?.filter(product => product.product_name.toLowerCase().includes("bracelet"));
    if (loading) return <p>Loading...</p>;

    return (
        <ConfigProvider
            theme={{
                token: {

                },
            }}
        >
            <Layout.Content className='content'>
                <div className="products-section">
                    <Space className='list-name' >Bracelets</Space>
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
        </ConfigProvider>)

}

export default Bracelets;