import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const authService = {
  register: async (name, email, password, role) => {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
      role,
    });
    return response.data;
  },
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  updateProfile: async (name, email) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/profile`,
      { name, email },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
  getUserProfile: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  updateUserProfile: async (name, email) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_URL}/profile`,
      { name, email },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },
};

export default authService;
