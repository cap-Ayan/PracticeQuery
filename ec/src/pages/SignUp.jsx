import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = user details, 2 = OTP
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    otp: ""
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // STEP 1 → SEND OTP
  const sendOtp = async () => {
    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      setMsg(res.data.message);
      setStep(2); // go to OTP page
    } catch (err) {
      setMsg(err.response?.data?.message || "Error sending OTP");
    }

    setLoading(false);
  };

  // STEP 2 → VERIFY OTP + CREATE USER
  const verifyOtp = async () => {
    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        {
          ...formData,
        },
        { withCredentials: true }
      );

      setMsg("Registration successful!");
      setStep(1); // go back to user details page
      navigate("/"); // redirect to home page)
      console.log("User:", res.data.user);
    } catch (err) {
      setMsg(err.response?.data?.message || "OTP verification failed");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f4f4f5] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-slate-200 animate-scale-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-slate-900">
            Create Account
          </h2>
          <p className="text-slate-500 text-sm">Join us and start shopping</p>
        </div>

        {msg && (
          <div className={`mb-4 px-4 py-3 rounded-xl text-sm text-center animate-fade-in ${
            msg.includes("successful") || msg.includes("sent")
              ? "bg-slate-100 border border-slate-200 text-slate-900"
              : "bg-slate-100 border border-slate-200 text-slate-900"
          }`}>
            {msg}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <label className="block text-slate-700 font-medium mb-2 text-sm">Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 bg-white hover:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-2 text-sm">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 bg-white hover:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-2 text-sm">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 bg-white hover:border-slate-400"
              />
            </div>

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-black transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-pulse mr-2">⏳</span>
                  Sending OTP...
                </span>
              ) : (
                "Send OTP"
              )}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <label className="block text-slate-700 font-medium mb-2 text-sm">Enter OTP</label>
              <input
                type="text"
                placeholder="Enter the OTP sent to your email"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 bg-white hover:border-slate-400 text-center text-2xl tracking-widest"
              />
            </div>

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl hover:bg-black transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-pulse mr-2">⏳</span>
                  Verifying...
                </span>
              ) : (
                "Verify & Register"
              )}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full border-2 border-slate-300 text-slate-700 font-medium py-3 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
            >
              Edit Info
            </button>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-600 text-center">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-slate-900 hover:underline font-semibold transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
