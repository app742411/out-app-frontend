import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import Button from "../ui/button/Button";
import toast from "react-hot-toast";
import { verifyOTP, sendForgotPasswordOTP } from "../../api/authApi";
import code from "../../../public/images/image/ic-email-sent.png";


export default function OTPVerificationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token;
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const inputsRef = useRef([]);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle input change
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
    // focus previous if empty
    if (!value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Handle OTP submit
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpStr = otp.join("");
    if (otpStr.length < 4) {
      setErrors("OTP must be 4 digits");
      return;
    }

    setLoading(true);
    setErrors("");
    console.log("Verifying OTP:", { email, otp: otpStr });

    try {
      const data = await verifyOTP(email, otpStr);
      console.log("OTP Verify Response:", data);

      toast.success(data.message || "OTP verified successfully!");

      // Pass token to update-password page
      navigate("/update-password", { state: { email, token: data.token } });
    } catch (err) {
      console.error("OTP Verify Error:", err);
      const message = err.response?.data?.message || "Invalid OTP!";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOTP = async () => {
    setResendLoading(true);
    setTimer(30);
    try {
      const data = await sendForgotPasswordOTP(email);
      toast.success(data.message || "OTP resent successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP!");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">

        <div className="mb-5 sm:mb-8 text-center">
          <img src={code} alt="" className="mb-2 mx-auto" />
          <h1 className="mb-2 text-gray-800 text-[24px] dark:text-white/90 font-bold">
            Please check your email!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter the 4-digit OTP sent to <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerifyOTP}>
          <div className="flex justify-center gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-12 h-12 text-center border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              />
            ))}
          </div>
          {errors && (
            <p className="mb-2 text-sm text-red-600 dark:text-red-400">{errors}</p>
          )}

          <Button
            className="w-full mb-2"
            type="submit"
            size="sm"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-center">
            <div
              type="button"
              className="text-brand-700 hover:text-brand-800 mt-3 cursor-pointer font-bold text-sm"
              disabled={timer > 0 || resendLoading}
              onClick={handleResendOTP}
            >
              {resendLoading
                ? "Resending..."
                : timer > 0
                  ? `Resend OTP in ${timer}s`
                  : "Resend OTP"}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
