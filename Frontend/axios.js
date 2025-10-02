import axios from "axios";

export const axiosIstance =axios.create({
  baseURL: "https://mediabackend.vercel.app/api",
    headers: {
        "Content-type": "application/json",
    },
    withCredentials: true,
});