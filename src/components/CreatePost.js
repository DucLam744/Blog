import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [errMessage, setErrMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra các trường dữ liệu
        if (!title || !author || !content || !tags) {
            setErrMessage('Tất cả các trường đều là bắt buộc.');
            return;
        }

        // Tạo bài viết mới
        const newPost = {
            id: String(Math.floor(Math.random() * 1000)),  // Tạo ID ngẫu nhiên cho bài viết mới
            title,
            author,
            content,
            date: new Date().toISOString().split('T')[0],  // Lấy ngày hiện tại
            tags: tags.split(',').map(tag => tag.trim()),  // Chuyển tags thành mảng
        };

        try {
            const response = await fetch('http://localhost:4000/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPost),
            });

            if (!response.ok) {
                throw new Error('Không thể tạo bài viết');
            }

            const data = await response.json();
            setSuccessMessage('Bài viết đã được tạo thành công!');
            setTitle('');
            setAuthor('');
            setContent('');
            setTags('');
            setErrMessage('');  // Xóa thông báo lỗi

            // Điều hướng về trang danh sách bài viết sau 2 giây
            setTimeout(() => {
                navigate('/posts');
            }, 2000);
        } catch (error) {
            setErrMessage('Đã có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Tạo bài viết mới</h2>

            {/* Hiển thị thông báo lỗi nếu có */}
            {errMessage && <Alert variant="danger">{errMessage}</Alert>}

            {/* Hiển thị thông báo thành công nếu có */}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="postTitle">
                    <Form.Label>Tiêu đề bài viết</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập tiêu đề bài viết"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}/>
                </Form.Group>

                <Form.Group controlId="postAuthor" className="mt-3">
                    <Form.Label>Tác giả</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập tên tác giả"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="postContent" className="mt-3">
                    <Form.Label>Nội dung bài viết</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Nhập nội dung bài viết"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="postTags" className="mt-3">
                    <Form.Label>Tags (Cách nhau bằng dấu phẩy)</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập tags (ví dụ: React, JavaScript)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Tạo bài viết
                </Button>
                <Button variant="secondary" onClick={() => window.history.back()} className="mt-3 ms-4">Quay lại</Button>
            </Form>
        </Container>
    );
};

export default CreatePost;