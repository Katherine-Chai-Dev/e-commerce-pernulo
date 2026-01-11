import React from 'react';
import { Card, Space } from 'antd';

const AboutUs = () => {
    return (
        <div>
  <Space vertical size={16}>
    <Card title="Tech Support"  style={{ width: 800 }}>
      <p>Qianying Chai</p>
      <img src={"http://localhost:8000/uploads/profile/engineer.jpeg"} className="thumbnail-image" />
      <p>Full Stack Engineer</p>
      <p>Master Degree at University of Reading</p>
      <p>Front-end Skills:Javascript, React.js, HTML, CSS</p>
      <p>Back-end Skills:Python, Java, SQL, Flask, FastAPI</p>
    </Card>
    <Card size="large" title="Jewelry Designer"  style={{ width: 800 }}>
      <p>Xiaoming Huang</p>
      <p>Card content</p>
      <p>Card content</p>
    </Card>
  </Space>
        </div>
    );
}

export default AboutUs;