import { useState, useEffect } from "react"
import axios from "axios"
import { environment } from "../../shared/constants/StorageKey.js"
import { Link, useParams } from "react-router-dom"
import { useAuth } from "../../shared/context/AuthContext.js"
import { useNavigate } from "react-router-dom"

export default function UserProfile() {
  const [account, setAccount] = useState(null)
  const [blogs, setBlogs] = useState([])
  const userId = useParams().id
  const { state } = useAuth()
  const navigate = useNavigate()

  const getCurrentAccount = async () => {
    const response = await axios.get(`${environment.apiUrl}/users/${userId}`)
    setAccount(response.data)
  }

  const getCurrentBlogs = async () => {
    const response = await axios.get(
      `${environment.apiUrl}/blogs?authorId=${userId}`
    )
    setBlogs(response.data)
  }

  const isFollowing =
    account && account.followers && state.user
      ? account.followers.includes(state.user.id)
      : false

  const handleFollow = async () => {
    if (!state.user) {
      alert("Your must login to continue!")
      return
    }
    state &&
      (await axios.patch(`${environment.apiUrl}/users/${userId}`, {
        followers: [...account.followers, state.user.id],
      }))
    getCurrentAccount()
    getCurrentBlogs()
  }

  const handleUnfollow = async () => {
    state &&
      (await axios.patch(`${environment.apiUrl}/users/${userId}`, {
        followers: account.followers.filter(
          (follower) => follower != state.user.id
        ),
      }))
    getCurrentAccount()
    getCurrentBlogs()
  }

  useEffect(() => {
    getCurrentAccount()
    getCurrentBlogs()
  }, [])
  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src="http://i.imgur.com/Qr71crq.jpg" className="user-img" />
              <h4>{account && account.username}</h4>
              {account && state.user && state.user.id == account.id && (
                <button
                  className="btn btn-sm btn-outline-secondary action-btn"
                  onClick={() => navigate(`/edit-profile/${state.user.id}`)}>
                  <i className="ion-plus-round"></i>
                  &nbsp; Edit profile
                </button>
              )}
              {!isFollowing ? (
                <button
                  className="btn btn-sm btn-outline-secondary action-btn"
                  onClick={handleFollow}>
                  <i className="ion-plus-round"></i>
                  &nbsp; Follow {account && account.username}
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-outline-secondary action-btn"
                  onClick={handleUnfollow}
                  style={{ backgroundColor: "green" }}>
                  <i className="ion-minus-round"></i>
                  &nbsp; Unfollow {account && account.username}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <a className="nav-link active" href="">
                    Articles
                  </a>
                </li>
              </ul>
            </div>

            {blogs.map((blog) => (
              <div className="article-preview">
                <div className="article-meta">
                  <a href="/profile/eric-simons">
                    <img src="http://i.imgur.com/Qr71crq.jpg" />
                  </a>
                  <div className="info">
                    <Link to={`/profile/${blog.id}`} className="author">
                      {account && account.username}
                    </Link>
                    <span className="date">{blog.createDate}</span>
                  </div>
                  <div>
                    {state.user && account.id == state.user.id && (
                      <button
                        className="btn btn-outline-primary btn-sm pull-xs-right"
                        onClick={() => navigate(`/edit-blog/${blog.id}`)}>
                        <i className="ion-compose"></i> Edit
                      </button>
                    )}
                    <button
                      className="btn btn-secondary btn-sm pull-xs-right"
                      disabled>
                      <i className="ion-heart"></i>
                      {blog.likes.length}
                    </button>
                  </div>
                </div>
                <a className="preview-link">
                  <h1 onClick={() => navigate(`/blogs/${blog.id}`)}>
                    {blog.title}
                  </h1>
                  <span>Read more...</span>
                  <ul className="tag-list">
                    {blog.tags &&
                      blog.tags.map((tag, tagIndex) => (
                        <li
                          className="tag-default tag-pill tag-outline"
                          key={tagIndex}>
                          {tag}
                        </li>
                      ))}
                  </ul>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
