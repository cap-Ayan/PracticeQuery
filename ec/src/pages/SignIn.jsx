import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: password login → Step 2: OTP verify
  const [formData, setFormData] = useState({ email: "", password: "", otp: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // handle field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1 — Submit email + password to get OTP
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        { email: formData.email, password: formData.password },
        { withCredentials: true }
      );

      if (res.data.success && res.data.message === "OTP sent to your email") {
        alert("OTP sent to your email. Please check your inbox.");
        setStep(2);
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Error during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — Submit OTP to complete login
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        { email: formData.email, otp: formData.otp },
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Login successful!");
        navigate("/");
      } else {
        setError(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Error verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          {step === 1 ? "Sign In" : "Verify OTP"}
        </h2>

        {/* Step 1 — Email + Password */}
        {step === 1 && (
          <form onSubmit={handleLogin} className="space-y-4 text-black/70">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
            >
              {loading ? "Sending OTP..." : "Login & Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2 — OTP Entry */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4 text-black/70">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Enter OTP</label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {/* Signup link */}
        <p className="text-sm text-gray-700 text-center mt-4">
          New user?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
