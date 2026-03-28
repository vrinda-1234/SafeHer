import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
const InputField = ({ type = "text", placeholder, value, onChange, name }) => {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
      required
    />
  );
};

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setErrorMsg(""); // 🔥 clear error while typing

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await API.post("/api/auth/login", formData);
      setUser(res.data);
      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";

      if (message === "Invalid credentials") {
        setErrorMsg("❌ Invalid email or password");
      } else {
        setErrorMsg(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Log in to stay protected">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          name="email"
        />

        <InputField
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          name="password"
        />

        {/* 🔥 ERROR MESSAGE UI */}
        {errorMsg && (
          <p className="text-red-600 text-sm text-center">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-700 text-white py-3 rounded-lg font-medium hover:bg-purple-800 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account?
          <Link to="/signup" className="text-purple-600 font-medium ml-1">
            Sign Up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
