import { createContext, useContext, useEffect, useReducer } from "react"
import { authReducer, initialAuthState } from "../reducers/AuthReducer"
import { getToken, removeToken } from "../config/auth"
import api from "../api/api"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState)

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken()
      if (token) {
        try {
          const response = await api.get("/api/accounts")
          dispatch({ type: "LOGIN_SUCCESS", payload: response.data })
        } catch (error) {
          removeToken()
          dispatch({ type: "LOGOUT" })
        }
      } else {
        dispatch({ type: "LOGOUT" })
      }
    }
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
