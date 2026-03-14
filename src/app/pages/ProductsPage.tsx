import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Layout from "../components/Layout";
import { getProducts, deleteProduct } from "../utils/inventory";
import { Product } from "../types/inventory";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Grid3x3,
  List,
  AlertTriangle,
  Package,
} from "lucide-react";
import { toast } from "sonner";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setProducts(getProducts());
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      toast.success("Product deleted successfully");
      loadProducts();
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const getStockStatus = (product: Product) => {
    if (product.currentStock === 0) return "out";
    if (product.currentStock <= product.minStock) return "low";
    return "normal";
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1 flex gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            {/* View Mode Toggle */}
            <div className="flex bg-white border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-red-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                } rounded-l-lg transition-colors`}
              >
                <Grid3x3 size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-red-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                } rounded-r-lg transition-colors`}
              >
                <List size={20} />
              </button>
            </div>

            {/* Add Product Button */}
            <button
              onClick={() => navigate("/products/new")}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || categoryFilter !== "All"
                ? "Try adjusting your filters"
                : "Get started by adding your first product"}
            </p>
            {!searchTerm && categoryFilter === "All" && (
              <button
                onClick={() => navigate("/products/new")}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Add Product
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product);
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                    <Package className="text-gray-400" size={64} />
                    {stockStatus !== "normal" && (
                      <div
                        className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${
                          stockStatus === "out"
                            ? "bg-red-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {stockStatus === "out" ? "Out of Stock" : "Low Stock"}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{product.sku}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Stock:</span>
                        <span
                          className={`font-semibold ${
                            stockStatus === "out"
                              ? "text-red-600"
                              : stockStatus === "low"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.currentStock} {product.unit}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-semibold text-gray-800">
                          ${product.sellingPrice}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Location:</span>
                        <span className="text-gray-800">{product.location}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/products/edit/${product.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded transition-colors"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    SKU
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Stock
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Location
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="text-right p-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <tr
                      key={product.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <p className="font-medium text-gray-800">
                          {product.name}
                        </p>
                      </td>
                      <td className="p-4 text-gray-600">{product.sku}</td>
                      <td className="p-4 text-gray-600">{product.category}</td>
                      <td className="p-4">
                        <span
                          className={`font-semibold ${
                            stockStatus === "out"
                              ? "text-red-600"
                              : stockStatus === "low"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.currentStock} {product.unit}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {product.warehouse} / {product.location}
                      </td>
                      <td className="p-4 font-semibold text-gray-800">
                        ${product.sellingPrice}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              navigate(`/products/edit/${product.id}`)
                            }
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(product.id, product.name)
                            }
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
