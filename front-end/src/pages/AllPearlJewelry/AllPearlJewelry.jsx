import { Layout, Space, Flex, ConfigProvider, Col, Row } from 'antd';
import Slider from "../../components/Slider/Slider"
import CardComponent from "../../components/Card/CardComponent"
import { useProducts } from "../../context/ProductContext";

const AllPearlJewelry = () => {
    const { products } = useProducts();
    console.log(products)

    return (
        <ConfigProvider
            theme={{
                token: {

                },
            }}
        >
            <Layout.Content className='content'>
                <div className="products-section">
                    <Space className='list-name'>All Pearl Jewelry</Space>
                    <Row gutter={[20, 30]}>
                        {products.map((product) => (
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
export default AllPearlJewelry