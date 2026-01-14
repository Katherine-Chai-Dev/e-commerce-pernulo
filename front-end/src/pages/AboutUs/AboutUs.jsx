// import React from 'react';
// import { Card, Space } from 'antd';

// const AboutUs = () => {
//     return (
//         <div>
//   <Space vertical size={16}>
//     <Card title="Tech Support"  style={{ width: 800 }}>
//       <p>Qianying Chai</p>
//       <div className="profile-image">
//       <img src={"http://localhost:8000/uploads/profile/engineer.jpeg"}  />
//       </div>
//       <p>Full Stack Engineer</p>
//       <p>Master Degree at University of Reading</p>
//       <p>Front-end Skills:Javascript, React.js, HTML, CSS</p>
//       <p>Back-end Skills:Python, Java, SQL, Flask, FastAPI</p>
//     </Card>
//     <Card size="large" title="Jewelry Designer"  style={{ width: 800 }}>
//       <p>Xiaoming Huang</p>
//       <img src={"http://localhost:8000/uploads/profile/jewelry-designer.png"}  />
//       <p>Graduate at SJSU</p>
//       <p> design Preal Jewalry for over 10 years.sold over 6k amount jewalry, each of them  are totally handmade and made with 100% genuine pearls.
//       —  Purchase pearls directly from pearl farmers and Pearl whole Sale to bring different shapes, quality and colors pearls for each customers to meet their different demands.  </p>
//     </Card>
//   </Space>
//         </div>
//     );
// }

// export default AboutUs;

import React from 'react';
import { Card, Row, Col, Typography, Avatar, Tag, Divider } from 'antd';
import './AboutUs.css';

const { Title, Text, Paragraph } = Typography;

const teamMembers = [
  {
    name: 'Qianying Chai',
    role: 'Full Stack Engineer',
    image: 'http://localhost:8000/uploads/profile/engineer.jpeg',
    education: "Master's Degree at University of Reading",    
    description: `Full stack engineer with expertise in building dynamic, scalable web applications from concept to deployment. Proficient in creating responsive, user-friendly interfaces using modern React patterns, CSS, and Flexbox. Experienced in developing robust RESTful APIs with FastAPI and Flask, with strong skills in database design (SQLAlchemy, SQLModel) and data validation (Pydantic). Passionate about writing clean, maintainable code, delivering exceptional user experiences, and continuously learning.`,
      skills: {
        frontend: [
          'HTML', 'CSS', 'JavaScript', 'TypeScript',
          'React.js', 'React Router', 'React Hooks',
          'State Management (Redux & Context API)', 'UI Frameworks', 'Node.js'
        ],
        backend: [
          'Python', 'Java', 'FastAPI', 'Flask',
          'SQLAlchemy', 'SQLModel', 'Pydantic',
          'SQL', 'RESTful API'
        ],
        tools: ['Git', 'GitHub', 'npm', 'pip', 'Postman'],
      },
    
    type: 'engineer',
    color: '#1890ff',
  },
  // {
  //   name: 'Xiaoming Huang',
  //   role: 'Jewelry Designer',
  //   image: 'http://localhost:8000/uploads/profile/jewelry-designer.png',
  //   education: 'Graduate at San Jose State University',
  //   description:
  //     "Over 10 years of experience designing pearl jewelry. Sold over 6,000 handcrafted pieces, each made with 100% genuine pearls sourced directly from pearl farmers and wholesalers to bring unique shapes, quality, and colors to meet every customer's needs.",
  //   skills: {
  //     design: ['Pearl Selection', 'Handcrafting', 'Custom Design'],
  //     sourcing: ['Direct Sourcing', 'Quality Assessment', 'Wholesale'],
  //   },
  //   type: 'designer',
  //   color: '#eb2f96',
  // },
  {
    name: 'Xiaoming Huang',
    role: 'Master Pearl Jewelry Designer',
    image: 'http://localhost:8000/uploads/profile/jewelry-designer.png',
    education: 'B.A. in Design Studies, San José State University',
description:
  "Over 10 years of experience specializing in handcrafted pearl jewelry, with more than 6,000 pieces created. Every piece is meticulously handmade using 100% genuine, untreated pearls—preserving their natural luster and beauty.",
    skills: {
      design: [
        'Pearl Selection & Grading',
        'Artisan Handcrafting',
        'Bespoke Custom Design',
        'Color Matching & Coordination',
      ],
      sourcing: [
        'Direct Farm-to-Designer Sourcing',
        'Quality & Authenticity Assessment',
        'Wholesale Partnerships',
        'Rare Pearl Acquisition',
      ],
    },
    type: 'designer',
    color: '#eb2f96',
    quote: 'Every pearl has a story. I help it find the person meant to wear it.',
  }
];

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-content">
        <div className="about-us-header">
          <Title level={1} className="about-us-title">
            Meet Our Team
          </Title>
          <Text type="secondary" className="about-us-subtitle">
            The passionate people behind our beautiful pearl jewelry
          </Text>
        </div>

        <Row gutter={[32, 32]} justify="center">
          {teamMembers.map((member, index) => (
            <Col xs={24} md={12} key={index}>
              <Card hoverable className="team-card">
                <div className={`card-header ${member.type}`}>
                  <Avatar
                    src={member.image}
                    size={140}
                    className={`member-avatar ${member.type}`}
                  />
                  <Title level={3} className="member-name">
                    {member.name}
                  </Title>
                  <Tag color={member.color} className="role-tag">
                    {member.role}
                  </Tag>
                </div>

                <div className="card-body">
                  <Text type="secondary" className="education-text">
                    🎓 {member.education}
                  </Text>

                  <Paragraph className="member-description">
                    {member.description}
                  </Paragraph>

                  <Divider className="skills-divider" />

                  {Object.entries(member.skills).map(([category, skills]) => (
                    <div key={category} className="skills-section">
                      <Text strong className="skills-category">
                        {category}:
                      </Text>
                      <div className="skills-tags">
                        {skills.map((skill) => (
                          <Tag key={skill} className="skill-tag">
                            {skill}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="cta-section">
          <Title level={4} className="cta-title">
            Interested in our jewelry?
          </Title>
          <Text type="secondary">
            Each piece is handcrafted with love and genuine pearls
          </Text>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;