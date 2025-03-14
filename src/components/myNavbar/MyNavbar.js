import { Link } from "react-router-dom"
import "./myNavbar.scss"
import { useAuth } from "../../context/AuthContext"
import { Navbar, Container, Nav } from "react-bootstrap"

function MyNavbar() {
  const { state, dispatch } = useAuth()
  return (
    <Navbar expand="lg" className="header">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav header" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/" className="nav-link">
              Home
            </Link>
            {state.isAuthenticated ? (
              <>
                <Link to="/my-blog" className="nav-link">
                  My Blog
                </Link>
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
                <Link to="/logout" className="nav-link">
                  Logout
                </Link>
              </>
            ) : (
              <Link to="/login" className="nav-link">
                Login
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default MyNavbar
