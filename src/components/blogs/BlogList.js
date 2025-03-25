"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { environment } from "../../shared/constants/StorageKey.js";
import { useNavigate } from "react-router-dom";

function BlogList() {
  const [allBlogs, setAllBlogs] = useState([]);
  const [displayedBlogs, setDisplayedBlogs] = useState([]); 
  const [tags, setTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState({});  
  const [users, setUsers] = useState([]);
  const itemsPerPage = 5;
  const navigate = useNavigate(); 




  useEffect(() => {
    fetchAllBlogs();
    axios.get(`${environment.apiUrl}/users`).then(response => {
      setUsers(response.data);
    });
  }, []);

  useEffect(() => {
    updateDisplayedBlogs();
  }, [currentPage, allBlogs]);


  function toDetail(id){
    navigate(`/blogs/${id}`)
  }

  const fetchAllBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${environment.apiUrl}/blogs`);
      const blogs = response.data;
      setAllBlogs(blogs);
      setTotalPages(Math.ceil(blogs.length / itemsPerPage));
      const tagsRes = [...new Set(blogs.flatMap((blog) => blog.tags))];
      setTags(tagsRes);
      
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  function getAuthorNameByAuthorId(authorId) {
    const author = users.find(user => user.id == authorId);
    return author ? author.username : "Unknown Author"; // Trả về tên tác giả hoặc "Unknown Author" nếu không tìm thấy
  }

  const updateDisplayedBlogs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedBlogs(allBlogs.slice(startIndex, endIndex));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 3) {
        endPage = Math.min(maxVisiblePages - 1, totalPages - 1);
      }
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - maxVisiblePages + 2);
      }
      if (startPage > 2) {
        pages.push("...");
      }
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div>
      <div className="home-page">
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>

        <div className="container page">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <a className="nav-link active" href="">
                      Global Feed
                    </a>
                  </li>
                </ul>
              </div>

              {loading ? (
                <div className="article-preview">Loading...</div>
              ) : displayedBlogs.length === 0 ? (
                <div className="article-preview">
                  No articles are here... yet.
                </div>
              ) : (
                displayedBlogs.map((item, index) => (
                  <div className="article-preview" key={index}>
                    <div className="article-meta">
                      <a href="/profile/eric-simons">
                        <img
                          src="http://i.imgur.com/Qr71crq.jpg"
                          alt="Author"
                        />
                      </a>
                      <div className="info">
                        <a href="/profile/eric-simons" className="author">
                        {getAuthorNameByAuthorId(item.authorId)}
                        </a>
                        <span className="date">
                          {item.createDate || "January 20th"}
                        </span>
                      </div>
                      <button className="btn btn-outline-primary btn-sm pull-xs-right">
                        <i className="ion-heart"></i>{" "}
                        {item.likes ? item.likes.length : 0}
                      </button>
                    </div>
                    <a onClick={() =>toDetail(item.id)} className="preview-link">
                      <h1>{item.title}</h1>
                      <p>{item.content}</p>
                      <span>Read more...</span>
                      <ul className="tag-list">
                        {item.tags &&
                          item.tags.map((tag, tagIndex) => (
                            <li
                              className="tag-default tag-pill tag-outline"
                              key={tagIndex}
                            >
                              {tag}
                            </li>
                          ))}
                      </ul>
                    </a>
                  </div>
                ))
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <nav>
                  <ul className="pagination">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        &laquo;
                      </button>
                    </li>

                    {/* Page Numbers with Ellipsis */}
                    {renderPaginationNumbers().map((page, index) => (
                      <li
                        key={index}
                        className={`page-item ${
                          page === "..."
                            ? ""
                            : currentPage === page
                            ? "active"
                            : ""
                        }`}
                      >
                        {page === "..." ? (
                          <span className="page-link">...</span>
                        ) : (
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        )}
                      </li>
                    ))}

                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        &raquo;
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>

                <div className="tag-list">
                  {tags.map((item, index) => (
                    <a href="" className="tag-pill tag-default" key={index}>
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogList;
