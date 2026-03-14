import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Layout from "../components/Layout";
import { getTransfers, deleteTransfer } from "../utils/inventory";
import { Transfer } from "../types/inventory";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function TransfersPage() {
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadTransfers();
  }, []);

  const loadTransfers = () => {
    setTransfers(
      getTransfers().sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
  };

  const handleDelete = (id: string, transferNumber: string) => {
    if (
      confirm(`Are you sure you want to delete transfer "${transferNumber}"?`)
    ) {
      deleteTransfer(id);
      toast.success("Transfer deleted successfully");
      loadTransfers();
    }
  };

  const filteredTransfers = transfers.filter((transfer) => {
    const matchesSearch = transfer.transferNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || transfer.status === statusFilter;
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
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search transfers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

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

          <button
            onClick={() => navigate("/transfers/new")}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            New Transfer
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredTransfers.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No transfers found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "All"
                  ? "Try adjusting your filters"
                  : "Create your first transfer to get started"}
              </p>
              {!searchTerm && statusFilter === "All" && (
                <button
                  onClick={() => navigate("/transfers/new")}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  New Transfer
                </button>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Transfer #
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    From
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-700">
                    To
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
                {filteredTransfers.map((transfer) => (
                  <tr
                    key={transfer.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {transfer.transferNumber}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(transfer.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-600">
                      <div>
                        <p className="font-medium">{transfer.fromWarehouse}</p>
                        <p className="text-xs text-gray-500">
                          {transfer.fromLocation}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div>
                        <p className="font-medium">{transfer.toWarehouse}</p>
                        <p className="text-xs text-gray-500">
                          {transfer.toLocation}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {transfer.items.length} item(s)
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          transfer.status
                        )}`}
                      >
                        {transfer.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/transfers/edit/${transfer.id}`)
                          }
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(transfer.id, transfer.transferNumber)
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
