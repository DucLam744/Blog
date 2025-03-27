import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { environment,  } from '../../../shared/constants/StorageKey';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    totalComments: 0,
    recentBlogs: [],
    topUsers: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(`${environment.apiUrl}/users`);
        const users = usersResponse.data;
        
        const blogsResponse = await axios.get(`${environment.apiUrl}/blogs`);
        const blogs = blogsResponse.data;
        
        const totalComments = blogs.reduce((sum, blog) => sum + (blog.comments ? blog.comments.length : 0), 0);
        
        const recentBlogs = [...blogs].sort((a, b) => new Date(b.createDate) - new Date(a.createDate)).slice(0, 5);
        
        const topUsers = [...users]
          .sort((a, b) => (b.followers ? b.followers.length : 0) - (a.followers ? a.followers.length : 0))
          .slice(0, 5)
          .map(user => ({
            id: user.id,
            username: user.username,
            followers: user.followers ? user.followers.length : 0
          }));
        
        setStats({
          totalUsers: users.length,
          totalBlogs: blogs.length,
          totalComments,
          recentBlogs,
          topUsers
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const chartData = stats.topUsers.map(user => ({
    name: user.username,
    followers: user.followers
  }));

  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center mb-3">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text className="display-4">{stats.totalUsers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center mb-3">
            <Card.Body>
              <Card.Title>Total Blogs</Card.Title>
              <Card.Text className="display-4">{stats.totalBlogs}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center mb-3">
            <Card.Body>
              <Card.Title>Total Comments</Card.Title>
              <Card.Text className="display-4">{stats.totalComments}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header>Top Users by Followers</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="followers" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>Recent Blogs</Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Date</th>
                      <th>Likes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentBlogs.map(blog => (
                      <tr key={blog.id}>
                        <td>{blog.title}</td>
                        <td>{blog.authorId}</td>
                        <td>{blog.createDate}</td>
                        <td>{blog.likes ? blog.likes.length : 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
