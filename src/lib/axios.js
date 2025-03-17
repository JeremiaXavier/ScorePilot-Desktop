import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:"http://192.168.200.199:5001/api",
    withCredentials:true,
    
})