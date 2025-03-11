import React, { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  // Thay thế useHistory bằng useNavigate

// Tải dữ liệu từ tệp JSON
import userData from '../data/data.json';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();  // Sử dụng useNavigate thay vì useHistory

  // Xử lý đăng nhập
  const handleLogin = () => {
    const user = userData.users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      setErrorMessage('');
      navigate('/posts');  // Điều hướng đến trang danh sách bài viết
    } else {
      setErrorMessage('Tên đăng nhập hoặc mật khẩu không đúng.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="login-container">
        <h2 className="text-center mb-4">Đăng nhập</h2>
        <Form>
          <Form.Group controlId="username">
            <Form.Label>Tên đăng nhập</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" className="w-100" onClick={handleLogin}>
            Đăng nhập
          </Button>

          {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
        </Form>
      </div>
    </Container>
  );
};

export default Login;
