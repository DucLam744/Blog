import api from "./api"
import { saveToken, saveRefreshToken, removeToken } from "../config/auth"

export const login = async (email, password) => {
  const response = await api.post("/auth", { email, password })

  saveToken(response.data.accessToken)
  saveRefreshToken(response.data.refreshToken)

  return response
}

export const logout = () => {
  removeToken()
}
