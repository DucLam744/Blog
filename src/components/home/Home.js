import MyBookmark from "../custom/myBookmark/MyBookmark"
import { useEffect, useState } from "react"
import api from "../../api/api"
import { AVATAR_DEFAULT } from "../../config/env"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import "./home.scss"
import MyInput from "../custom/myInput/MyInput"
import MyBlock from "../custom/myBlock/MyBlock"

function Home() {
  const [blogs, setBlogs] = useState([])
  const [page, setPage] = useState({ currentPage: 0, totalPages: 0 })
  const [search, setSearch] = useState({ input: "", tags: [] })
  const { state } = useAuth()
  const [tags, setTags] = useState([])
  const [recentBlogs, setRecentBlogs] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const getBlog = () => {
      if (page.currentPage !== 0) {
        api
          .get("/api/blogs", {
            params: { page: page.currentPage, search: search.input },
          })
          .then((res) => res.data)
          .then((data) => {
            setPage({ currentPage: data.page, totalPages: data.totalPages })
            setBlogs(data.data)
          })
        console.log(search.input)
      } else {
        api
          .get("/api/blogs")
          .then((res) => res.data)
          .then((data) => {
            setPage({ currentPage: data.page, totalPages: data.totalPages })
            setBlogs(data.data)
          })
      }
    }
    const delaySearch = setTimeout(() => {
      getBlog()
    }, 200)

    return () => clearTimeout(delaySearch)
  }, [page.currentPage, search])

  useEffect(() => {
    api.get("/api/tags/recent").then((data) => setTags(data.data))
    api.get("api/blogs/recent").then((data) => setRecentBlogs(data.data))
  }, [])

  const handleBookmark = (isBookmark, blogId) => {
    if (!state.isAuthenticated) {
      navigate("/login")
      return
    }
    if (isBookmark) {
      api.delete("/api/bookmarks", { data: { blogId } })
    } else {
      api.post("/api/bookmarks", { blogId })
    }
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog.id === blogId ? { ...blog, isBookmark: !isBookmark } : blog
      )
    )
  }

  const handlePage = (i) => {
    setPage({ currentPage: i + 1, totalPages: page.totalPages })
    window.scrollTo({ top: 0, behavior: "auto" })
  }

  const handleOpenBlog = async (slug, id) => {
    await api.post(`/api/view-blog/${id}`)
    navigate(`/blog-post/${slug}`)
  }

  return (
    <div className="d-flex body row mt-5">
      <div className="blogs col-7">
        {blogs.map((blog) => (
          <div className="blog" key={blog.id}>
            <div className="blog-detail">
              <div className="account">
                {blog.accountResponse.avatar ? (
                  <img src={blog.accountResponse.avatar} />
                ) : (
                  <img src={AVATAR_DEFAULT} />
                )}
                <h5>{blog.accountResponse.email}</h5>
              </div>
              <div className="actions">
                <MyBookmark
                  status={blog.isBookmark}
                  onClick={() => handleBookmark(blog.isBookmark, blog.id)}
                />
              </div>
            </div>
            <div
              className="blog-content mt-3"
              onClick={() => {
                handleOpenBlog(blog.slug, blog.id)
              }}>
              <h5 className="fw-normal pt-3">{blog.title}</h5>
              <p>Xem thêm...</p>
            </div>
            <div className="blog-footer mt-3 d-flex justify-content-between">
              <strong>{String(blog.createAt).substring(0, 10)}</strong>
              <ul className="d-flex mt-0 h-75">
                {blog.tagResponses.map((tag) => (
                  <li className="tag" key={tag.id}>
                    {tag.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        <div>
          <nav aria-label="Page navigation example">
            <ul class="pagination d-flex justify-content-center">
              {Array.from({ length: page.totalPages }, (_, index) => (
                <li
                  key={index}
                  class="page-item"
                  onClick={() => handlePage(index)}>
                  <a class="page-link">{index + 1}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="blogs-right ms-5 mt-2 col-4">
        <div className="border border-black p-5">
          <h5 className="search-title">Search</h5>
          <MyInput
            name={"Search..."}
            value={search.input}
            onChange={(e) => setSearch({ ...search, input: e.target.value })}
          />
        </div>
        <MyBlock name={"Tags"}>
          <ul className="tags d-flex flex-wrap">
            {tags &&
              tags.map((tag) => (
                <li className="tag" key={tag.id}>
                  {tag.name}
                </li>
              ))}
          </ul>
        </MyBlock>

        <MyBlock name={"Recent Blogs"}>
          <ul className="d-flex flex-wrap pt-3 flex-column">
            {recentBlogs &&
              recentBlogs.map((blog) => (
                <p
                  key={blog.id}
                  onClick={() => handleOpenBlog(blog.slug, blog.id)}
                  className="text-decoration-underline cursor-pointer">
                  {blog.title}
                </p>
              ))}
          </ul>
        </MyBlock>
      </div>
    </div>
  )
}

export default Home
