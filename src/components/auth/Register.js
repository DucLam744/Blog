import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { environment } from "../../shared/constants/StorageKey.js";

function Register() {
  const [formRegister, setFormRegister] = useState({
    username: "",
    email: "",
    password: "",
    followers: [],
    bookmarks: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState([]);
  const navigate = useNavigate();
  const [accountList,setAccountList] = useState([]);

  useEffect(() => {
    axios
      .get(`${environment.apiUrl}/users`)
      .then((response) => {
        setAccountList(response.data); 
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleChange = (e) => {
    setFormRegister({ ...formRegister, [e.target.name]: e.target.value });
  };

  function submit() {
    let tempErrors = [];
    let isSubmit = true;

    if (!formRegister.username.trim()) {
      tempErrors.push("Username is required.");
      isSubmit = false;
    }
    if (!formRegister.email.trim()) {
      tempErrors.push("Email is required.");
      isSubmit = false;
    } else if (!/\S+@\S+\.\S+/.test(formRegister.email)) {
      tempErrors.push("Invalid email format.");
      isSubmit = false;
    }

    if (accountList.some((account) => account.email === formRegister.email)) {
      tempErrors.push("Email already exists.");
      isSubmit = false;
    }
    
    if (!formRegister.password) {
      tempErrors.push("Password is required.");
      isSubmit = false;
    } else if (formRegister.password.length < 6) {
      tempErrors.push("Password must be at least 6 characters.");
      isSubmit = false;
    }

    if (tempErrors.length > 0) {
      setError(tempErrors);
      return;
    }

    setIsLoading(true);

    axios
      .post(`${environment.apiUrl}/users`, JSON.stringify(formRegister))
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(["Failed to register. Please try again."]);
      })
      .finally(() => {
        setIsLoading(false); 
      });
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <Link to="/login">Have an account?</Link>
            </p>
            <ul className="error-messages">
              {error.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <div>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  onChange={handleChange}
                  name="username"
                  value={formRegister.username}
                  placeholder="Username"
                  disabled={isLoading}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  onChange={handleChange}
                  name="email"
                  value={formRegister.email}
                  placeholder="Email"
                  disabled={isLoading}
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  name="password"
                  onChange={handleChange}
                  value={formRegister.password}
                  placeholder="Password"
                  disabled={isLoading}
                />
              </fieldset>
              <button
                onClick={submit}
                className="btn btn-lg btn-primary pull-xs-right"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  "Sign up"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
