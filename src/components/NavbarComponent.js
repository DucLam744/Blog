import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavbarComponent = ({ onLogout }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/posts">Online Blog</Navbar.Brand>
        <Nav className="ml-auto">
          {/* Nút "Tạo bài viết mới" */}
          <Nav.Link as={Link} to="/posts/createPost">Tạo bài viết mới</Nav.Link>

          {/* Nút "Đăng xuất" */}
          <Button variant="outline-light" onClick={onLogout}>Đăng xuất</Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
