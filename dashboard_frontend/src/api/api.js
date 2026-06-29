import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8081/api",
});

// Automatically attach JWT token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");

    console.log("TOKEN BEING SENT:", token);

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});


export default API;