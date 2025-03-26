import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { environment } from "../../shared/constants/StorageKey.js"

const CommentForm = ({ currentUser, onSubmit }) => {
  const [commentText, setCommentText] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    onSubmit(commentText)
    setCommentText("")
  }

  if (!currentUser) return null

  return (
    <form className="card comment-form" onSubmit={handleSubmit}>
      <div className="card-block">
        <textarea
          className="form-control"
          placeholder="Write a comment..."
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}></textarea>
      </div>
      <div className="card-footer">
        <img
          src={currentUser.image || "/placeholder.svg"}
          className="comment-author-img"
          alt={currentUser.username}
        />
        <button className="btn btn-sm btn-primary">Post Comment</button>
      </div>
    </form>
  )
}

const Comment = ({
  comment,
  currentUser,
  formatDate,
  blogDate,
  onDeleteComment,
  findUser,
}) => {
  const [commentUser, setCommentUser] = useState({
    id: comment.userId,
    username: `User ${comment.userId}`,
    image: "http://i.imgur.com/Qr71crq.jpg",
  })
  const [replyUsers, setReplyUsers] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true)
      try {
        const user = await findUser(comment.userId)
        setCommentUser(user)

        if (comment.replies && comment.replies.length > 0) {
          const replyUsersData = {}
          for (const reply of comment.replies) {
            replyUsersData[reply.userId] = await findUser(reply.userId)
          }
          setReplyUsers(replyUsersData)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [comment, findUser])

  if (loading) {
    return <div className="card">Loading comment...</div>
  }

  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.content}</p>
      </div>
      <div className="card-footer">
        <a href={`/profile/${commentUser.id}`} className="comment-author">
          <img
            src={commentUser.image || "/placeholder.svg"}
            className="comment-author-img"
            alt={commentUser.username}
          />
        </a>
        &nbsp;
        <a href={`/profile/${commentUser.id}`} className="comment-author">
          {commentUser.username}
        </a>
        <span className="date-posted">{formatDate(blogDate)}</span>
        {currentUser && currentUser.id === comment.userId && (
          <span className="mod-options">
            <i
              className="ion-trash-a"
              onClick={() =>
                onDeleteComment && onDeleteComment(comment.id)
              }></i>
          </span>
        )}
      </div>

      {/* Comment Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="card-footer bg-light">
          <h6>Replies:</h6>
          {comment.replies.map((reply) => {
            const replyUser = replyUsers[reply.userId] || {
              id: reply.userId,
              username: `User ${reply.userId}`,
              image: "http://i.imgur.com/Qr71crq.jpg",
            }

            return (
              <div className="card mb-2" key={reply.id}>
                <div className="card-block p-2">
                  <p className="card-text small">{reply.content}</p>
                </div>
                <div className="card-footer py-1">
                  <a
                    href={`/profile/${replyUser.id}`}
                    className="comment-author">
                    <img
                      src={replyUser.image || "/placeholder.svg"}
                      className="comment-author-img"
                      style={{ width: "20px", height: "20px" }}
                      alt={replyUser.username}
                    />
                  </a>
                  &nbsp;
                  <a
                    href={`/profile/${replyUser.id}`}
                    className="comment-author small">
                    {replyUser.username}
                  </a>
                  <span className="date-posted small">
                    {formatDate(blogDate)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function BlogDetail() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [author, setAuthor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [userCache, setUserCache] = useState({})

  useEffect(() => {
    try {
      const userDataString = localStorage.getItem("user_current")
      if (userDataString) {
        const userData = JSON.parse(userDataString)
        setCurrentUser({
          ...userData,
          image: "http://i.imgur.com/Qr71crq.jpg",
        })
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error)
    }
  }, [])

  useEffect(() => {
    const fetchBlogAndAuthor = async () => {
      setLoading(true)
      try {
        const blogResponse = await axios.get(
          `${environment.apiUrl}/blogs/${id}`
        )
        const blogData = blogResponse.data
        setBlog(blogData)
        const authorResponse = await axios.get(
          `${environment.apiUrl}/users/${blogData.authorId}`
        )
        setAuthor(authorResponse.data)
      } catch (error) {
        console.error("Error fetching blog details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBlogAndAuthor()
    }
  }, [id])

  const handleSubmitComment = async (commentText) => {
    if (!currentUser) {
      alert("Please login to comment")
      return
    }

    try {
      // Create new comment
      const newComment = {
        id: String(Date.now()),
        userId: currentUser.id,
        content: commentText,
        replies: [],
      }

      const updatedBlog = {
        ...blog,
        comments: [...blog.comments, newComment],
      }
      await axios.patch(`${environment.apiUrl}/blogs/${id}`, {
        comments: updatedBlog.comments,
      })
      setBlog(updatedBlog)
    } catch (error) {
      console.error("Error posting comment:", error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!currentUser) return

    try {
      const updatedComments = blog.comments.filter(
        (comment) => comment.id !== commentId
      )
      await axios.patch(`${environment.apiUrl}/blogs/${id}`, {
        comments: updatedComments,
      })
      setBlog({
        ...blog,
        comments: updatedComments,
      })
    } catch (error) {
      console.error("Error deleting comment:", error)
    }
  }

  const handleLike = async () => {
    if (!currentUser) {
      alert("Please login to like posts")
      return
    }

    try {
      const userLiked = blog.likes.includes(currentUser.id)
      let updatedLikes

      if (userLiked) {
        updatedLikes = blog.likes.filter((likeId) => likeId !== currentUser.id)
      } else {
        updatedLikes = [...blog.likes, currentUser.id]
      }

      await axios.patch(`${environment.apiUrl}/blogs/${id}`, {
        likes: updatedLikes,
      })

      setBlog({
        ...blog,
        likes: updatedLikes,
      })
    } catch (error) {
      console.error("Error updating like:", error)
    }
  }

  const handleFollow = async () => {
    if (!currentUser) {
      alert("Please login to follow authors")
      return
    }

    if (!author) return

    try {
      const isFollowing = author.followers.includes(currentUser.id)
      let updatedFollowers

      if (isFollowing) {
        updatedFollowers = author.followers.filter(
          (followerId) => followerId !== currentUser.id
        )
      } else {
        updatedFollowers = [...author.followers, currentUser.id]
      }

      await axios.patch(`${environment.apiUrl}/users/${author.id}`, {
        followers: updatedFollowers,
      })

      setAuthor({
        ...author,
        followers: updatedFollowers,
      })
    } catch (error) {
      console.error("Error updating follow status:", error)
    }
  }

  const handleBookmark = async () => {
    if (!currentUser) {
      alert("Please login to bookmark posts")
      return
    }

    try {
      const hasBookmarked = currentUser.bookmarks.includes(id)
      let updatedBookmarks

      if (hasBookmarked) {
        updatedBookmarks = currentUser.bookmarks.filter(
          (bookmarkId) => bookmarkId !== id
        )
      } else {
        updatedBookmarks = [...currentUser.bookmarks, id]
      }

      await axios.patch(`${environment.apiUrl}/users/${currentUser.id}`, {
        bookmarks: updatedBookmarks,
      })

      const updatedUser = {
        ...currentUser,
        bookmarks: updatedBookmarks,
      }
      setCurrentUser(updatedUser)
      localStorage.setItem("user_current", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Error updating bookmark:", error)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  const findUser = async (userId) => {
    if (userCache[userId]) {
      return userCache[userId]
    }
    try {
      const response = await axios.get(`${environment.apiUrl}/users/${userId}`)
      const userData = response.data
      const user = {
        id: userData.id,
        username: userData.username,
        image: "http://i.imgur.com/Qr71crq.jpg",
      }

      setUserCache((prev) => ({
        ...prev,
        [userId]: user,
      }))

      return user
    } catch (error) {
      console.error("Error fetching user:", error)
      return {
        id: userId,
        username: `User ${userId}`,
        image: "http://i.imgur.com/Qr71crq.jpg",
      }
    }
  }

  if (loading) {
    return <div className="container">Loading...</div>
  }

  if (!blog || !author) {
    return <div className="container">Blog not found</div>
  }

  const isFollowing = currentUser && author.followers.includes(currentUser.id)
  const hasLiked = currentUser && blog.likes.includes(currentUser.id)
  const hasBookmarked =
    currentUser && currentUser.bookmarks && currentUser.bookmarks.includes(id)

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{blog.title}</h1>

          <div className="article-meta">
            <Link href={`/profile/${author.id}`}>
              <img src="http://i.imgur.com/Qr71crq.jpg" alt={author.username} />
            </Link>
            <div className="info">
              <Link href={`/profile/${author.id}`} className="author">
                {author.username}
              </Link>
              <span className="date">{formatDate(blog.createDate)}</span>
            </div>
            <button
              className={`btn btn-sm ${
                isFollowing ? "btn-secondary" : "btn-outline-secondary"
              }`}
              onClick={handleFollow}>
              <i className="ion-plus-round"></i>
              &nbsp; {isFollowing ? "Unfollow" : "Follow"} {author.username}
              <span className="counter">({author.followers.length})</span>
            </button>
            &nbsp;&nbsp;
            <button
              className={`btn btn-sm ${
                hasLiked ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={handleLike}>
              <i className="ion-heart"></i>
              &nbsp; {hasLiked ? "Unfavorite" : "Favorite"} Post
              <span className="counter">({blog.likes.length})</span>
            </button>
            &nbsp;&nbsp;
            <button
              className={`btn btn-sm ${
                hasBookmarked ? "btn-success" : "btn-outline-success"
              }`}
              onClick={handleBookmark}>
              <i className="ion-bookmark"></i>
              &nbsp; {hasBookmarked ? "Bookmarked" : "Bookmark"}
            </button>
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>{blog.content}</p>
            <ul className="tag-list">
              {blog.tags.map((tag, index) => (
                <li key={index} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <div className="article-meta">
            <Link to={`/profile/${author.id}`}>
              <img src="http://i.imgur.com/Qr71crq.jpg" alt={author.username} />
            </Link>
            <div className="info">
              <Link to={`/profile/${author.id}`} className="author">
                {author.username}
              </Link>
              <span className="date">{formatDate(blog.createDate)}</span>
            </div>
            <button
              className={`btn btn-sm ${
                isFollowing ? "btn-secondary" : "btn-outline-secondary"
              }`}
              onClick={handleFollow}>
              <i className="ion-plus-round"></i>
              &nbsp; {isFollowing ? "Unfollow" : "Follow"} {author.username}
            </button>
            &nbsp;
            <button
              className={`btn btn-sm ${
                hasLiked ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={handleLike}>
              <i className="ion-heart"></i>
              &nbsp; {hasLiked ? "Unfavorite" : "Favorite"} Article
              <span className="counter">({blog.likes.length})</span>
            </button>
            &nbsp;
            <button
              className={`btn btn-sm ${
                hasBookmarked ? "btn-success" : "btn-outline-success"
              }`}
              onClick={handleBookmark}>
              <i className="ion-bookmark"></i>
              &nbsp; {hasBookmarked ? "Bookmarked" : "Bookmark"}
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <CommentForm
              currentUser={currentUser}
              onSubmit={handleSubmitComment}
            />

            {blog.comments &&
              blog.comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  currentUser={currentUser}
                  formatDate={formatDate}
                  blogDate={blog.createDate}
                  onDeleteComment={handleDeleteComment}
                  findUser={findUser}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetail
