import {useState} from "react"
import BlogEditor from "../editor/Editor"

export default function CreateBlog() {
    const [blog, setBlog] = useState({
        title: "",
        content: "",
        createDate: null,
        tags: ""
    })
    return (
        <div class="editor-page">
  <div class="container page">
    <div class="row">
      <div class="col-md-10 offset-md-1 col-xs-12">
        <ul class="error-messages">
          <li>That title is required</li>
        </ul>

        <form>
          <fieldset>
            <fieldset class="form-group">
              <input type="text" value={blog.title} onChange={e => setBlog({...blog, title: e.target.value})} class="form-control form-control-lg" placeholder="Article Title" />
            </fieldset>
            <BlogEditor  value={blog.content} onChange={e => setBlog({...blog, content: e.target.value})} />
            <fieldset class="form-group">
              <input type="text" class="form-control" placeholder="Enter tags" />
              <div class="tag-list">
                <span class="tag-default tag-pill"> <i class="ion-close-round"></i> tag </span>
              </div>
            </fieldset>
            <button class="btn btn-lg pull-xs-right btn-primary" type="button">
              Publish Article
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</div>
    )
}