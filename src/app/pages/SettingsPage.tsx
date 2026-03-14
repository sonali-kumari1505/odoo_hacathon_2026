import { useState } from "react";
import Layout from "../components/Layout";
import {
  getWarehouses,
  saveWarehouse,
  deleteWarehouse,
  generateId,
} from "../utils/inventory";
import { Warehouse, Location } from "../types/inventory";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [warehouses, setWarehouses] = useState(getWarehouses());
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(
    null
  );
  const [warehouseForm, setWarehouseForm] = useState({
    name: "",
    code: "",
    locations: [] as Location[],
  });

  const loadWarehouses = () => {
    setWarehouses(getWarehouses());
  };

  const handleAddWarehouse = () => {
    setEditingWarehouse(null);
    setWarehouseForm({
      name: "",
      code: "",
      locations: [],
    });
    setShowWarehouseModal(true);
  };

  const handleEditWarehouse = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setWarehouseForm({
      name: warehouse.name,
      code: warehouse.code,
      locations: [...warehouse.locations],
    });
    setShowWarehouseModal(true);
  };

  const handleDeleteWarehouse = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete warehouse "${name}"?`)) {
      deleteWarehouse(id);
      toast.success("Warehouse deleted successfully");
      loadWarehouses();
    }
  };

  const handleSaveWarehouse = () => {
    if (!warehouseForm.name || !warehouseForm.code) {
      toast.error("Please fill in all required fields");
      return;
    }

    const warehouseData: Warehouse = {
      id: editingWarehouse?.id || generateId(),
      name: warehouseForm.name,
      code: warehouseForm.code,
      locations: warehouseForm.locations,
    };

    saveWarehouse(warehouseData);
    toast.success(
      editingWarehouse
        ? "Warehouse updated successfully"
        : "Warehouse created successfully"
    );
    setShowWarehouseModal(false);
    loadWarehouses();
  };

  const handleAddLocation = () => {
    const newLocation: Location = {
      id: generateId(),
      name: `Location ${warehouseForm.locations.length + 1}`,
      code: `LOC-${warehouseForm.locations.length + 1}`,
    };
    setWarehouseForm({
      ...warehouseForm,
      locations: [...warehouseForm.locations, newLocation],
    });
  };

  const handleUpdateLocation = (
    index: number,
    field: "name" | "code",
    value: string
  ) => {
    const updatedLocations = [...warehouseForm.locations];
    updatedLocations[index] = {
      ...updatedLocations[index],
      [field]: value,
    };
    setWarehouseForm({
      ...warehouseForm,
      locations: updatedLocations,
    });
  };

  const handleDeleteLocation = (index: number) => {
    setWarehouseForm({
      ...warehouseForm,
      locations: warehouseForm.locations.filter((_, i) => i !== index),
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Warehouse & Location Management
          </h2>
          <button
            onClick={handleAddWarehouse}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Add Warehouse
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {warehouses.map((warehouse) => (
            <div
              key={warehouse.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
            >
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{warehouse.name}</h3>
                    <p className="text-sm opacity-90">{warehouse.code}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditWarehouse(warehouse)}
                      className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteWarehouse(warehouse.id, warehouse.name)
                      }
                      className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-semibold text-gray-700 mb-3">Locations:</h4>
                {warehouse.locations.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">
                    No locations added
                  </p>
                ) : (
                  <div className="space-y-2">
                    {warehouse.locations.map((location) => (
                      <div
                        key={location.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {location.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {location.code}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warehouse Modal */}
      {showWarehouseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingWarehouse ? "Edit Warehouse" : "Add New Warehouse"}
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Warehouse Name *
                    </label>
                    <input
                      type="text"
                      value={warehouseForm.name}
                      onChange={(e) =>
                        setWarehouseForm({
                          ...warehouseForm,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Main Warehouse"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Warehouse Code *
                    </label>
                    <input
                      type="text"
                      value={warehouseForm.code}
                      onChange={(e) =>
                        setWarehouseForm({
                          ...warehouseForm,
                          code: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="WH-MAIN"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Locations
                    </label>
                    <button
                      type="button"
                      onClick={handleAddLocation}
                      className="flex items-center gap-1 text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
                    >
                      <Plus size={16} />
                      Add Location
                    </button>
                  </div>

                  <div className="space-y-2">
                    {warehouseForm.locations.map((location, index) => (
                      <div
                        key={location.id}
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                      >
                        <input
                          type="text"
                          value={location.name}
                          onChange={(e) =>
                            handleUpdateLocation(index, "name", e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Location Name"
                        />
                        <input
                          type="text"
                          value={location.code}
                          onChange={(e) =>
                            handleUpdateLocation(index, "code", e.target.value)
                          }
                          className="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder="Code"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteLocation(index)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSaveWarehouse}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <Save size={20} />
                    {editingWarehouse ? "Update Warehouse" : "Create Warehouse"}
                  </button>
                  <button
                    onClick={() => setShowWarehouseModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
