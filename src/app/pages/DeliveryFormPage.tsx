import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Layout from "../components/Layout";
import {
  saveDelivery,
  getDeliveryById,
  generateId,
  getWarehouses,
  getProducts,
} from "../utils/inventory";
import { getCurrentUser } from "../utils/auth";
import { Delivery, DeliveryItem } from "../types/inventory";
import { toast } from "sonner";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";

export default function DeliveryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const user = getCurrentUser();

  const [warehouses] = useState(getWarehouses());
  const [products] = useState(getProducts());
  const [formData, setFormData] = useState<Delivery>({
    id: "",
    deliveryNumber: `DEL-${Date.now()}`,
    date: new Date().toISOString().split("T")[0],
    customer: "",
    warehouse: "",
    status: "Draft",
    items: [],
    notes: "",
    createdBy: user?.loginId || "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    if (isEdit && id) {
      const delivery = getDeliveryById(id);
      if (delivery) {
        setFormData(delivery);
      } else {
        toast.error("Delivery not found");
        navigate("/deliveries");
      }
    }
  }, [id, isEdit, navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const addItem = () => {
    const newItem: DeliveryItem = {
      productId: "",
      productName: "",
      quantity: 0,
      sellingPrice: 0,
      total: 0,
    };
    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...formData.items];
    const item = { ...updatedItems[index] };

    if (field === "productId") {
      const product = products.find((p) => p.id === value);
      if (product) {
        item.productId = product.id;
        item.productName = product.name;
        item.sellingPrice = product.sellingPrice;
      }
    } else if (field === "quantity" || field === "sellingPrice") {
      item[field] = parseFloat(value) || 0;
    }

    item.total = item.quantity * item.sellingPrice;
    updatedItems[index] = item;

    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer || !formData.warehouse) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    const hasInvalidItem = formData.items.some(
      (item) => !item.productId || item.quantity <= 0
    );
    if (hasInvalidItem) {
      toast.error("Please fill in all item details");
      return;
    }

    const deliveryData: Delivery = {
      ...formData,
      id: isEdit ? formData.id : generateId(),
      createdAt: isEdit ? formData.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveDelivery(deliveryData);
    toast.success(
      isEdit
        ? "Delivery updated successfully"
        : "Delivery created successfully"
    );
    navigate("/deliveries");
  };

  const totalAmount = formData.items.reduce((sum, item) => sum + item.total, 0);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate("/deliveries")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Deliveries
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            {isEdit ? "Edit Delivery" : "New Delivery"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Delivery Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Number
                </label>
                <input
                  type="text"
                  name="deliveryNumber"
                  value={formData.deliveryNumber}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="Draft">Draft</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Ready">Ready</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer *
                </label>
                <input
                  type="text"
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warehouse *
                </label>
                <select
                  name="warehouse"
                  value={formData.warehouse}
                  onChange={handleChange}
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
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Items</h2>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={20} />
                Add Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Product
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Selling Price
                    </th>
                    <th className="text-left p-3 font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="text-center p-3 font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="p-3">
                        <select
                          value={item.productId}
                          onChange={(e) =>
                            updateItem(index, "productId", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">Select Product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} ({product.sku})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(index, "quantity", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                          min="0"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={item.sellingPrice}
                          onChange={(e) =>
                            updateItem(index, "sellingPrice", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="p-3 font-semibold text-gray-800">
                        ${item.total.toFixed(2)}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan={3} className="p-3 text-right font-semibold">
                      Total Amount:
                    </td>
                    <td className="p-3 font-bold text-lg text-gray-800">
                      ${totalAmount.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Save size={20} />
              {isEdit ? "Update Delivery" : "Create Delivery"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/deliveries")}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
