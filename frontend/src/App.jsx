import { useState } from "react"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import "./App.css"

import Login from "./views/auth/Login"
import Register from "./views/auth/Register"
import Dashboard from "./views/auth/Dashboard"
import Logout from "./views/auth/Logout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
