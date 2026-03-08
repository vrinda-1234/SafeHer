import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import axios from "axios";
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

const Signup = () => {
  const navigate = useNavigate();
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5001/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      console.log("Signup response:", res.data);

      // save token
      localStorage.setItem("token", res.data.token);

      // save user info
      localStorage.setItem("user", JSON.stringify(res.data));

      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Signup failed");
    }
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
