import axios from "axios";
import { Review } from "../../../Backend/model/model";

// export const API_BASE_URL = "http://localhost:6801";
export const API_BASE_URL = "https://booknest-azel.onrender.com";

const getAuthToken = () => {
  try {
    return localStorage.getItem("authToken");
  } catch {
    return null;
  }
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message =
        error.response.data?.message ||
        error.response.statusText ||
        "Request failed";
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(new Error("No response from server"));
    } else {
      return Promise.reject(new Error(error.message));
    }
  }
);

export const authAPI = {
    Login: (UserData) => axiosInstance.post('/auth/login',UserData),
    Register: (UserData) => axiosInstance.post('/auth/register',UserData)
}

export const UserAPI = {
  GetUser: (id) => axiosInstance.get(`/users/${id}`)
}

export const BookAPI = {
  GetBooks: () => axiosInstance.get('/books'),
  GetBook:(id) => axiosInstance.get(`/books/${id}`),
  AddBook : (data) => axiosInstance.post('/books/addbook',data),
  GetMyBooks :()=>axiosInstance.get('/books/mybooks'),
  EditBook : (id,data) => axiosInstance.put(`/books/${id}`,data),
  DeleteBook : (id) => axiosInstance.delete(`/books/${id}`)
}

export const ReviewAPI = {
  Reviews: () => axiosInstance.get('/review'),
  GetReviewofBook : (id) => axiosInstance.get(`/review/${id}`),
  AddReview: (data,id) => axiosInstance.post(`/review/${id}`,data),
  DeleteReview:(id) => axiosInstance.delete(`/review/${id}`),
  EditReview: (data,id) => axiosInstance.put(`/review/${id}`,data),
}

export const authUtils = {
  isAuthenticated: () => {
    return !!getAuthToken();
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  setAuth: (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  clearAuth: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },
};