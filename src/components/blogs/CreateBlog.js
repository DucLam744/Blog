import { useState } from "react"
import BlogEditor from "../editor/Editor"
import axios from "axios"
import { environment, USER_CURRENT } from "../../shared/constants/StorageKey.js"

export default function CreateBlog() {
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    tags: "",
  })
  const [error, setError] = useState([])
  const [success, setSuccess] = useState("")

  const handleCreateBlog = () => {
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
      axios
        .post(`${environment.apiUrl}/blogs`, {
          ...blog,
          createDate: new Date(),
          tags: blog.tags.split(", ").map((tag) => tag.trim()),
        })
        .then(() => {
          setBlog({ title: "", content: "", tags: "" })
          setSuccess("Create blog successfully!")
        })
        .catch((err) => setError(...error, err))
    }
  }

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
            {success && <h1>success</h1>}

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
                <fieldset class="form-group">
                  <textarea
                    value={blog.content}
                    onChange={(e) =>
                      setBlog({ ...blog, content: e.target.value })
                    }
                    class="form-control"
                    rows="8"
                    placeholder="Write your article (in markdown)"></textarea>
                </fieldset>
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
                  Create Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
