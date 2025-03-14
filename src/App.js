import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import Home from "./components/home/Home"
import MyBlog from "./components/myBlog/MyBlog"
import Blog from "./components/blog/Blog"
import Login from "./components/login/Login"
import SignUp from "./components/signUp/SignUp"
import MyNavbar from "./components/myNavbar/MyNavbar"
import Profile from "./components/profile/Profile"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import Logout from "./components/login/Logout"

function App() {
  const { state, dispatch } = useAuth()
  console.log(state)

  if (state.loading) {
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter>
      <MyNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-blog" element={<MyBlog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/blog-post/:slug" element={<Blog />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
