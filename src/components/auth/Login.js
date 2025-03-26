import { useEffect, useState } from "react"
import axios from "axios"
import { environment, USER_CURRENT } from "../../shared/constants/StorageKey.js"
import { useAuth } from "../../shared/context/AuthContext.js"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [account, setAccount] = useState({
    email: "",
    password: "",
  })

  const [error, setError] = useState([])
  const { state, setState } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {})

  const handleLogin = async () => {
    setError([])
    let errors = []
    let isValid = true
    if (!account.email.trim()) {
      errors = [...errors, "email is required"]
      isValid = false
    }
    if (!account.password.trim()) {
      errors = [...errors, "Password is required"]
      isValid = false
    }
    if (errors.length !== 0) {
      setError(errors)
    }

    if (isValid) {
      const response = await axios.get(`${environment.apiUrl}/users`)
      const existAccount = response.data.find(
        (acc) =>
          acc.email === account.email && acc.password === account.password
      )
      if (existAccount) {
        localStorage.setItem(USER_CURRENT, JSON.stringify(existAccount))
        setState({ ...state, user: existAccount.email, isAuthenticated: true })
        navigate("/")
      } else {
        setError((prevErrors) => [...prevErrors, "Email/Password is incorrect"])
      }
    }
  }
  return (
    <div class="auth-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Sign in</h1>
            <p class="text-xs-center">
              <a href="/register">Need an account?</a>
            </p>

            <ul className="error-messages">
              {error.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <div>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  value={account.email}
                  onChange={(e) =>
                    setAccount({ ...account, email: e.target.value })
                  }
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  value={account.password}
                  onChange={(e) =>
                    setAccount({ ...account, password: e.target.value })
                  }
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                onClick={handleLogin}>
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
