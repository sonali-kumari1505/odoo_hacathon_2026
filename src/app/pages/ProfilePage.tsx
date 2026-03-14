import { useState } from "react";
import { useNavigate } from "react-router";
import Layout from "../components/Layout";
import { getCurrentUser, logout } from "../utils/auth";
import { User, Mail, KeyRound, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  if (!user) {
    navigate("/");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-red-600 text-4xl font-bold">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.fullName}</h1>
              <p className="text-red-100">@{user.loginId}</p>
              <p className="text-red-100">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === "profile"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === "security"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Security
              </button>
            </nav>
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Account Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <User className="text-red-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-semibold text-gray-800">
                        {user.fullName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <KeyRound className="text-red-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Login ID</p>
                      <p className="font-semibold text-gray-800">
                        {user.loginId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Mail className="text-red-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Email Address</p>
                      <p className="font-semibold text-gray-800">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 italic">
                  Note: This is a demo application. Profile editing is not
                  available in this version.
                </p>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Password & Security
                </h3>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Your account is secured with a password. To change your
                      password or update security settings, use the password
                      recovery option.
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/forgot-password")}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Danger Zone
                </h3>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">
                    Logout from all devices
                  </h4>
                  <p className="text-sm text-red-700 mb-4">
                    This will log you out from this device. You'll need to login
                    again.
                  </p>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Activity Overview
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">N/A</p>
              <p className="text-sm text-gray-600 mt-1">Products Added</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">N/A</p>
              <p className="text-sm text-gray-600 mt-1">Transactions</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">N/A</p>
              <p className="text-sm text-gray-600 mt-1">Days Active</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
