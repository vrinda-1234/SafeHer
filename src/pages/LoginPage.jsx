import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const InputField = ({ type = "text", placeholder, value, onChange ,name}) => {
  
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
    const navigate=useNavigate();
    const [formData, setFormData] = useState({
      email: "",
      password: "",
    });
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Login Data:", formData);
      // 🔗 Backend login API will go here
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard")
    };
  
    return (
      <AuthLayout
        title="Welcome Back"
        subtitle="Log in to stay protected"
      >
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
  
          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-3 rounded-lg font-medium hover:bg-purple-800 transition"
           
          >
            Login
          </button>
  
          <p className="text-sm text-center text-gray-600 mt-4">
            Don’t have an account?
            <Link
              to="/signup"
              className="text-purple-600 font-medium ml-1"
            >
              Sign Up
            </Link>
          </p>
  
        </form>
      </AuthLayout>
    );
  };
  
  export default Login;
  