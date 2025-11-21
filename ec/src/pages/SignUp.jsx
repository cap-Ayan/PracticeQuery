import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // TIMER STATES
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 seconds
  const [expired, setExpired] = useState(false);

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
      setStep(2);

      // RESET TIMER
      setTimeLeft(300);
      setExpired(false);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error sending OTP");
    }

    setLoading(false);
  };

  // STEP 2 → VERIFY OTP + REGISTER
  const verifyOtp = async () => {
    if (expired) {
      setMsg("OTP expired. Please request a new one.");
      return;
    }

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
      setStep(1);
      navigate("/");
      console.log("User:", res.data.user);
    } catch (err) {
      setMsg(err.response?.data?.message || "OTP verification failed");
    }

    setLoading(false);
  };

  // TIMER COUNTDOWN
  useEffect(() => {
    if (step !== 2) return;

    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }

    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, step]);

  // FORMAT MM:SS
  const formatTime = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
      sec % 60
    ).padStart(2, "0")}`;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-slate-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-md w-full glass p-8 rounded-3xl shadow-2xl relative z-10 animate-fade-in-up">

        {/* ❌ CROSS BUTTON */}
        <button
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-800 transition-colors"
          onClick={() => navigate("/")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Create Account
          </h2>
          <p className="text-slate-500">Join us and start shopping</p>
        </div>

        {msg && (
          <div
            className={`mb-6 px-4 py-3 rounded-xl text-sm text-center animate-fade-in bg-indigo-50 border border-indigo-100 text-indigo-700`}
          >
            {msg}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="group">
              <label className="block text-sm font-medium text-slate-700 mb-1 transition-colors group-focus-within:text-indigo-600">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none shadow-sm"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-slate-700 mb-1 transition-colors group-focus-within:text-indigo-600">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none shadow-sm"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-slate-700 mb-1 transition-colors group-focus-within:text-indigo-600">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-xl border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none shadow-sm"
              />
            </div>

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending OTP...
                </span>
              ) : (
                "Send OTP"
              )}
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            {/* TIMER TEXT */}
            <div className="text-center bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <p className="text-indigo-600 font-medium mb-1">OTP Sent to your email</p>
              <p className="text-slate-600 text-sm">
                Expires in:{" "}
                <span className="font-bold text-slate-900 font-mono text-lg">
                  {formatTime(timeLeft)}
                </span>
              </p>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-slate-700 mb-1 transition-colors group-focus-within:text-indigo-600 text-center">
                Enter Verification Code
              </label>
              <input
                type="text"
                placeholder="• • • • • •"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="block w-full px-4 py-4 rounded-xl border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none shadow-sm text-center text-3xl tracking-[0.5em] font-bold text-slate-800"
                maxLength={6}
              />
            </div>

            <button
              onClick={verifyOtp}
              disabled={loading || expired}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {expired
                ? "OTP Expired"
                : loading
                  ? "Verifying..."
                  : "Verify & Register"}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full bg-white border border-slate-200 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
            >
              ← Back to Edit Info
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-200/60 text-center space-y-3">
          <p className="text-slate-600 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline transition-colors"
            >
              Sign in here
            </button>
          </p>
          <p className="text-slate-600 text-sm">
            Want to become an admin?{" "}
            <button
              onClick={() => navigate("/adminsgn")}
              className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline transition-colors"
            >
              Sign in as admin
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
