import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./components/home/Home"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import Header from "./components/layout/Header.js"
import Footer from "./components/layout/Footer.js"
import Login from "./components/auth/Login.js"
import Register from "./components/auth/Register.js"
import Logout from "./components/auth/Logout.js"
import UserProfile from "./components/users/UserProfile.js"
import BlogDetail from "./components/blogs/BlogDetail.js"
import CreateBlog from "./components/blogs/CreateBlog.js"
import EditBlog from "./components/blogs/EditBlog.js"
import EditProfile from "./components/users/EditProfile.js"

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/edit-blog/:id" element={<EditBlog />} />
        <Route path="/edit-profile/:id" element={<EditProfile />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
