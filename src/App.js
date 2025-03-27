import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/layout/Header.js";
import Footer from "./components/layout/Footer.js";
import Login from "./components/auth/Login.js";
import Register from "./components/auth/Register.js";
import Logout from "./components/auth/Logout.js";
import UserProfile from "./components/users/UserProfile.js";
import BlogDetail from "./components/blogs/BlogDetail.js";
import CreateBlog from "./components/blogs/CreateBlog.js";
import EditBlog from "./components/blogs/EditBlog.js";
import EditProfile from "./components/users/EditProfile.js";
import AdminLayout from "./components/admin/AdminLayout.js";
import AdminDashboard from "./components/admin/dashboard/AdminDashBoard.js";
import BlogManagement from "./components/admin/blogs/BlogManagement.js";
import UserManagement from "./components/admin/user/UserManagement.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Header />
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Header />
              <Register />
              <Footer />
            </>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <>
              <Header />
              <UserProfile />
              <Footer />
            </>
          }
        />
        <Route
          path="/logout"
          element={
            <>
              <Header />
              <Logout />
              <Footer />
            </>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <>
              <Header />
              <BlogDetail />
              <Footer />
            </>
          }
        />
        <Route
          path="/create-blog"
          element={
            <>
              <Header />
              <CreateBlog />
              <Footer />
            </>
          }
        />
        <Route
          path="/edit-blog/:id"
          element={
            <>
              <Header />
              <EditBlog />
              <Footer />
            </>
          }
        />
        <Route
          path="/edit-profile/:id"
          element={
            <>
              <Header />
              <EditProfile />
              <Footer />
            </>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="blogs" element={<BlogManagement />} />
          <Route path="users" element={<UserManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
