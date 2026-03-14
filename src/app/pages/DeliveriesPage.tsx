import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Layout from "../components/Layout";
import { getDeliveries, deleteDelivery } from "../utils/inventory";
import { Delivery } from "../types/inventory";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function DeliveriesPage() {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = () => {
    setDeliveries(
      getDeliveries().sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
  };

  const handleDelete = (id: string, deliveryNumber: string) => {
    if (
      confirm(`Are you sure you want to delete delivery "${deliveryNumber}"?`)
    ) {
      deleteDelivery(id);
      toast.success("Delivery deleted successfully");
      loadDeliveries();
    }
  };

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.deliveryNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      delivery.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-800";
      case "Ready":
        return "bg-blue-100 text-blue-800";
      case "Waiting":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
                placeholder="Search deliveries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="All">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Waiting">Waiting</option>
              <option value="Ready">Ready</option>
              <option value="Done">Done</option>
            </select>
          </div>

          {/* Add Delivery Button */}
          <button
            onClick={() => navigate("/deliveries/new")}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            New Delivery
          </button>
        </div>

        {/* Deliveries Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredDeliveries.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No deliveries found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "All"
                  ? "Try adjusting your filters"
                  : "Create your first delivery to get started"}
              </p>
              {!searchTerm && statusFilter === "All" && (
                <button
                  onClick={() => navigate("/deliveries/new")}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  New Delivery
                </button>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Delivery #
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Warehouse
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Items
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-right p-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map((delivery) => (
                  <tr
                    key={delivery.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {delivery.deliveryNumber}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(delivery.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-600">{delivery.customer}</td>
                    <td className="p-4 text-gray-600">{delivery.warehouse}</td>
                    <td className="p-4 text-gray-600">
                      {delivery.items.length} item(s)
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          delivery.status
                        )}`}
                      >
                        {delivery.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/deliveries/edit/${delivery.id}`)
                          }
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(delivery.id, delivery.deliveryNumber)
                          }
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
