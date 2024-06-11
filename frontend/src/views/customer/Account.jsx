import Sidebar from "./Sidebar"
import apiInstance from "../../utils/axios"
import { useState, useEffect } from "react"
import useGetUserData from "../plugin/UserData"
// import UseProfileData from "../plugin/UseProfileData"

function Account() {
  const [profile, setProfile] = useState({})
  const userData = useGetUserData()
  useEffect(() => {
    apiInstance.get(`user/profile/${userData?.user_id}/`).then((res) => {
      setProfile(res.data)
      console.log(profile)
    })
  }, [])
  return (
    <div>
      <main className="mt-5" style={{ marginBottom: "170px" }}>
        <div className="container">
          <section className="">
            <div className="row">
              <Sidebar />
              <div className="col-lg-9 mt-1">
                <main className="mb-5" style={{}}>
                  {/* Container for demo purpose */}
                  <div className="container px-4">
                    {/* Section: Summary */}
                    <section className=""></section>
                    {/* Section: Summary */}
                    {/* Section: MSC */}
                    <section className="">
                      <div className="row rounded shadow p-3">
                        <h2>Hi Matt, </h2>
                        <div className="col-lg-12 mb-4 mb-lg-0 h-100">
                          From your account dashboard. you can easily check
                          &amp; view your <a href="">orders</a>, manage your{" "}
                          <a href=""></a>
                          <a href="">change password</a> and{" "}
                          <a href="">edit account</a> infomations.
                        </div>
                      </div>
                    </section>
                    {/* Section: MSC */}
                  </div>
                  {/* Container for demo purpose */}
                </main>
              </div>
            </div>
          </section>
          {/*Section: Wishlist*/}
        </div>
      </main>
    </div>
  )
}

export default Account
