import axios from 'axios';

export const api = axios.create({
  //baseURL: `${import.meta.env.VITE_API_URL}/api/`,
  baseURL: 'http://localhost:3333/',
});
