import React, { useEffect } from "react"
import { useState } from "react"
import { login } from "../../utils/auth"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../../store/auth"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/")
    }
  }, [])

  const clearForm = () => {
    setEmail("")
    setPassword("")
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await login(email, password)
    if (error) {
      alert(error)
    } else {
      clearForm()
      navigate("/")
    }
  }

  return (
    <div>
      <h2>Welcome back</h2>
      <p>Login to continue</p>
      <form onSubmit={handleLogin}>
        <label htmlFor="login-email">Email: </label>
        <input
          type="text"
          name="email"
          id="login-email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />
        <br />
        <label htmlFor="login-password">Password: </label>
        <input
          type="text"
          name="password"
          id="login-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        <br />
        <button type="submit">Login</button>
        <hr />
        <Link to={"/forgot-password"}>Forgot Password</Link>
      </form>
    </div>
  )
}

export default Login
