// src/components/PostList.js

import React from 'react';
import { Link } from 'react-router-dom';  // Dùng Link để điều hướng
import { Container, ListGroup } from 'react-bootstrap';
import userData from '../data/data.json';

const PostList = () => {
  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Danh sách bài viết</h2>
      <ListGroup>
        {userData.posts.map((post) => (
          <ListGroup.Item key={post.id}>
            <h5>
              <Link to={`/posts/${post.id}`}>{post.title}</Link> {/* Liên kết tới trang chi tiết bài viết */}
            </h5>
            <p>{post.content.slice(0, 100)}...</p> {/* Hiển thị đoạn văn bản ngắn gọn */}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default PostList;
