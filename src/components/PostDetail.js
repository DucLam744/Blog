// src/components/PostDetail.js

import React from 'react';
import { useParams } from 'react-router-dom';  // Hook để lấy tham số từ URL
import { Container, Button } from 'react-bootstrap';
import userData from '../data/data.json';

const PostDetail = () => {
  // Lấy id bài viết từ URL
  const { postId } = useParams();
  
  // Tìm bài viết tương ứng với id
  const post = userData.posts.find((post) => post.id === parseInt(postId));

  if (!post) {
    return <div>Bài viết không tồn tại!</div>;
  }

  return (
    <Container className="mt-5">
      <h2>{post.title}</h2>
      <p><strong>Tác giả:</strong> {post.author}</p>
      <p><strong>Ngày đăng:</strong> {post.date}</p>
      <p>{post.content}</p>
      <Button variant="secondary" onClick={() => window.history.back()}>Quay lại</Button> {/* Quay lại trang danh sách bài viết */}
    </Container>
  );
};

export default PostDetail;
