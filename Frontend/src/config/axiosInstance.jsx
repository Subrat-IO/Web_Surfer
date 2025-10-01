import axios from "axios";


export const BASE_URL = "https://web-surfer.onrender.com"
export const npmjsserver = axios.create({
  baseURL: BASE_URL,
  "Content-Type": "application/json",
});

