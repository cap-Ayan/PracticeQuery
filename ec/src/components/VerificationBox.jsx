import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerificationBox = ({ email, setShowVerificationBox, setShowUnverifiedPopup}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const navigate = useNavigate();

  // COUNTDOWN TIMER
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // FORMAT TIMER → MM:SS
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (timeLeft <= 0) {
      toast.error("OTP expired! Please request a new one.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/users/verify", { email, otp });

      if (res.data.success) {
        toast.success("Account verified successfully");
        setShowVerificationBox(false);
        setShowUnverifiedPopup(false);
        navigate("/");
      } else {
        toast.error(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  };

  const resend = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/send", { email });
       if (res.data.success) {
        toast.success("OTP sent successfully");
        setShowVerificationBox(true);

       }else{
        toast.error(res.data.message)
       }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 animate-scale-in">
        <h2 className="text-2xl font-bold mb-2 text-slate-900">
          Verify Your Account
        </h2>

        <p className="text-slate-600 mb-2 text-sm">
          An OTP has been sent to <span className="font-semibold text-slate-900">{email}</span>.
        </p>

        {/* TIMER */}
        <p className="text-red-600 text-sm font-semibold mb-4">
          OTP expires in: {formatTime(timeLeft)}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">Enter OTP</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 bg-white hover:border-slate-400 text-center text-2xl tracking-widest font-semibold"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              disabled={timeLeft <= 0}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-medium transition-all duration-200"
              onClick={() => setShowVerificationBox(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-black font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              disabled={loading || timeLeft <= 0}
            >
              {timeLeft <= 0 ? (
                "Expired"
              ) : loading ? (
                <span className="flex items-center">
                  <span className="animate-pulse mr-2">⏳</span>
                  Verifying...
                </span>
              ) : (
                "Verify"
              )}
            </button>
          </div>

          {/* OPTIONAL RESEND BUTTON */}
          {timeLeft <= 0 && (
            <button
              type="button"
              className="w-full mt-3 bg-slate-200 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-300"
              onClick={() => {
                resend();
                
              }}
            >
              Resend OTP
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default VerificationBox;
