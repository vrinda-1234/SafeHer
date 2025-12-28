import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assests/logo.png";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="SafeHer Logo" className="h-28 w-auto" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-purple-900 text-center mb-2">
          {title}
        </h2>
        <p className="text-gray-600 text-center mb-6">
          {subtitle}
        </p>

        {/* Form */}
        {children}

        {/* Trust Note */}
        <p className="text-xs text-gray-500 text-center mt-6">
          🔒 Your data is encrypted & never shared
        </p>
      </div>
    </div>
  );
};
const InputField = ({ type = "text", placeholder, value, onChange }) => {
    return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
        required
      />
    );
  };
  
  const Login = () => {
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
  