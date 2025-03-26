import { createContext, useContext, useState } from "react"
import { USER_CURRENT } from "../constants/StorageKey"
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: JSON.parse(localStorage.getItem(USER_CURRENT)),
    isAuthenticated: !!localStorage.getItem(USER_CURRENT),
  })

  return (
    <AuthContext.Provider value={{ state, setState }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
