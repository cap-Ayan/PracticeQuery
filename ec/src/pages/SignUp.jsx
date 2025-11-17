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
    <div className="flex items-center justify-center min-h-screen bg-[#f4f4f5] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-slate-200 animate-scale-in relative">

        {/* ❌ CROSS BUTTON */}
        <button
          className="absolute right-4 top-4 text-slate-500 text-xl hover:text-slate-800"
          onClick={() => navigate("/")}
        >
          ✖
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-slate-900">
            Create Account
          </h2>
          <p className="text-slate-500 text-sm">Join us and start shopping</p>
        </div>

        {msg && (
          <div
            className={`mb-4 px-4 py-3 rounded-xl text-sm text-center animate-fade-in bg-slate-100 border border-slate-200 text-slate-900`}
          >
            {msg}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <label className="block text-slate-700 font-medium mb-2 text-sm">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-2 text-sm">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-2 text-sm">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl"
              />
            </div>

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            {/* TIMER TEXT */}
            <p className="text-center text-slate-600 font-medium">
              OTP expires in:{" "}
              <span className="font-bold text-slate-900">
                {formatTime(timeLeft)}
              </span>
            </p>

            <div>
              <label className="block text-slate-700 font-medium mb-2 text-sm">
                Enter OTP
              </label>
              <input
                type="text"
                placeholder="Enter the OTP sent to your email"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-center text-2xl tracking-widest"
              />
            </div>

            <button
              onClick={verifyOtp}
              disabled={loading || expired}
              className="w-full bg-slate-900 text-white font-semibold py-3 rounded-xl disabled:opacity-50"
            >
              {expired
                ? "OTP Expired"
                : loading
                ? "Verifying..."
                : "Verify & Register"}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full border-2 border-slate-300 text-slate-700 font-medium py-3 rounded-xl"
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
              className="text-slate-900 hover:underline font-semibold"
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
