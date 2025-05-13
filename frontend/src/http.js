import axios from 'axios'

let http = axios.create({
  baseURL: 'http://84.201.138.255:8000/api',
  headers: {
    'Content-type': 'application/json'
  }
})

export default http