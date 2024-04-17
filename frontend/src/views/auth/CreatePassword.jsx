import React, { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import apiInstance from "../../utils/axios"

function CreatePassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [searchParam] = useSearchParams()
  const otp = searchParam.get("otp")
  const uidb64 = searchParam.get("uidb64")

  const navigate = useNavigate()

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Passwords do not match")
    } else {
      const formdata = new FormData()
      formdata.append("password", password)
      formdata.append("otp", otp)
      formdata.append("uidb64", uidb64)

      try {
        await apiInstance
          .post(`user/password-change/`, formdata)
          .then((res) => {
            console.log(res.data)
            alert("Password Changed Successfully")
            navigate("/login")
          })
      } catch (error) {
        alert("An error has occurred")
      }
    }
  }

  return (
    <div>
      <h1>Create New Password</h1>
      <form onSubmit={handlePasswordSubmit}>
        <input
          type="password"
          name=""
          id=""
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <input
          type="password"
          name=""
          id=""
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />
        <br />
        <button type="submit">Save New Password</button>
      </form>
    </div>
  )
}

export default CreatePassword
