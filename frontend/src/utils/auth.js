import { useAuthStore } from "../utils/auth"
import axios from "axios"
import jwt_decode from "jwt-decode"
import Cookie from "js-cookie"

export const login = (email, password) => {
  try {
    const { data, status } = axios.post("user/token", {
      email,
      password,
    })

    if (status === 200) {
      setAuthUser(data.access, data.refresh)

      alert("Logged in successfully")
    }
    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error.response.data?.detail || "Something went wrong",
    }
  }
}

export const register = async (
  full_name,
  email,
  phone,
  password,
  password2
) => {
  try {
    const { data } = await axios.post("user/register/", {
      full_name,
      email,
      phone,
      password,
      password2,
    })

    await login(email, password)

    alert("Registration successful")
    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error.response.data?.detail || "Something went wrong",
    }
  }
}

export const logout = () => {
  Cookie.remove("access_token")
  Cookie.remove("refresh_token")
  useAuthStore.getState().setUser(null)

  alert("Logged out successfully")
}

export const setUser = async () => {
  const access_token = Cookie.get("access_token")
  const refresh_token = Cookie.get("refresh_token")

  if (!access_token || !refresh_token) {
    return
  }

  if (isAccessTokenExpired(access_token)) {
    const response = await getRefreshToken(refresh_token)
    setAuthUser(response.access, response.refresh)
  } else {
    setAuthUser(accessToken, refreshToken)
  }
}

export const setAuthUser = (accessToken, refreshToken) => {
  Cookie.set("access_token")
  Cookie.set("refresh_token")
}
