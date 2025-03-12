import React, { use, useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = ({onLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:4000/users');

            const data = await response.json();

            const user = data.find(user => username === user.username && password === user.password);

            if (user) {
                onLogin();
                setErrMessage('');
                navigate('/posts');
            } else {
                setErrMessage('Tên đăng nhập hoặc mật khẩu không đúng');
            }
        } catch (error) {
            console.error('Lỗi khi kết nối với API: ', error);
            setErrMessage('Đã có lỗi xảy ra vui lòng thử lại');
        }
    }

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

                    {errMessage && <Alert variant="danger" className="mt-3">{errMessage}</Alert>}
                    {onLogin() && <Alert variant="success" className="mt-3">Đăng nhập thành công</Alert>}
                </Form>
            </div>
        </Container>
    );
};

export default Login;