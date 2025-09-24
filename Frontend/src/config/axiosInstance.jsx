import axios from "axios";

export const npmjsserver = axios.create({
  baseURL: "http://localhost:9090", // Your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});
