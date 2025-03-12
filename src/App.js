import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DeletePost from "./components/DeletePost";
import PostList from "./components/PostList";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import { useState } from "react";
import PostDetails from "./components/PostDetails";
import NavbarComponent from "./components/NavbarComponent";
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";

const App = () => {
  const [isAuthencated, setIsAuthencated] = useState(false);

  const handleLogin = () => {
    setIsAuthencated(true);
  }
  const handleLogout = () => {
    setIsAuthencated(false);
  }
  return (
    <Router>
      {isAuthencated && <NavbarComponent onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/posts" element={
          <PrivateRoute isAuthencated={isAuthencated}>
            <PostList />
          </PrivateRoute>} />
        <Route path="/posts/:postId" element={
          <PrivateRoute isAuthencated={isAuthencated}>
            <PostDetails />
          </PrivateRoute>} />
        <Route
          path="/posts/createPost"
          element={
            <PrivateRoute isAuthencated={isAuthencated}>
              <CreatePost />
            </PrivateRoute>
          }
        />
        <Route
          path="/posts/edit/:postId"
          element={
            <PrivateRoute isAuthencated={isAuthencated}>
              <EditPost />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
};

export default App;
