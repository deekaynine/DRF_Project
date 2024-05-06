import { useAuthStore } from "../store/auth"
import axios from "./axios"
import jwt_decode from "jwt-decode"
import Cookie from "js-cookie"
import Swal from "sweetalert2"

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: "false",
  timer: 1500,
  timerProgressBar: true,
})

export const login = async (email, password) => {
  try {
    const { data, status } = await axios.post("user/token/", {
      email,
      password,
    })

    if (status === 200) {
      setAuthUser(data.access, data.refresh)

      Toast.fire({
        icon: "success",
        title: "Login Successfull",
      })
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

    Toast.fire({
      icon: "success",
      title: "Acccount created Successfully",
    })
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
  Toast.fire({
    icon: "success",
    title: "Logged Out Successfully",
  })
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
    setAuthUser(access_token, refresh_token)
  }
}

export const setAuthUser = (access_token, refresh_token) => {
  Cookie.set("access_token", access_token, {
    expires: 1,
    secure: true,
  })
  Cookie.set("refresh_token", refresh_token, {
    expires: 7,
    secure: true,
  })

  const user = jwt_decode(access_token) ?? null

  if (user) {
    useAuthStore.getState().setUser(user)
  }

  useAuthStore.getState().setLoading(false)
}

export const getRefreshToken = async () => {
  const refresh_token = Cookie.get("refresh_token")
  const response = await axios.post("user/token/refresh/", {
    refresh: refresh_token,
  })

  return response.data
}

export const isAccessTokenExpired = (accessToken) => {
  try {
    const decodedToken = jwt_decode(accessToken)
    return decodedToken.exp < Date.now() / 100
  } catch (error) {
    return true
  }
}
