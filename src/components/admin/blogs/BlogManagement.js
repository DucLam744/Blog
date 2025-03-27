"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Button, Form, Badge, Alert } from "react-bootstrap";
import "./modal.css"; // We'll create this file for custom modal styling

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [alert, setAlert] = useState({ show: false, variant: "", message: "" });
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    authorId: "",
  });

  useEffect(() => {
    fetchBlogs();
    fetchUsers();
  }, []);

  // Add event listener to close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if any modal is open
      if (!showDeleteModal && !showEditModal && !showCreateModal) {
        return; // No modals open, no need to check
      }

      // Get the clicked element
      const target = event.target;

      // Check if the click is on a modal trigger button
      if (
        target.classList.contains("btn-edit") ||
        target.classList.contains("btn-delete") ||
        target.classList.contains("btn-create")
      ) {
        return; // Don't close modal if clicking on trigger buttons
      }

      // Get all modal content elements
      const modalContents = document.querySelectorAll(".custom-modal-content");

      // Check if click is inside any modal content
      let isInsideModal = false;
      for (let i = 0; i < modalContents.length; i++) {
        if (modalContents[i].contains(target)) {
          isInsideModal = true;
          break;
        }
      }

      // If click is outside modal content, close all modals
      if (!isInsideModal) {
        setShowDeleteModal(false);
        setShowEditModal(false);
        setShowCreateModal(false);
      }
    };

    // Only add the event listener if any modal is open
    if (showDeleteModal || showEditModal || showCreateModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDeleteModal, showEditModal, showCreateModal]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:9999/blogs");
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      showAlert("danger", "Failed to fetch blogs");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:9999/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:9999/blogs/${currentBlog.id}`);
      setShowDeleteModal(false);
      fetchBlogs();
      showAlert("success", "Blog deleted successfully");
    } catch (error) {
      console.error("Error deleting blog:", error);
      showAlert("danger", "Failed to delete blog");
    }
  };

  const handleEdit = (blog) => {
    setCurrentBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      tags: blog.tags ? blog.tags.join(", ") : "",
      authorId: blog.authorId,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Process tags to ensure uniqueness
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""); // Remove empty tags

      // Remove duplicates from tags array
      const uniqueTags = [...new Set(tagsArray)];

      const updatedBlog = {
        ...currentBlog,
        title: formData.title,
        content: formData.content,
        tags: uniqueTags,
        authorId: formData.authorId,
      };

      await axios.put(
        `http://localhost:9999/blogs/${currentBlog.id}`,
        updatedBlog
      );
      setShowEditModal(false);
      fetchBlogs();
      showAlert("success", "Blog updated successfully");
    } catch (error) {
      console.error("Error updating blog:", error);
      showAlert("danger", "Failed to update blog");
    }
  };

  const handleCreate = () => {
    // Reset form data for new blog
    setFormData({
      title: "",
      content: "",
      tags: "",
      authorId: "",
    });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      // Process tags to ensure uniqueness
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""); // Remove empty tags

      // Remove duplicates from tags array
      const uniqueTags = [...new Set(tagsArray)];

      // Get current user from localStorage
      const currentUser = JSON.parse(
        localStorage.getItem("USER_CURRENT") || "{}"
      );

      const newBlog = {
        title: formData.title,
        content: formData.content,
        tags: uniqueTags,
        authorId: formData.authorId || currentUser.id,
        createDate: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
        likes: [],
        dislikes: [],
        comments: [],
      };

      await axios.post("http://localhost:9999/blogs", newBlog);
      setShowCreateModal(false);
      fetchBlogs();
      showAlert("success", "Blog created successfully");
    } catch (error) {
      console.error("Error creating blog:", error);
      showAlert("danger", "Failed to create blog");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getUsernameById = (id) => {
    const user = users.find((user) => user.id === id);
    return user ? user.username : "Unknown";
  };

  const showAlert = (variant, message) => {
    setAlert({ show: true, variant, message });
    setTimeout(() => {
      setAlert({ show: false, variant: "", message: "" });
    }, 3000);
  };

  // Replace the CustomModal component with this improved version
  // Custom Modal Component
  const CustomModal = ({ show, title, children, onClose }) => {
    if (!show) return null;

    // Prevent click propagation inside the modal
    const handleModalClick = (e) => {
      e.stopPropagation();
    };

    return (
      <div className="custom-modal" onClick={onClose}>
        <div className="custom-modal-content" onClick={handleModalClick}>
          <div className="custom-modal-header">
            <h5 className="custom-modal-title">{title}</h5>
            <button
              type="button"
              className="custom-close-button"
              onClick={onClose}
            >
              &times;
            </button>
          </div>
          <div className="custom-modal-body">{children}</div>
        </div>
      </div>
    );
  };

  return (
    <Container fluid className="py-4">
      {alert.show && (
        <Alert
          variant={alert.variant}
          onClose={() => setAlert({ ...alert, show: false })}
          dismissible
        >
          {alert.message}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Blog Management</h1>
        <Button variant="success" className="btn-create" onClick={handleCreate}>
          Create New Blog
        </Button>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Likes</th>
              <th>Comments</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog.id}>
                <td>{blog.id}</td>
                <td>{blog.title}</td>
                <td>{getUsernameById(blog.authorId)}</td>
                <td>{blog.createDate}</td>
                <td>{blog.likes ? blog.likes.length : 0}</td>
                <td>{blog.comments ? blog.comments.length : 0}</td>
                <td>
                  {blog.tags &&
                    blog.tags.map((tag, index) => (
                      <Badge
                        bg="secondary"
                        className="me-1"
                        key={`${tag}-${index}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                </td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2 btn-edit"
                    onClick={() => handleEdit(blog)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="btn-delete"
                    onClick={() => {
                      setCurrentBlog(blog);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      <CustomModal
        show={showDeleteModal}
        title="Confirm Delete"
        onClose={() => setShowDeleteModal(false)}
      >
        <p>Are you sure you want to delete the blog "{currentBlog?.title}"?</p>
        <div className="custom-modal-footer">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </CustomModal>

      {/* Edit Blog Modal */}
      <CustomModal
        show={showEditModal}
        title="Edit Blog"
        onClose={() => setShowEditModal(false)}
      >
        <Form onSubmit={handleUpdate}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tags (comma separated)</Form.Label>
            <Form.Control
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Select
              name="authorId"
              value={formData.authorId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Author</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <div className="custom-modal-footer">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Blog
            </Button>
          </div>
        </Form>
      </CustomModal>

      {/* Create Blog Modal */}
      <CustomModal
        show={showCreateModal}
        title="Create New Blog"
        onClose={() => setShowCreateModal(false)}
      >
        <Form onSubmit={handleCreateSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tags (comma separated)</Form.Label>
            <Form.Control
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Author</Form.Label>
            <Form.Select
              name="authorId"
              value={formData.authorId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Author</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <div className="custom-modal-footer">
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button variant="success" type="submit">
              Create Blog
            </Button>
          </div>
        </Form>
      </CustomModal>
    </Container>
  );
};

export default BlogManagement;
