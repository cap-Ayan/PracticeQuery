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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Verify Your Account</h2>
        <p className="text-gray-600 mb-4">An OTP has been sent to {email}. Please enter it below to verify your account.</p>
        <form onSubmit={handleSubmit} className='text-black/70'>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e)=>setOtp(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={()=>setShowVerificationBox(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading?"Verifying...":"Verify"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationBox;