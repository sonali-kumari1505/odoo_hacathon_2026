import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Layout from "../components/Layout";
import {
  getAdjustments,
  saveAdjustment,
  generateId,
  getProducts,
  getWarehouses,
} from "../utils/inventory";
import { getCurrentUser } from "../utils/auth";
import { Adjustment } from "../types/inventory";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

export default function AdjustmentsPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  const [products] = useState(getProducts());
  const [warehouses] = useState(getWarehouses());
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  
  const [formData, setFormData] = useState({
    productId: "",
    warehouse: "",
    location: "",
    adjustedStock: 0,
    reason: "",
    notes: "",
  });

  useEffect(() => {
    loadAdjustments();
  }, []);

  const loadAdjustments = () => {
    setAdjustments(
      getAdjustments().sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productId || !formData.warehouse || !formData.location || !formData.reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    const product = products.find((p) => p.id === formData.productId);
    if (!product) {
      toast.error("Product not found");
      return;
    }

    const adjustmentData: Adjustment = {
      id: generateId(),
      adjustmentNumber: `ADJ-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      productId: product.id,
      productName: product.name,
      warehouse: formData.warehouse,
      location: formData.location,
      currentStock: product.currentStock,
      adjustedStock: formData.adjustedStock,
      difference: formData.adjustedStock - product.currentStock,
      reason: formData.reason,
      notes: formData.notes,
      createdBy: user?.loginId || "",
      createdAt: new Date().toISOString(),
    };

    saveAdjustment(adjustmentData);
    toast.success("Stock adjustment created successfully");
    setShowModal(false);
    setFormData({
      productId: "",
      warehouse: "",
      location: "",
      adjustedStock: 0,
      reason: "",
      notes: "",
    });
    setSelectedWarehouse("");
    loadAdjustments();
  };

  const filteredAdjustments = adjustments.filter((adj) =>
    adj.adjustmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adj.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentWarehouse = warehouses.find((w) => w.name === selectedWarehouse);
  const selectedProduct = products.find((p) => p.id === formData.productId);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search adjustments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            New Adjustment
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredAdjustments.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No adjustments found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Try adjusting your search"
                  : "Create your first adjustment to get started"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  New Adjustment
                </button>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Adjustment #
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Location
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Previous
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Adjusted
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Difference
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Reason
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAdjustments.map((adjustment) => (
                  <tr
                    key={adjustment.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {adjustment.adjustmentNumber}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(adjustment.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-600">
                      {adjustment.productName}
                    </td>
                    <td className="p-4 text-gray-600">
                      {adjustment.warehouse} / {adjustment.location}
                    </td>
                    <td className="p-4 text-gray-600">
                      {adjustment.currentStock}
                    </td>
                    <td className="p-4 font-semibold text-gray-800">
                      {adjustment.adjustedStock}
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-semibold ${
                          adjustment.difference > 0
                            ? "text-green-600"
                            : adjustment.difference < 0
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {adjustment.difference > 0 ? "+" : ""}
                        {adjustment.difference}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{adjustment.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                New Stock Adjustment
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product *
                  </label>
                  <select
                    value={formData.productId}
                    onChange={(e) =>
                      setFormData({ ...formData, productId: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - Current Stock: {product.currentStock}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Warehouse *
                    </label>
                    <select
                      value={selectedWarehouse}
                      onChange={(e) => {
                        setSelectedWarehouse(e.target.value);
                        setFormData({
                          ...formData,
                          warehouse: e.target.value,
                          location: "",
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    >
                      <option value="">Select Warehouse</option>
                      {warehouses.map((wh) => (
                        <option key={wh.id} value={wh.name}>
                          {wh.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                      disabled={!selectedWarehouse}
                    >
                      <option value="">Select Location</option>
                      {currentWarehouse?.locations.map((loc) => (
                        <option key={loc.id} value={loc.name}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedProduct && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Current Stock:</span>{" "}
                      {selectedProduct.currentStock} {selectedProduct.unit}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adjusted Stock *
                  </label>
                  <input
                    type="number"
                    value={formData.adjustedStock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        adjustedStock: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    min="0"
                    required
                  />
                  {selectedProduct && (
                    <p className="text-sm text-gray-500 mt-1">
                      Difference:{" "}
                      <span
                        className={`font-semibold ${
                          formData.adjustedStock - selectedProduct.currentStock >
                          0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formData.adjustedStock - selectedProduct.currentStock >
                        0
                          ? "+"
                          : ""}
                        {formData.adjustedStock - selectedProduct.currentStock}
                      </span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason *
                  </label>
                  <select
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Select Reason</option>
                    <option value="Physical Count">Physical Count</option>
                    <option value="Damaged Goods">Damaged Goods</option>
                    <option value="Lost Items">Lost Items</option>
                    <option value="Found Items">Found Items</option>
                    <option value="System Error">System Error</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Add any additional notes..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Create Adjustment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
