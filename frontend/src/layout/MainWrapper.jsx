import React from "react"
import { useEffect, useState } from "react"
import { setUser } from "../utils/auth"

function MainWrapper({ children }) {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const handler = async () => {
      setLoading(true)
      await setUser()
      setLoading(false)
    }
    handler()
  }, [])
  return <>{loading ? null : children}</>
}

export default MainWrapper
