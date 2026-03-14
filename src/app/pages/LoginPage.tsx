import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { authenticateUser, setCurrentUser } from "../utils/auth";
import svgPaths from "../../imports/CoreInventory_-_8_hours.svg";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate inputs
    if (!loginId || !password) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Authenticate user
    const user = authenticateUser(loginId, password);

    if (user) {
      setCurrentUser(user);
      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } else {
      toast.error("Invalid Login ID or Password");
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
          <h1 className="text-3xl font-bold text-red-600">Login Page</h1>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-red-200">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-red-200 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="Enter your login ID"
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-red-200 focus:border-red-500 focus:outline-none transition-colors"
                placeholder="Enter your password"
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "SIGN IN"}
            </button>

            {/* Links */}
            <div className="text-center text-sm text-red-600">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="hover:underline"
              >
                Forget Password?
              </button>
              <span className="mx-2">|</span>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="hover:underline"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>

        {/* Requirements */}
        <div className="mt-6 bg-white rounded-lg shadow p-4 border border-red-200">
          <h3 className="text-xs font-semibold text-red-600 mb-2">Features:</h3>
          <ul className="text-xs text-red-600 space-y-1">
            <li>✓ Check for Login Credentials</li>
            <li>✓ Match creds, and allow to login a user</li>
            <li>✓ If Creds does not match throw an error msg</li>
            <li>✓ When clicked on SignUp, land to SignUp page</li>
            <li>✓ When Clicked on Forget Password click on Forget Password page</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
