import { USER_CURRENT } from "../config/env"
import { LOGIN_SUCCESS, LOGOUT } from "../constants/AuthAction"

export const initialAuthState = {
  user: localStorage.getItem(USER_CURRENT),
  isAuthenticated: !!localStorage.getItem(USER_CURRENT),
}

export const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      localStorage.setItem(USER_CURRENT, JSON.stringify(action.payload))
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      }
    case LOGOUT:
      localStorage.setItem(USER_CURRENT, null)
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      }

    default:
      return state
  }
}
