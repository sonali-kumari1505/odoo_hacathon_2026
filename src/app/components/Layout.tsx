import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { getCurrentUser, logout } from "../utils/auth";
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  History,
  Wrench,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    navigate("/");
    return null;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: ArrowDownToLine, label: "Receipts", path: "/receipts" },
    { icon: ArrowUpFromLine, label: "Deliveries", path: "/deliveries" },
    { icon: ArrowLeftRight, label: "Transfers", path: "/transfers" },
    { icon: Wrench, label: "Adjustments", path: "/adjustments" },
    { icon: History, label: "Move History", path: "/movements" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-red-600 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-red-500 flex items-center justify-between">
          {sidebarOpen ? (
            <>
              <h1 className="text-xl font-bold">CoreInventory</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="hover:bg-red-500 p-1 rounded"
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="hover:bg-red-500 p-1 rounded mx-auto"
            >
              <Menu size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-red-700 font-semibold"
                        : "hover:bg-red-500"
                    }`}
                  >
                    <Icon size={20} />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-red-500">
          <button
            onClick={() => navigate("/profile")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500 transition-colors mb-2 ${
              location.pathname === "/profile" ? "bg-red-700" : ""
            }`}
          >
            <User size={20} />
            {sidebarOpen && <span>Profile</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500 transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {menuItems.find((item) => item.path === location.pathname)
                  ?.label || "CoreInventory"}
              </h2>
              <p className="text-sm text-gray-500">
                Welcome back, {user.fullName}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  {user.fullName}
                </p>
                <p className="text-xs text-gray-500">{user.loginId}</p>
              </div>
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
