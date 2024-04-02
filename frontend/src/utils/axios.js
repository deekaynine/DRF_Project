import axios from "axios"

const apiInstance = axios.create({
  baseUrl: "http://127.0.0.1:8000/api/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

export default apiInstance