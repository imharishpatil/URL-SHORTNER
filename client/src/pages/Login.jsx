import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Send a POST request to the backend for login
      const response = await axios.post(`${BACKEND_URL}/user/login`, {
        email,
        password,
      });

      // Store the JWT token in a cookie
      Cookies.set("token", response.data.token, { expires: 1 });

      // Check if the user is an admin
      if (response.data.user && response.data.user.role === "admin") {
        navigate("/admin"); // Redirect to the admin page if the user is an admin
      } else {
        navigate("/"); // Redirect to the home page for regular users
      }
    } catch (error) {
      console.log("server err :", error);
      setError(error.response?.data?.message || "Server Error");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        {/* Admin Auto-fill Button */}
        <div className="flex justify-end mb-2">
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
            onClick={() => {
              setEmail("admin@gmail.com");
              setPassword("Admin@123");
            }}
          >
            Admin
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
