import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  getDashboardStats,
  getProducts,
  getReceipts,
  getDeliveries,
  initializeSampleData,
} from "../utils/inventory";
import {
  Package,
  AlertTriangle,
  XCircle,
  DollarSign,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Product } from "../types/inventory";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState<Product[]>([]);

  useEffect(() => {
    initializeSampleData();
    loadData();
  }, []);

  const loadData = () => {
    const dashboardStats = getDashboardStats();
    setStats(dashboardStats);

    const products = getProducts();
    setLowStockProducts(
      products.filter(
        (p) => p.currentStock <= p.minStock && p.currentStock > 0
      )
    );
    setOutOfStockProducts(products.filter((p) => p.currentStock === 0));
  };

  if (!stats) return null;

  const kpiCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "blue",
      bgColor: "bg-blue-500",
    },
    {
      title: "Low Stock",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
      color: "yellow",
      bgColor: "bg-yellow-500",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStockProducts,
      icon: XCircle,
      color: "red",
      bgColor: "bg-red-500",
    },
    {
      title: "Total Stock Value",
      value: `$${stats.totalStockValue.toLocaleString()}`,
      icon: DollarSign,
      color: "green",
      bgColor: "bg-green-500",
    },
  ];

  const operationCards = [
    {
      title: "Pending Receipts",
      value: stats.pendingReceipts,
      icon: ArrowDownToLine,
      color: "purple",
    },
    {
      title: "Pending Deliveries",
      value: stats.pendingDeliveries,
      icon: ArrowUpFromLine,
      color: "orange",
    },
    {
      title: "Pending Transfers",
      value: stats.pendingTransfers,
      icon: ArrowLeftRight,
      color: "indigo",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-6 border-l-4 border-gray-200 hover:shadow-lg transition-shadow"
                style={{ borderLeftColor: card.bgColor.replace("bg-", "") }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 ${card.bgColor} rounded-full flex items-center justify-center`}
                  >
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Operations Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {operationCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="text-gray-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {card.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stock Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-yellow-500" size={20} />
                <h3 className="font-semibold text-gray-800">
                  Low Stock Alert
                </h3>
              </div>
            </div>
            <div className="p-6">
              {lowStockProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No low stock products
                </p>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-600">{product.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-yellow-600">
                          {product.currentStock}
                        </p>
                        <p className="text-xs text-gray-500">
                          Min: {product.minStock}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Out of Stock Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <XCircle className="text-red-500" size={20} />
                <h3 className="font-semibold text-gray-800">
                  Out of Stock Alert
                </h3>
              </div>
            </div>
            <div className="p-6">
              {outOfStockProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No out of stock products
                </p>
              ) : (
                <div className="space-y-3">
                  {outOfStockProducts.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-600">{product.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">0</p>
                        <p className="text-xs text-gray-500">
                          Min: {product.minStock}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stock by Category Chart Placeholder */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Stock Summary by Category
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">
              Chart visualization would go here (using recharts)
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
