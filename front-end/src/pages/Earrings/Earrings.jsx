import { Layout, Space, ConfigProvider, Col, Row } from 'antd';
import { useProducts } from '../../context/Context';
import CardComponent from '../../components/Card/CardComponent';
const Earrings = () => {
    const { products, loading } = useProducts();

    console.log("products", products)

    const filteredProducts = products?.filter(product => product.product_name.toLowerCase().includes("earrings"));
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
                    <Space className='list-name'>Earrings</Space>
                    <Row gutter={[20, 30]}>
                        {filteredProducts?.map((product) => (
                            <Col
                                xs={24}
                                sm={12}
                                md={8}
                                lg={6}
                                xl={6}
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

export default Earrings;