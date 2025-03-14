import { useState } from "react"
import { InputGroup } from "react-bootstrap"
import { Button, FormControl } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import api from "../../api/api"
import { useError } from "../../context/ErrorContext"

function SignUp() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate()
  const { showError, showMessage } = useError()

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!email || !password || !firstName || !lastName || !confirmPassword) {
      showError("Không được để trống thông tin")
      return
    }
    try {
      const response = await api.post("/register", {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      })
      setEmail("")
      setFirstName("")
      setLastName("")
      setPassword("")
      setConfirmPassword("")
      showMessage("Đăng ký thành công!")
    } catch (error) {
      showError(error.response.data.error)
      console.log(error)
    }
  }
  return (
    <div className="d-flex justify-content-center row gradient">
      <div className="d-flex justify-content-center flex-column col-3 h- ml-auto mr-auto mt-5 border p-5 mb-5 border-primary rounded shadow-lg bg-light">
        <h1>Sign Up</h1>
        <InputGroup className="mb-2 mt-3 w-100 ">
          <FormControl
            placeholder="First name"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />
        </InputGroup>
        <InputGroup className="mb-2 mt-2 w-100 ">
          <FormControl
            placeholder="Last name"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          />
        </InputGroup>
        <InputGroup className="mb-2 mt-2 w-100 ">
          <FormControl
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </InputGroup>
        <InputGroup className="mb-2 mt-2 w-100">
          <FormControl
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={password}
          />
        </InputGroup>
        <InputGroup className="mb-2 mt-2 w-100">
          <FormControl
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            value={confirmPassword}
          />
        </InputGroup>
        <Button
          className="w-100 mb-2"
          variant="success"
          onClick={handleRegister}>
          Sign Up
        </Button>
        <Button
          className="w-100"
          variant="primary"
          onClick={() => navigate("/login")}>
          Login
        </Button>
      </div>
    </div>
  )
}

export default SignUp
