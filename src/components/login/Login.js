import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "../../api/authApi"
import { useAuth } from "../../context/AuthContext"
import api from "../../api/api"
import "./login.scss"
import { Button, FormControl, InputGroup } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons"
import { useError } from "../../context/ErrorContext"
import { LOGIN_SUCCESS } from "../../constants/AuthAction"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { dispatch } = useAuth()
  const { showError } = useError()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      showError("Email và mật khẩu không được để trống")
      return
    }
    try {
      const response = await login(email, password)
      const user = await api.get("/api/accounts")
      dispatch({ type: LOGIN_SUCCESS, payload: user.data })
      navigate("/")
    } catch (error) {
      showError(error.response.data)
    }
  }

  const handleSignIn = () => {
    navigate("/signup")
  }

  return (
    <div className="d-flex justify-content-center row gradient">
      <div className="d-flex justify-content-center flex-column col-3 h- ml-auto mr-auto mt-5 border p-5 mb-5 border-primary rounded shadow-lg bg-light">
        <h1>Login</h1>
        <InputGroup className="mb-4 mt-3 w-100 ">
          <InputGroup.Text className="bg-primary">
            <FontAwesomeIcon color="white" icon={faUser} />
          </InputGroup.Text>
          <FormControl
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup className="mb-5 w-100">
          <InputGroup.Text className="bg-primary">
            <FontAwesomeIcon color="white" icon={faLock} />
          </InputGroup.Text>
          <FormControl
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
          />
        </InputGroup>
        <Button className="w-100 mb-2" variant="primary" onClick={handleLogin}>
          Login
        </Button>
        <Button className="w-100" variant="success" onClick={handleSignIn}>
          Sign Up
        </Button>
      </div>
    </div>
  )
}

export default Login
