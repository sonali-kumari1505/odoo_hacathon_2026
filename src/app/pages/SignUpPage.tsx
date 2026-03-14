import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  saveUser,
  findUserByLoginId,
  findUserByEmail,
  validateLoginId,
  validateEmail,
  validatePassword,
} from "../utils/auth";
import svgPaths from "../../imports/CoreInventory_-_8_hours.svg";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    loginId: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { fullName, loginId, email, password, confirmPassword } = formData;

    // Validation
    if (!fullName || !loginId || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Validate Login ID (6-12 characters, unique)
    const loginIdError = validateLoginId(loginId);
    if (loginIdError) {
      toast.error(loginIdError);
      setLoading(false);
      return;
    }

    // Check if login ID already exists
    if (findUserByLoginId(loginId)) {
      toast.error("Login ID already exists");
      setLoading(false);
      return;
    }

    // Validate Email
    const emailError = validateEmail(email);
    if (emailError) {
      toast.error(emailError);
      setLoading(false);
      return;
    }

    // Check if email already exists
    if (findUserByEmail(email)) {
      toast.error("Email ID should not be a duplicate in database");
      setLoading(false);
      return;
    }

    // Validate Password
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      setLoading(false);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    // Save user
    saveUser({
      fullName,
      loginId,
      email,
      password,
    });

    toast.success("Account created successfully! Please login.");
    setTimeout(() => {
      navigate("/");
    }, 1000);

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500 rounded-2xl mb-4 shadow-lg">
            <img 
              src={svgPaths} 
              alt="App Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-red-600">Sign Up Page</h1>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-red-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-red-600 mb-2"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-red-200 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            {/* Login ID */}
            <div>
              <label
                htmlFor="loginId"
                className="block text-sm font-medium text-red-600 mb-2"
              >
                Login ID
              </label>
              <input
                id="loginId"
                name="loginId"
                type="text"
                value={formData.loginId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-red-200 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="6-12 characters"
              />
              <p className="text-xs text-red-500 mt-1">
                Must be unique and 6-12 characters
              </p>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-red-600 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-red-200 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-red-600 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-red-200 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="Enter your password"
              />
              <p className="text-xs text-red-500 mt-1">
                Min 8 chars, 1 uppercase, 1 lowercase, 1 number
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-red-600 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border-2 border-red-200 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="Confirm your password"
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "SIGN UP"}
            </button>

            {/* Link to Login */}
            <div className="text-center text-sm text-red-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="hover:underline font-semibold"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>

        {/* Requirements */}
        <div className="mt-6 bg-white rounded-lg shadow p-4 border border-red-200">
          <h3 className="text-xs font-semibold text-red-600 mb-2">
            Validation Rules:
          </h3>
          <ul className="text-xs text-red-600 space-y-1">
            <li>✓ Login ID: unique, 6-12 characters</li>
            <li>✓ Email: must not be duplicate</li>
            <li>✓ Password: min 8 chars, 1 upper, 1 lower, 1 number</li>
            <li>✓ Passwords must match</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
