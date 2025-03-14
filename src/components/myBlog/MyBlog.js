import { useEffect, useState, lazy, Suspense } from "react"
import api from "../../api/api"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import "./myBlog.scss"
import { Button } from "react-bootstrap"
import MyInput from "../custom/myInput/MyInput"
import { useError } from "../../context/ErrorContext"
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Swal from "sweetalert2"
const MyEditor = lazy(() => import("../../editor/Editor"))

function MyBlog() {
  const [blogs, setBlogs] = useState([])
  const [page, setPage] = useState({ currentPage: 0, totalPages: 0 })
  const [search, setSearch] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [showUpdate, setShowUpdate] = useState(false)
  const [blog, setBlog] = useState({
    id: null,
    title: "",
    tags: "",
    content: "",
  })
  const { state } = useAuth()
  const { showError, showMessage } = useError()
  const navigate = useNavigate()
  useEffect(() => {
    if (state.isAuthenticated === false) {
      navigate("/login")
    }
  }, [state])

  const getListBlog = async () => {
    if (page.currentPage !== 0) {
      await api
        .get("/api/blogs/instructor", {
          params: { page: page.currentPage, search: search },
        })
        .then((res) => res.data)
        .then((data) => {
          setPage({ currentPage: data.page, totalPages: data.totalPages })
          setBlogs(data.data)
        })
    } else {
      await api
        .get("/api/blogs/instructor")
        .then((res) => res.data)
        .then((data) => {
          setPage({ currentPage: data.page, totalPages: data.totalPages })
          setBlogs(data.data)
        })
    }
  }

  useEffect(() => {
    try {
      const delaySearch = setTimeout(() => {
        getListBlog()
      }, 200)
      return () => clearTimeout(delaySearch)
    } catch (error) {
      showError(error.response.data.error)
    }
  }, [page.currentPage, search])

  const handlePage = (i) => {
    setPage({ currentPage: i + 1, totalPages: page.totalPages })
    window.scrollTo({ top: 0, behavior: "auto" })
  }

  const handleOpenBlog = async (slug, id) => {
    await api.post(`/api/view-blog/${id}`)
    navigate(`/blog-post/${slug}`)
  }

  const handleSaveBlog = async () => {
    try {
      const response = await api.post("/api/blogs", {
        title: blog.title,
        tagName: blog.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        content: blog.content,
      })
      showMessage("Create blog successfully!")
      setShowCreate(!showCreate)
      setBlog({ title: "", tags: "", content: "" })
      getListBlog()
    } catch (err) {
      const errorMsg =
        err?.response?.data?.error?.join("\n") || "Lỗi khi tạo blog"
      showError(errorMsg)
    }
  }

  const handleUpdateBlog = async () => {
    try {
      const response = await api.put(`/api/blogs/${blog.id}`, {
        title: blog.title,
        tagName: blog.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        content: blog.content,
      })
      showMessage("Update blog successfully!")
      setShowUpdate(!showUpdate)
      setBlog({ id: null, title: "", tags: "", content: "" })
      getListBlog()
    } catch (err) {
      setShowUpdate(!showUpdate)
      const errorMsg =
        err?.response?.data?.error?.join("\n") || "Lỗi khi cập nhật blog"
      showError(errorMsg)
    }
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: "Do you want to delete this blog?",
      showConfirmButton: true,
      showCancelButton: true,
      icon: "warning",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "danger",
      cancelButtonColor: "grey",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await api
          .delete(`/api/blogs/${id}`)
          .then((mes) => showMessage(mes.data))
        getListBlog()
      }
    })
  }

  const handleOpenUpdateBlog = (blog) => {
    setShowUpdate(!showUpdate)
    setBlog({
      id: blog.id,
      title: blog.title,
      tags: blog.tagResponses.map((tag) => tag.name),
      content: blog.content,
    })
  }

  const handleCloseUpdate = () => {
    setShowUpdate(!showUpdate)
    setBlog({ id: null, title: "", tags: "", content: "" })
  }

  return (
    <div className="d-flex-column body ms-5 mx-5 mt-5 mb-5">
      <div className="d-flex justify-content-between">
        <div>
          <MyInput
            name="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <Button onClick={() => setShowCreate(!showCreate)}>
            + Create blog
          </Button>
        </div>
        <Suspense fallback={<div>Loading Editor...</div>}>
          <MyEditor
            name={"Create your blog"}
            title={blog.title}
            setTitle={(e) => setBlog({ ...blog, title: e.target.value })}
            tags={blog.tags}
            setTags={(e) =>
              setBlog({
                ...blog,
                tags: e.target.value,
              })
            }
            content={blog.content}
            setContent={(e) => setBlog({ ...blog, content: e })}
            show={showCreate}
            handleClose={() => setShowCreate(!showCreate)}
            handleSave={handleSaveBlog}
          />
        </Suspense>
      </div>
      <table className="w-100 mx-0 mt-5">
        <thead>
          <tr className="row thead">
            <th className="col-1">Id</th>
            <th className="col-8">Title</th>
            <th className="col-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((bl) => (
            <tr className="row" key={bl.id}>
              <td className="col-1">{bl.id}</td>
              <td
                className="col-8"
                onClick={() => handleOpenBlog(bl.slug, bl.id)}>
                {bl.title}
              </td>
              <td className="col-3">
                <Button
                  className="action"
                  variant="success"
                  onClick={() => {
                    handleOpenUpdateBlog(bl)
                  }}>
                  <span>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      style={{ color: "#ffffff" }}
                    />
                  </span>
                  Update
                </Button>
                <Button
                  className="action"
                  variant="danger"
                  onClick={() => handleDelete(bl.id)}>
                  <span>
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ color: "#ffffff" }}
                    />
                  </span>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          <Suspense fallback={<div>Loading Editor...</div>}>
            <MyEditor
              name={"Update blog"}
              title={blog.title}
              setTitle={(e) => setBlog({ ...blog, title: e.target.value })}
              tags={blog.tags}
              setTags={(e) =>
                setBlog({
                  ...blog,
                  tags: e.target.value,
                })
              }
              content={blog.content}
              setContent={(e) => setBlog({ ...blog, content: e })}
              show={showUpdate}
              handleClose={handleCloseUpdate}
              handleSave={() => {
                handleUpdateBlog()
              }}
            />
          </Suspense>
        </tbody>
      </table>
      <div>
        <nav aria-label="Page navigation example">
          <ul className="pagination d-flex justify-content-center">
            {Array.from({ length: page.totalPages }, (_, index) => (
              <li className="page-item" onClick={() => handlePage(index)}>
                <a className="page-link">{index + 1}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default MyBlog
