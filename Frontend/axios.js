import axios from "axios";

export const axiosIstance =axios.create({
  baseURL: "https://social-media-ruby-seven.vercel.app/api",
    headers: {
        "Content-type": "application/json",
    },
    withCredentials: true,
});