import axios from 'axios'

// create an axios instance with your backend URL
const api = axios.create({ 
  baseURL: 'http://localhost:8080/api' 
})

// before every request, automatically attach the token
// so we don't have to do it manually every time
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api