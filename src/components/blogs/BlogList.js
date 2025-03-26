"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { environment } from "../../shared/constants/StorageKey.js"
import { useNavigate } from "react-router-dom"

function BlogList() {
  const [allBlogs, setAllBlogs] = useState([])
  const [displayedBlogs, setDisplayedBlogs] = useState([])
  const [tags, setTags] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [authors, setAuthors] = useState({})
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [activeTag, setActiveTag] = useState(null)
  const [activeTab, setActiveTab] = useState("global")
  const [filteredBlogs, setFilteredBlogs] = useState([])
  const itemsPerPage = 5
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const userDataString = localStorage.getItem("user_current")
      if (userDataString) {
        const userData = JSON.parse(userDataString)
        setCurrentUser(userData)
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error)
    }
  }, [])

  useEffect(() => {
    fetchAllBlogs()
    axios.get(`${environment.apiUrl}/users`).then((response) => {
      setUsers(response.data)
    })
  }, [])

  useEffect(() => {
    if (allBlogs.length > 0) {
      let filtered = allBlogs
      if (activeTag) {
        filtered = allBlogs.filter(
          (blog) => blog.tags && blog.tags.includes(activeTag)
        )
      }
      setFilteredBlogs(filtered)
      const newTotalPages = Math.ceil(filtered.length / itemsPerPage)
      setTotalPages(newTotalPages)
      setCurrentPage(1)
      const startIndex = 0
      const endIndex = itemsPerPage
      setDisplayedBlogs(filtered.slice(startIndex, endIndex))
    }
  }, [allBlogs, activeTag, itemsPerPage])

  useEffect(() => {
    if (filteredBlogs.length > 0) {
      updateDisplayedBlogsFromFiltered(filteredBlogs, currentPage)
    }
  }, [currentPage, filteredBlogs])

  function toDetail(id) {
    navigate(`/blogs/${id}`)
  }

  const fetchAllBlogs = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${environment.apiUrl}/blogs`)
      const blogs = response.data
      setAllBlogs(blogs)
      const filtered = activeTag
        ? blogs.filter((blog) => blog.tags && blog.tags.includes(activeTag))
        : blogs
      setFilteredBlogs(filtered)
      setTotalPages(Math.ceil(filtered.length / itemsPerPage))
      updateDisplayedBlogsFromFiltered(filtered, currentPage)
      const tagsRes = [...new Set(blogs.flatMap((blog) => blog.tags || []))]
      setTags(tagsRes)
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  function getAuthorNameByAuthorId(authorId) {
    const author = users.find((user) => user.id == authorId)
    return author ? author.username : "Unknown Author"
  }

  const updateDisplayedBlogsFromFiltered = (filtered, page) => {
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setDisplayedBlogs(filtered.slice(startIndex, endIndex))
  }

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
      const startIndex = (newPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      setDisplayedBlogs(filteredBlogs.slice(startIndex, endIndex))
      window.scrollTo(0, 0)
    }
  }

  const handleLike = async (blog) => {
    if (!currentUser) {
      alert("Please login to like posts")
      return
    }
    try {
      const userLiked = blog.likes.includes(Number.parseInt(currentUser.id))
      let updatedLikes

      if (userLiked) {
        updatedLikes = blog.likes.filter(
          (id) => id !== Number.parseInt(currentUser.id)
        )
      } else {
        updatedLikes = [...blog.likes, Number.parseInt(currentUser.id)]
      }
      await axios.patch(`${environment.apiUrl}/blogs/${blog.id}`, {
        likes: updatedLikes,
      })
      const updatedBlogs = allBlogs.map((item) =>
        item.id === blog.id ? { ...item, likes: updatedLikes } : item
      )
      setAllBlogs(updatedBlogs)
    } catch (error) {
      console.error("Error updating like:", error)
    }
  }

  const handleTagClick = (tag) => {
    setActiveTag(tag)
    setActiveTab("tag")
    setCurrentPage(1)
  }

  const handleGlobalFeedClick = (e) => {
    e.preventDefault()
    setActiveTag(null)
    setActiveTab("global")
    setCurrentPage(1)
  }

  const renderPaginationNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)
      if (currentPage <= 3) {
        endPage = Math.min(maxVisiblePages - 1, totalPages - 1)
      }
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - maxVisiblePages + 2)
      }
      if (startPage > 2) {
        pages.push("...")
      }
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      if (endPage < totalPages - 1) {
        pages.push("...")
      }
      pages.push(totalPages)
    }

    return pages
  }

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
                    <a
                      className={`nav-link ${
                        activeTab === "global" ? "active" : ""
                      }`}
                      href=""
                      onClick={handleGlobalFeedClick}>
                      Global Feed
                    </a>
                  </li>
                  {activeTag && (
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          activeTab === "tag" ? "active" : ""
                        }`}
                        href=""
                        onClick={(e) => e.preventDefault()}>
                        <i className="ion-pound"></i> {activeTag}
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              {loading ? (
                <div className="article-preview">Loading...</div>
              ) : displayedBlogs.length === 0 ? (
                <div className="article-preview">
                  No articles are here... yet.
                </div>
              ) : (
                displayedBlogs.map((item, index) => {
                  const hasLiked =
                    currentUser &&
                    item.likes &&
                    item.likes.includes(Number.parseInt(currentUser.id))

                  return (
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
                        <button
                          className={`btn ${
                            hasLiked ? "btn-primary" : "btn-outline-primary"
                          } btn-sm pull-xs-right`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleLike(item)
                          }}>
                          <i className="ion-heart"></i>{" "}
                          {item.likes ? item.likes.length : 0}
                        </button>
                      </div>
                      <a
                        onClick={() => toDetail(item.id)}
                        className="preview-link"
                        style={{ cursor: "pointer" }}>
                        <h1>{item.title}</h1>
                        <p>{item.content}</p>
                        <span>Read more...</span>
                        <ul className="tag-list">
                          {item.tags &&
                            item.tags.map((tag, tagIndex) => (
                              <li
                                className="tag-default tag-pill tag-outline"
                                key={tagIndex}>
                                {tag}
                              </li>
                            ))}
                        </ul>
                      </a>
                    </div>
                  )
                })
              )}

              {totalPages > 1 && (
                <nav>
                  <ul className="pagination">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}>
                        &laquo;
                      </button>
                    </li>

                    {renderPaginationNumbers().map((page, index) => (
                      <li
                        key={index}
                        className={`page-item ${
                          page === "..."
                            ? ""
                            : currentPage === page
                            ? "active"
                            : ""
                        }`}>
                        {page === "..." ? (
                          <span className="page-link">...</span>
                        ) : (
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(page)}>
                            {page}
                          </button>
                        )}
                      </li>
                    ))}

                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}>
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
                    <a
                      href=""
                      className="tag-pill tag-default"
                      key={index}
                      onClick={(e) => {
                        e.preventDefault()
                        handleTagClick(item)
                      }}>
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
  )
}

export default BlogList
