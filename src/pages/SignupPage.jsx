import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const InputField = ({ type = "text", placeholder, value, onChange,name }) => {
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


const Signup = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Signup Data:", formData);
    // 🔗 Backend API call will go here
    localStorage.setItem("isLoggedIn", "true");
    navigate("/dashboard");
  };

  return (
    <AuthLayout
      title="Create Your SafeHer Account"
      subtitle="Your safety journey starts here"
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        <InputField
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          name="name"
        />

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

        <InputField
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          name="confirmPassword"
        />

        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-3 rounded-lg font-medium hover:bg-purple-800 transition"
        >
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?
          <Link to="/login" className="text-purple-600 font-medium ml-1">
            Login
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
};

export default Signup;

