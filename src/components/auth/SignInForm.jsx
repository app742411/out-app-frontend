import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { loginUser } from "../../api/authApi";
import toast from "react-hot-toast";
import { useUser } from "../../context/UserContext";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { fetchDashboard } = useUser();


  // Inline errors per field
  const [errors, setErrors] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setErrors({ email: "", password: "" });

    // Client-side validation
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // stop submission
    }

    // Proceed with API call if validation passes
    setLoading(true);

    try {
      const res = await loginUser(email, password);

      if (res?.token) {
        localStorage.setItem("token", res.token);
        await fetchDashboard();
      }

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;

      if (data) {
        setErrors({
          email: data.email || "",
          password: data.password || "",
        });

        if (data.message) toast.error(data.message);
      } else {
        toast.error("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          {/* Logo */}
          <Link to="/" className="flex justify-center mb-6">
            <img
              className="dark:hidden"
              src="./images/logo/logo-dark.png"
              alt="Logo"
              width={70}
            />
            <img
              className="hidden dark:block"
              src="./images/logo/logo-light.png"
              alt="Logo"
              width={70}
            />
          </Link>

          {/* Heading */}
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-bold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md text-center">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Enter your email and password to sign in!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              {/* Email */}
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@gmail.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="mt-1 text-sm" style={{ color: "#D02030" }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={errors.password ? "border-red-500" : ""}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm" style={{ color: "#D02030" }}>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Keep me logged in + forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </label>
                <Link
                  to="/forget-password"
                  className="text-sm text-brand-700 hover:text-brand-600"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                className="w-full"
                size="sm"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
