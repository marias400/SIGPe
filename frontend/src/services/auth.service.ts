import axios from "axios";

const API_URL = "http://localhost:8000/api/";

class AuthService {
  login(username: string, password: string) {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    return axios
      .post(API_URL + "auth/token", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        if (response.data.access_token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(name: string, lastname: string, email: string, password: string) {
    return axios.post(API_URL + "users", {
      name,
      lastname,
      email,
      password,
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
  }
}

export default new AuthService();
