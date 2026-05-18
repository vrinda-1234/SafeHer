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

const Signup = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    setErrorMsg("");

    // 🔥 frontend validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("❌ Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setUser(res.data);

      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";

      if (message === "User already exists") {
        setErrorMsg("⚠️ Email already registered. Please login.");
      } else {
        setErrorMsg(message);
      }
    } finally {
      setLoading(false);
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

        {/* 🔥 ERROR MESSAGE UI */}
        {errorMsg && (
          <p className="text-red-600 text-sm text-center">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-700 text-white py-3 rounded-lg font-medium hover:bg-purple-800 transition disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Sign Up"}
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
