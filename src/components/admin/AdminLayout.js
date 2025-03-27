import { Outlet } from "react-router-dom"
import { Container, Row, Col } from "react-bootstrap"
import Header from "./layout/Header"
import Footer from "./layout/Footer"
import Menu from "./layout/Menu"

const AdminLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container fluid className="flex-grow-1">
        <Row>
          <Col md={2} className="bg-light p-0 d-none d-md-block">
            <Menu />
          </Col>
          <Col md={10} className="py-3">
            <Outlet />
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  )
}

export default AdminLayout

