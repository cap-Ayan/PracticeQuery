import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerificationBox = ({email,setShowVerificationBox}) => {
  const [otp,setOtp]=React.useState("");
  const [loading,setLoading]=React.useState(false);
  const navigate=useNavigate();

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setLoading(true);
    try {
      const res=await axios.post("http://localhost:5000/api/users/verify",{email,otp});
      if(res.data.success){
        toast.success("Account verified successfully");
        setShowVerificationBox(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  }
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 animate-scale-in">
        <h2 className="text-2xl font-bold mb-2 text-slate-900">
          Verify Your Account
        </h2>
        <p className="text-slate-600 mb-6 text-sm">An OTP has been sent to <span className="font-semibold text-slate-900">{email}</span>. Please enter it below to verify your account.</p>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">Enter OTP</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-200 bg-white hover:border-slate-400 text-center text-2xl tracking-widest font-semibold"
              placeholder="000000"
              value={otp}
              onChange={(e)=>setOtp(e.target.value)}
              required
              maxLength={6}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-medium transition-all duration-200"
              onClick={()=>setShowVerificationBox(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-black font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-pulse mr-2">⏳</span>
                  Verifying...
                </span>
              ) : (
                "Verify"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationBox;