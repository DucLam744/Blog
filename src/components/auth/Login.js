import { useEffect, useState } from "react";
import axios from "axios";
import {
  environment,
  USER_CURRENT,
} from "../../shared/constants/StorageKey.js";
import { useAuth } from "../../shared/context/AuthContext.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [account, setAccount] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState([]);
  const { state, setState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to home
    if (state.isAuthenticated) {
      if (state.user && state.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [state.isAuthenticated, state.user, navigate]);

  const handleLogin = async () => {
    setError([]);
    let errors = [];
    let isValid = true;
    
    if (!account.email.trim()) {
      errors = [...errors, "Email is required"];
      isValid = false;
    }
    if (!account.password.trim()) {
      errors = [...errors, "Password is required"];
      isValid = false;
    }
    if (errors.length !== 0) {
      setError(errors);
      return; // Exit early if validation fails
    }

    if (isValid) {
      setIsLoading(true);
      try {
        const response = await axios.get(`${environment.apiUrl}/users`);
        const existAccount = response.data.find(
          (acc) =>
            acc.email === account.email && acc.password === account.password
        );
        
        if (existAccount) {
          // Store user in localStorage
          localStorage.setItem(USER_CURRENT, JSON.stringify(existAccount));
          
          // Update auth context
          setState({
            ...state,
            user: existAccount,
            isAuthenticated: true,
          });
          
          console.log("Logged in user:", existAccount);
          console.log("User role:", existAccount.role);
          
          // Navigate based on role
          if (existAccount.role === "admin") {
            console.log("Navigating to admin dashboard");
            navigate("/admin");
          } else {
            console.log("Navigating to home page");
            navigate("/");
          }
        } else {
          setError((prevErrors) => [
            ...prevErrors,
            "Email/Password is incorrect",
          ]);
        }
      } catch (error) {
        console.error("Login error:", error);
        setError((prevErrors) => [
          ...prevErrors,
          "An error occurred. Please try again.",
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <a href="/register">Need an account?</a>
            </p>

            {error.length > 0 && (
              <ul className="error-messages">
                {error.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}

            <form onSubmit={handleSubmit}>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  value={account.email}
                  onChange={(e) =>
                    setAccount({ ...account, email: e.target.value })
                  }
                  type="text"
                  placeholder="Email"
                  disabled={isLoading}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  value={account.password}
                  onChange={(e) =>
                    setAccount({ ...account, password: e.target.value })
                  }
                  type="password"
                  placeholder="Password"
                  disabled={isLoading}
                />
              </fieldset>
              <button
                type="submit"
                className="btn btn-lg btn-primary pull-xs-right"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}