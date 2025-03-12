import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DeletePost from "./components/DeletePost";
import PostList from "./components/PostList";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import { useState } from "react";
import PostDetails from "./components/PostDetails";

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
      </Routes>
    </Router>
  )
};

export default App;
