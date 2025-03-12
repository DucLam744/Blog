import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Container, Button } from "react-bootstrap";

const PostDetails = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [errMessage, setErrMessage] = useState('');

    useEffect(()=> {
        const fetchPost = async () => {
            try {
                const response = await fetch('http://localhost:4000/posts');

                if (!response.ok) {
                    throw new Error('Không thể kết nối API');
                }

                const data = await response.json();
                const postData = data.find((post) => post.id == parseInt(postId));

                if (!postData) {
                    setErrMessage('Không tồn tại bài viết')
                } else {
                    setPost(postData);
                }
            } catch (error) {
                console.error('Lỗi khi kết nối với API: ', error);
                setErrMessage('Đã có lỗi xảy ra, vui lòng thử lại!');
            }
        }
        fetchPost();
    }, [postId]);

    if (errMessage) {
        return <Alert variant="danger">{errMessage}</Alert>; 
    }

    if (!post) {
        return <div>Đang tải...</div>; 
    }

    return (
        <Container className="mt-5">
          <h2>{post.title}</h2>
          <p><strong>Tác giả:</strong> {post.author}</p>
          <p><strong>Ngày đăng:</strong> {post.date}</p>
          <p>{post.content}</p>
          <Button variant="secondary" onClick={() => window.history.back()}>Quay lại</Button>
        </Container>
      );
}

export default PostDetails;