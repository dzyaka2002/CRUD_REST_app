import axios from 'axios';

const host = window.location.hostname;  // Берёт домен/ip текущей страницы

const http = axios.create({
  baseURL: `http://${host}:8000/api`,  // Пример: http://84.201.138.255:8000/api
  headers: {
    'Content-type': 'application/json'
  }
});

export default http;
