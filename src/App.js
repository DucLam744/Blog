// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Cập nhật import Routes
import Login from './components/Login';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';  // Import trang chi tiết bài viết

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route cho trang đăng nhập */}
        <Route path="/" element={<Login />} />
        
        {/* Route cho trang danh sách bài viết */}
        <Route path="/posts" element={<PostList />} />
        
        {/* Route cho trang chi tiết bài viết */}
        <Route path="/posts/:postId" element={<PostDetail />} /> {/* Thêm route cho trang chi tiết bài viết */}
      </Routes>
    </Router>
  );
};

export default App;
