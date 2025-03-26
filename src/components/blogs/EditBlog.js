import { useEffect, useState } from "react"
import axios from "axios"
import { environment, USER_CURRENT } from "../../shared/constants/StorageKey.js"
import { useParams } from "react-router-dom"
import Editor from "../editor/Editor.js"

export default function EditBlog() {
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    tags: "",
  })
  const blogId = useParams().id
  const [error, setError] = useState([])
  const [success, setSuccess] = useState("")

  const handleCreateBlog = async () => {
    let tempErr = []
    let canCreate = true
    if (!blog.title) {
      tempErr = [...tempErr, "Title is required"]
      canCreate = false
    }
    if (!blog.content) {
      tempErr = [...tempErr, "Title is required"]
      canCreate = false
    }
    if (!blog.tags) {
      tempErr = [...tempErr, "Tag is required"]
      canCreate = false
    }
    if (tempErr.length !== 0) {
      setError(tempErr)
    }
    if (canCreate) {
      await axios
        .patch(`${environment.apiUrl}/blogs/${blogId}`, {
          title: blog.title,
          content: blog.content,
          tags: blog.tags.split(",").map((tag) => tag.trim()),
        })
        .then(() => {
          setBlog({ title: "", content: "", tags: "" })
          setSuccess("Edit blog successfully!")
          setError([])
        })
        .catch((err) => setError(...error, err))
    }
  }

  const getBlog = async () => {
    const response = await axios.get(`${environment.apiUrl}/blogs/${blogId}`)
    response.data.tags = response.data.tags.join(", ")
    setBlog(response.data)
    console.log(response.data)
  }

  useEffect(() => {
    getBlog()
  }, [])

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ul className="error-messages">
              {error.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            {success && <h1 style={{ color: "green" }}>{success}</h1>}

            <form>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    value={blog.title}
                    onChange={(e) =>
                      setBlog({ ...blog, title: e.target.value })
                    }
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                  />
                </fieldset>
                <Editor
                  content={blog.content}
                  handleChange={(e) => setBlog({ ...blog, content: e })}
                />
                <fieldset className="form-group">
                  <input
                    type="text"
                    value={blog.tags}
                    onChange={(e) => setBlog({ ...blog, tags: e.target.value })}
                    className="form-control"
                    placeholder="Enter tags"
                  />
                </fieldset>
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="button"
                  onClick={handleCreateBlog}>
                  Save Edit
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
