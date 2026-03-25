import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

});

// Allow backend to handle FormData automatically
apiClient.defaults.headers.post["Content-Type"] = undefined;

//  ALWAYS skip Ngrok browser warning page
apiClient.interceptors.request.use((config) => {
  config.headers["ngrok-skip-browser-warning"] = "false";   //  ADD THIS

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//  Auto Logout on 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/signin";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
