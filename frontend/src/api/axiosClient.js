import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://inventory-management-4-6gqb.onrender.com",
});

export default axiosClient;
