import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignIn = () => {
  const navigate = useNavigate();
  // const [step, setStep] = useState(1); // Step 1: password login → Step 2: OTP verify
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

      if (res.data.success ) {
        toast.success("Logged In");
        navigate('/');
      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Error during login. Please try again.");
      toast.error("Error during login. Please try again.");

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
        toast.success("Login successful");
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
    <div className="flex justify-center items-center min-h-screen bg-[#f4f4f5] p-4">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 animate-scale-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-slate-900">
            Welcome Back
          </h2>
          <p className="text-slate-500 text-sm">Sign in to your account</p>
        </div>

        {/* Step 1 — Email + Password */}
        
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-slate-700 font-medium mb-2 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 bg-white hover:border-slate-400"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-2 text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 bg-white hover:border-slate-400"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-slate-100 border border-slate-200 text-slate-900 px-4 py-3 rounded-xl text-sm animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-black transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-pulse mr-2">⏳</span>
                  Sending OTP...
                </span>
              ) : (
                "Login & Send OTP"
              )}
            </button>
          </form>
        

        {/* Step 2 — OTP Entry */}
        {/* {step === 2 && (
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
        )} */}

        {/* Signup link */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-600 text-center">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-slate-900 hover:underline font-semibold transition-colors"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
