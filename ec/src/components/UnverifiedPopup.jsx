import React from "react";
import VerificationBox from './VerificationBox'
import axios from "axios";
import { toast } from "react-toastify";


const UnverifiedPopup = ({ setShowUnverifiedPopup, user }) => {
  const [showOtpBox, setShowOtpBox] = React.useState(false);
 

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl relative">

        {/* ❌ CROSS BUTTON */}
        <button
          className="absolute top-3 right-3 text-xl text-slate-600 hover:text-black"
          onClick={() => setShowUnverifiedPopup(false)}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-2 text-slate-900">
          Account Not Verified
        </h2>

        <p className="text-slate-600 mb-4">
          Your account is not verified yet. Please verify to unlock all features.
        </p>

        <button
          className="w-full bg-slate-900 text-white py-2 rounded-xl hover:bg-black"
          onClick={async () => {
             try {
             const res = await axios.post("http://localhost:5000/api/users/send",{email:user.email})
            if(res.data.success){
                 setShowOtpBox(true)
                 
                }
                else{
                    toast.error(res.data.message)
                    }
                } catch (error) {
                toast.error(error.message)
                }
          }}
        >
          Verify Now
        </button>

        {/* OTP BOX */}
        {showOtpBox && (
          <VerificationBox
            email={user.email}
            setShowVerificationBox={setShowOtpBox} setShowUnverifiedPopup={setShowUnverifiedPopup}
          />
        )}
      </div>
    </div>
  );
};

export default UnverifiedPopup;
