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
      setLoading(false)
    } else {
      navigate("/")
    }
  }

  return (
    <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
      <div className="container">
        {/* Section: Login form */}
        <section className="">
          <div className="row d-flex justify-content-center">
            <div className="col-xl-5 col-md-8">
              <div className="card rounded-5">
                <div className="card-body p-4">
                  <h3 className="text-center">Register </h3>
                  <br />

                  <div className="tab-content">
                    <div
                      className="tab-pane fade show active"
                      id="pills-login"
                      role="tabpanel"
                      aria-labelledby="tab-login"
                    >
                      <form onSubmit={handleSubmit}>
                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="username"
                            placeholder="Full Name"
                            required
                            className="form-control"
                            value={fullname}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                        </div>
                        <div className="form-outline mb-4">
                          <input
                            type="email"
                            id="email"
                            placeholder="Email Address"
                            required
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>

                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="phone"
                            placeholder="Mobile Number"
                            required
                            className="form-control"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                          />
                        </div>
                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        {/* Password input */}
                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            id="confirm-password"
                            placeholder="Confirm Password"
                            required
                            className="form-control"
                            value={password2}
                            onChange={(e) => setPassword2(e.target.value)}
                          />
                        </div>
                        {/* Password Check */}
                        {/* <p className='fw-bold text-danger'>
                                                    {password2 !== password ? 'Passwords do not match' : ''}
                                                </p> */}
                        {isLoading === true ? (
                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                            disabled={isLoading}
                          >
                            <span className="mr-2">
                              Processing <i className="fas fa-spinner spin"></i>{" "}
                            </span>
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                            disabled={isLoading}
                          >
                            <span className="mr-2">Sign Up </span>
                            <i className="fas fa-user-plus" />
                          </button>
                        )}

                        <div className="text-center">
                          <p className="mt-4">
                            Already have an account?{" "}
                            <Link to="/login/">Login</Link>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Register
