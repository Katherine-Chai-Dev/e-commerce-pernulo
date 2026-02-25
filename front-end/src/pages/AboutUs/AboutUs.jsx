import React from 'react';
import { Card, Row, Col, Typography, Avatar, Tag, Divider } from 'antd';
import './AboutUs.css';

const { Title, Text, Paragraph } = Typography;

const teamMembers = [
  {
    name: 'Qianying Chai',
    role: 'Full Stack Engineer',
    image: 'https://res.cloudinary.com/dbl5qax3y/image/upload/v1771283944/engineer_ytaw5i.jpg',
    education: "Master's Degree at University of Reading",
    description: `Full stack engineer with expertise in building dynamic, scalable web applications from concept to deployment. Proficient in creating responsive, user-friendly interfaces using modern React patterns, CSS, and Flexbox. Experienced in developing robust RESTful APIs with FastAPI and Flask, with strong skills in database design (SQLAlchemy, SQLModel) and data validation (Pydantic). Passionate about writing clean, maintainable code, delivering exceptional user experiences, and continuously learning.`,
    skills: {
      frontend: [
        'HTML', 'CSS', 'JavaScript', 'TypeScript',
        'React.js', 'React Router', 'React Hooks',
        'UI Frameworks', 'Node.js'
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

  {
    name: 'Xiaoming Huang',
    role: 'Master Pearl Jewelry Designer',
    image: 'https://res.cloudinary.com/dbl5qax3y/image/upload/v1771283935/jewelry-designer-1_gjc98b.png',
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