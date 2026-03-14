import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getMovements } from "../utils/inventory";
import { Movement } from "../types/inventory";
import { Search, Download } from "lucide-react";

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = () => {
    setMovements(
      getMovements().sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
  };

  const filteredMovements = movements.filter((movement) => {
    const matchesSearch =
      movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.documentNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || movement.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Receipt":
        return "bg-green-100 text-green-800";
      case "Delivery":
        return "bg-red-100 text-red-800";
      case "Transfer":
        return "bg-blue-100 text-blue-800";
      case "Adjustment":
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
                placeholder="Search movements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="All">All Types</option>
              <option value="Receipt">Receipt</option>
              <option value="Delivery">Delivery</option>
              <option value="Transfer">Transfer</option>
              <option value="Adjustment">Adjustment</option>
            </select>
          </div>

          <button
            onClick={() => alert("Export functionality would go here")}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download size={20} />
            Export
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredMovements.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No movements found
              </h3>
              <p className="text-gray-500">
                {searchTerm || typeFilter !== "All"
                  ? "Try adjusting your filters"
                  : "Movement history will appear here"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Document #
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Product
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Location
                    </th>
                    <th className="text-right p-4 font-semibold text-gray-700">
                      Qty In
                    </th>
                    <th className="text-right p-4 font-semibold text-gray-700">
                      Qty Out
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      Reference
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      By
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovements.map((movement) => (
                    <tr
                      key={movement.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-4 text-gray-600">
                        {new Date(movement.date).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                            movement.type
                          )}`}
                        >
                          {movement.type}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-gray-800">
                        {movement.documentNumber}
                      </td>
                      <td className="p-4 text-gray-600">
                        {movement.productName}
                      </td>
                      <td className="p-4 text-gray-600">
                        {movement.warehouse}
                        {movement.location && ` / ${movement.location}`}
                      </td>
                      <td className="p-4 text-right">
                        {movement.quantityIn > 0 && (
                          <span className="font-semibold text-green-600">
                            +{movement.quantityIn}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {movement.quantityOut > 0 && (
                          <span className="font-semibold text-red-600">
                            -{movement.quantityOut}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-600 text-sm">
                        {movement.reference}
                      </td>
                      <td className="p-4 text-gray-600 text-sm">
                        {movement.createdBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
