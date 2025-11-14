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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 text-black/70">
        <h2 className="text-2xl font-semibold mb-4 text-center">Signup</h2>

        {msg && <p className="text-center text-blue-600 mb-2">{msg}</p>}

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-3"
            />

            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-3"
            />

            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-3"
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-3"
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full border mt-3 py-2 rounded"
            >
              Edit Info
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
