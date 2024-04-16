import React, { useState } from "react"
import apiInstance from "../../utils/axios"

function ForgotPassword() {
  const [email, setEmail] = useState("")

  const handleSubmit = () => {
    apiInstance.get(`user/password-reset/${email}/`).then((res) => {
      console.log(res)
    })
  }

  return (
    <div>
      <h1>Forgot Password</h1>
      <input
        type="text"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
        }}
      />
      <br />
      <br />
      <button onClick={handleSubmit}>Reset Password</button>
    </div>
  )
}

export default ForgotPassword
