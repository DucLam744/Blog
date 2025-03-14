import axios from "axios"
import { API_URL, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../config/env"
import {
  getToken,
  saveToken,
  getRefreshToken,
  saveRefreshToken,
  removeToken,
} from "../config/auth"

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
})
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth")
    ) {
      originalRequest._retry = true
      try {
        const refreshToken = getRefreshToken()
        if (!refreshToken) {
          window.location.href = "/login"
          return Promise.reject(error)
        }
        const response = await axios.get(`${API_URL}/refresh-token`, {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        })

        saveToken(response.data.accessToken)
        saveRefreshToken(response.data.refreshToken)
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
        return api(originalRequest)
      } catch (err) {
        removeToken()
        window.location.href = "/login"
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default api
