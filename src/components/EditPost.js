import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const EditPost = () => {
    const { postId } = useParams();  // Lấy postId từ URL
    const [post, setPost] = useState({ title: '', content: '', author: '', date: '', tags: '' });
    const [errMessage, setErrMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // Lấy dữ liệu bài viết cũ khi trang được tải
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:4000/posts/${postId}`);
                if (!response.ok) {
                    throw new Error('Bài viết không tồn tại');
                }
                const data = await response.json();
                setPost(data);  // Cập nhật dữ liệu bài viết
            } catch (error) {
                console.error('Lỗi khi tải bài viết: ', error);
                setErrMessage('Bài viết không tồn tại hoặc có lỗi khi tải dữ liệu');
            }
        };
        fetchPost();
    }, [postId]);

    // Hàm xử lý cập nhật bài viết
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra thông tin đã đầy đủ chưa
        if (!post.title || !post.content || !post.author || !post.date || !post.tags) {
            setErrMessage('Tất cả các trường đều là bắt buộc.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(post),
            });

            if (!response.ok) {
                throw new Error('Không thể cập nhật bài viết');
            }

            const data = await response.json();
            setSuccessMessage('Bài viết đã được cập nhật thành công!');
            setErrMessage('');
            
            // Điều hướng về trang danh sách bài viết sau khi cập nhật
            setTimeout(() => {
                navigate('/posts');
            }, 2000);
        } catch (error) {
            setErrMessage('Đã có lỗi xảy ra khi cập nhật bài viết.');
            console.error('Lỗi khi cập nhật bài viết: ', error);
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Cập nhật bài viết</h2>

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
                        value={post.title}
                        onChange={(e) => setPost({ ...post, title: e.target.value })}
                    />
                </Form.Group>

                <Form.Group controlId="postContent" className="mt-3">
                    <Form.Label>Nội dung bài viết</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        placeholder="Nhập nội dung bài viết"
                        value={post.content}
                        onChange={(e) => setPost({ ...post, content: e.target.value })}
                    />
                </Form.Group>

                <Form.Group controlId="postAuthor" className="mt-3">
                    <Form.Label>Tác giả</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập tên tác giả"
                        value={post.author}
                        onChange={(e) => setPost({ ...post, author: e.target.value })}
                    />
                </Form.Group>

                <Form.Group controlId="postDate" className="mt-3">
                    <Form.Label>Ngày đăng</Form.Label>
                    <Form.Control
                        type="date"
                        value={post.date}
                        onChange={(e) => setPost({ ...post, date: e.target.value })}
                    />
                </Form.Group>

                <Form.Group controlId="postTags" className="mt-3">
                    <Form.Label>Tags</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập tags (cách nhau bằng dấu phẩy)"
                        value={post.tags}
                        onChange={(e) => setPost({ ...post, tags: e.target.value })}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Cập nhật bài viết
                </Button>
                <Button variant="secondary" onClick={() => window.history.back()} className="mt-3 ms-4">Quay lại</Button>
            </Form>
        </Container>
    );
};

export default EditPost;
