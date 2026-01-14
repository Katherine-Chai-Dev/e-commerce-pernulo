import { Layout, Space, Flex, ConfigProvider, Col, Row } from 'antd';
import Slider from "../../components/Slider/Slider"
import "./Home.css"
import CardComponent from "../../components/Card/CardComponent"
import { useProducts } from "../../context/Context";

const Home = () => {
    const { products } = useProducts();
    return (
        <ConfigProvider
            theme={{
                token: {

                },
            }}
        >
            <Layout.Content className='content'>
                <Slider />
                <div className="products-section">
                    <Space className='list-name'>Popular Products</Space>
                    <Row gutter={[20, 30]}>
                        {products.map((product) => (

                            <Col
                                xs={24}
                                sm={12}
                                md={8}
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
export default Home