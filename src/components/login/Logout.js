import { useEffect } from "react"
import { logout } from "../../api/authApi"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Logout() {
  const { dispatch } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    logout()
    dispatch({ type: "LOGOUT" })
    navigate("/login")
  }, [])
}
