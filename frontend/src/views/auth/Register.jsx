import React, { useState, useEffect } from "react"
import { register } from "../../utils/auth"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../../store/auth"

function Register() {
  const [fullname, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")

  const [isLoading, setLoading] = useState("")
  const navigate = useNavigate()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/")
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await register(
      fullname,
      email,
      mobile,
      password,
      password2
    )

    if (error) {
      alert(JSON.stringify(error))
    } else {
      navigate("/")
    }
  }

  return (
    <>
      <div>Register</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullName(e.target.value)}
          name=""
          id=""
        />
        <br />
        <br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
          name=""
          id=""
        />
        <br />
        <br />
        <input
          type="number"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          name=""
          id=""
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name=""
          id=""
        />
        <br />
        <br />
        <input
          type="password"
          placeholder="Confirm Password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          name=""
          id=""
        />
        <br />
        <br />
        <button>Register</button>
      </form>
    </>
  )
}

export default Register
