import { Link } from "react-router-dom"
import { ListGroup } from "react-bootstrap"

const Menu = () => {
  return (
    <div className="admin-sidebar bg-light p-3 h-100">
      <h5 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
        <span>Admin Menu</span>
      </h5>
      <ListGroup variant="flush">
        <ListGroup.Item as={Link} to="/admin/dashboard" className="border-0 bg-light">
          Dashboard
        </ListGroup.Item>
        <ListGroup.Item as={Link} to="/admin/blogs" className="border-0 bg-light">
          Blog Management
        </ListGroup.Item>
        <ListGroup.Item as={Link} to="/admin/users" className="border-0 bg-light">
          User Management
        </ListGroup.Item>
      </ListGroup>
    </div>
  )
}

export default Menu

