"use client"
import { Link, useNavigate } from "react-router-dom"
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"
import { USER_CURRENT } from "../../../shared/constants/StorageKey"

const Header = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem(USER_CURRENT)) || {}

  const handleLogout = () => {
    localStorage.removeItem(USER_CURRENT)
    navigate("/login")
  }

  // Only admin users should access the admin panel
  if (!user || user.role !== "admin") {
    navigate("/login")
    return null
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/admin/dashboard">
          Admin Dashboard
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin/dashboard">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/blogs">
              Manage Blogs
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/users">
              Manage Users
            </Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title={user.username || "Admin"} id="admin-nav-dropdown">
              <NavDropdown.Item as={Link} to="/">
                View Site
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header

