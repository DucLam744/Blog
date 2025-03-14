import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  TOKEN_STORAGE,
  USER_CURRENT,
} from "../config/env"

const storage = TOKEN_STORAGE

export const saveToken = (token) => {
  storage.setItem(ACCESS_TOKEN_KEY, token)
}

export const getToken = () => {
  return storage.getItem(ACCESS_TOKEN_KEY)
}

export const saveRefreshToken = (token) => {
  storage.setItem(REFRESH_TOKEN_KEY, token)
}

export const getRefreshToken = () => {
  return storage.getItem(REFRESH_TOKEN_KEY)
}

export const removeToken = () => {
  storage.removeItem(ACCESS_TOKEN_KEY)
  storage.removeItem(REFRESH_TOKEN_KEY)
}

export const saveAccount = (user) => {
  storage.setItem(USER_CURRENT, user)
}

export const getAccount = () => {
  return storage.getItem(USER_CURRENT)
}

export const isAuthenticated = () => {
  return !!getToken()
}
