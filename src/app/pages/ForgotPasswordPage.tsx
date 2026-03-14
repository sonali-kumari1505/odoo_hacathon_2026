import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { findUserByEmail, validateEmail } from "../utils/auth";
import svgPaths from "../../imports/CoreInventory_-_8_hours.svg";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.error("Please enter your email address");
      setLoading(false);
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      toast.error(emailError);
      setLoading(false);
      return;
    }

    const user = findUserByEmail(email);
    if (user) {
      toast.success(
        "Password reset instructions have been sent to your email!"
      );
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      toast.error("No account found with this email address");
    }

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
          <h1 className="text-3xl font-bold text-red-600">Forgot Password</h1>
          <p className="text-red-500 mt-2">
            Enter your email to reset your password
          </p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-red-200">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-red-200 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="Enter your registered email"
              />
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "RESET PASSWORD"}
            </button>

            {/* Back to Login */}
            <div className="text-center text-sm text-red-600">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="hover:underline font-semibold"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        </div>

        {/* Info */}
        <div className="mt-6 bg-white rounded-lg shadow p-4 border border-red-200">
          <p className="text-xs text-red-600">
            💡 This is a demo app. In production, a password reset link would be
            sent to your email.
          </p>
        </div>
      </div>
    </div>
  );
}
