import {
  Product,
  Receipt,
  Delivery,
  Transfer,
  Adjustment,
  Movement,
  Warehouse,
} from "../types/inventory";

const PRODUCTS_KEY = "inventory_products";
const RECEIPTS_KEY = "inventory_receipts";
const DELIVERIES_KEY = "inventory_deliveries";
const TRANSFERS_KEY = "inventory_transfers";
const ADJUSTMENTS_KEY = "inventory_adjustments";
const MOVEMENTS_KEY = "inventory_movements";
const WAREHOUSES_KEY = "inventory_warehouses";

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Products
export const getProducts = (): Product[] => {
  const products = localStorage.getItem(PRODUCTS_KEY);
  return products ? JSON.parse(products) : [];
};

export const saveProduct = (product: Product): void => {
  const products = getProducts();
  const existingIndex = products.findIndex((p) => p.id === product.id);
  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const deleteProduct = (id: string): void => {
  const products = getProducts().filter((p) => p.id !== id);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getProductById = (id: string): Product | undefined => {
  return getProducts().find((p) => p.id === id);
};

// Receipts
export const getReceipts = (): Receipt[] => {
  const receipts = localStorage.getItem(RECEIPTS_KEY);
  return receipts ? JSON.parse(receipts) : [];
};

export const saveReceipt = (receipt: Receipt): void => {
  const receipts = getReceipts();
  const existingIndex = receipts.findIndex((r) => r.id === receipt.id);
  if (existingIndex >= 0) {
    receipts[existingIndex] = receipt;
  } else {
    receipts.push(receipt);
  }
  localStorage.setItem(RECEIPTS_KEY, JSON.stringify(receipts));
  
  // Update product stock if status is "Done"
  if (receipt.status === "Done") {
    receipt.items.forEach((item) => {
      const product = getProductById(item.productId);
      if (product) {
        product.currentStock += item.quantity;
        saveProduct(product);
      }
    });
    
    // Add movement record
    receipt.items.forEach((item) => {
      addMovement({
        id: generateId(),
        date: receipt.date,
        type: "Receipt",
        documentNumber: receipt.receiptNumber,
        productId: item.productId,
        productName: item.productName,
        warehouse: receipt.warehouse,
        location: "",
        quantityIn: item.quantity,
        quantityOut: 0,
        balance: 0,
        reference: `Receipt from ${receipt.supplier}`,
        createdBy: receipt.createdBy,
      });
    });
  }
};

export const deleteReceipt = (id: string): void => {
  const receipts = getReceipts().filter((r) => r.id !== id);
  localStorage.setItem(RECEIPTS_KEY, JSON.stringify(receipts));
};

export const getReceiptById = (id: string): Receipt | undefined => {
  return getReceipts().find((r) => r.id === id);
};

// Deliveries
export const getDeliveries = (): Delivery[] => {
  const deliveries = localStorage.getItem(DELIVERIES_KEY);
  return deliveries ? JSON.parse(deliveries) : [];
};

export const saveDelivery = (delivery: Delivery): void => {
  const deliveries = getDeliveries();
  const existingIndex = deliveries.findIndex((d) => d.id === delivery.id);
  if (existingIndex >= 0) {
    deliveries[existingIndex] = delivery;
  } else {
    deliveries.push(delivery);
  }
  localStorage.setItem(DELIVERIES_KEY, JSON.stringify(deliveries));
  
  // Update product stock if status is "Done"
  if (delivery.status === "Done") {
    delivery.items.forEach((item) => {
      const product = getProductById(item.productId);
      if (product) {
        product.currentStock -= item.quantity;
        saveProduct(product);
      }
    });
    
    // Add movement record
    delivery.items.forEach((item) => {
      addMovement({
        id: generateId(),
        date: delivery.date,
        type: "Delivery",
        documentNumber: delivery.deliveryNumber,
        productId: item.productId,
        productName: item.productName,
        warehouse: delivery.warehouse,
        location: "",
        quantityIn: 0,
        quantityOut: item.quantity,
        balance: 0,
        reference: `Delivery to ${delivery.customer}`,
        createdBy: delivery.createdBy,
      });
    });
  }
};

export const deleteDelivery = (id: string): void => {
  const deliveries = getDeliveries().filter((d) => d.id !== id);
  localStorage.setItem(DELIVERIES_KEY, JSON.stringify(deliveries));
};

export const getDeliveryById = (id: string): Delivery | undefined => {
  return getDeliveries().find((d) => d.id === id);
};

// Transfers
export const getTransfers = (): Transfer[] => {
  const transfers = localStorage.getItem(TRANSFERS_KEY);
  return transfers ? JSON.parse(transfers) : [];
};

export const saveTransfer = (transfer: Transfer): void => {
  const transfers = getTransfers();
  const existingIndex = transfers.findIndex((t) => t.id === transfer.id);
  if (existingIndex >= 0) {
    transfers[existingIndex] = transfer;
  } else {
    transfers.push(transfer);
  }
  localStorage.setItem(TRANSFERS_KEY, JSON.stringify(transfers));
  
  // Add movement record if status is "Done"
  if (transfer.status === "Done") {
    transfer.items.forEach((item) => {
      addMovement({
        id: generateId(),
        date: transfer.date,
        type: "Transfer",
        documentNumber: transfer.transferNumber,
        productId: item.productId,
        productName: item.productName,
        warehouse: transfer.fromWarehouse,
        location: transfer.fromLocation,
        quantityIn: 0,
        quantityOut: item.quantity,
        balance: 0,
        reference: `Transfer to ${transfer.toWarehouse}`,
        createdBy: transfer.createdBy,
      });
    });
  }
};

export const deleteTransfer = (id: string): void => {
  const transfers = getTransfers().filter((t) => t.id !== id);
  localStorage.setItem(TRANSFERS_KEY, JSON.stringify(transfers));
};

export const getTransferById = (id: string): Transfer | undefined => {
  return getTransfers().find((t) => t.id === id);
};

// Adjustments
export const getAdjustments = (): Adjustment[] => {
  const adjustments = localStorage.getItem(ADJUSTMENTS_KEY);
  return adjustments ? JSON.parse(adjustments) : [];
};

export const saveAdjustment = (adjustment: Adjustment): void => {
  const adjustments = getAdjustments();
  adjustments.push(adjustment);
  localStorage.setItem(ADJUSTMENTS_KEY, JSON.stringify(adjustments));
  
  // Update product stock
  const product = getProductById(adjustment.productId);
  if (product) {
    product.currentStock = adjustment.adjustedStock;
    saveProduct(product);
  }
  
  // Add movement record
  addMovement({
    id: generateId(),
    date: adjustment.date,
    type: "Adjustment",
    documentNumber: adjustment.adjustmentNumber,
    productId: adjustment.productId,
    productName: adjustment.productName,
    warehouse: adjustment.warehouse,
    location: adjustment.location,
    quantityIn: adjustment.difference > 0 ? adjustment.difference : 0,
    quantityOut: adjustment.difference < 0 ? Math.abs(adjustment.difference) : 0,
    balance: adjustment.adjustedStock,
    reference: adjustment.reason,
    createdBy: adjustment.createdBy,
  });
};

// Movements
export const getMovements = (): Movement[] => {
  const movements = localStorage.getItem(MOVEMENTS_KEY);
  return movements ? JSON.parse(movements) : [];
};

export const addMovement = (movement: Movement): void => {
  const movements = getMovements();
  movements.push(movement);
  localStorage.setItem(MOVEMENTS_KEY, JSON.stringify(movements));
};

// Warehouses
export const getWarehouses = (): Warehouse[] => {
  const warehouses = localStorage.getItem(WAREHOUSES_KEY);
  if (warehouses) {
    return JSON.parse(warehouses);
  }
  
  // Initialize default warehouses
  const defaultWarehouses: Warehouse[] = [
    {
      id: "wh1",
      name: "Main Warehouse",
      code: "WH-MAIN",
      locations: [
        { id: "loc1", name: "Rack A", code: "RACK-A" },
        { id: "loc2", name: "Rack B", code: "RACK-B" },
        { id: "loc3", name: "Rack C", code: "RACK-C" },
      ],
    },
    {
      id: "wh2",
      name: "Warehouse 1",
      code: "WH-01",
      locations: [
        { id: "loc4", name: "Zone 1", code: "ZONE-1" },
        { id: "loc5", name: "Zone 2", code: "ZONE-2" },
      ],
    },
    {
      id: "wh3",
      name: "Warehouse 2",
      code: "WH-02",
      locations: [
        { id: "loc6", name: "Shelf 1", code: "SHELF-1" },
        { id: "loc7", name: "Shelf 2", code: "SHELF-2" },
      ],
    },
    {
      id: "wh4",
      name: "Production Floor",
      code: "WH-PROD",
      locations: [
        { id: "loc8", name: "Assembly Area", code: "ASSEMBLY" },
        { id: "loc9", name: "Storage Area", code: "STORAGE" },
      ],
    },
  ];
  
  localStorage.setItem(WAREHOUSES_KEY, JSON.stringify(defaultWarehouses));
  return defaultWarehouses;
};

export const saveWarehouse = (warehouse: Warehouse): void => {
  const warehouses = getWarehouses();
  const existingIndex = warehouses.findIndex((w) => w.id === warehouse.id);
  if (existingIndex >= 0) {
    warehouses[existingIndex] = warehouse;
  } else {
    warehouses.push(warehouse);
  }
  localStorage.setItem(WAREHOUSES_KEY, JSON.stringify(warehouses));
};

export const deleteWarehouse = (id: string): void => {
  const warehouses = getWarehouses().filter((w) => w.id !== id);
  localStorage.setItem(WAREHOUSES_KEY, JSON.stringify(warehouses));
};

// Dashboard Stats
export const getDashboardStats = () => {
  const products = getProducts();
  const receipts = getReceipts();
  const deliveries = getDeliveries();
  const transfers = getTransfers();
  
  const totalProducts = products.length;
  const lowStockProducts = products.filter(
    (p) => p.currentStock <= p.minStock && p.currentStock > 0
  ).length;
  const outOfStockProducts = products.filter((p) => p.currentStock === 0).length;
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.currentStock * p.costPrice,
    0
  );
  
  const pendingReceipts = receipts.filter(
    (r) => r.status === "Draft" || r.status === "Waiting"
  ).length;
  const pendingDeliveries = deliveries.filter(
    (d) => d.status === "Draft" || d.status === "Waiting"
  ).length;
  const pendingTransfers = transfers.filter(
    (t) => t.status === "Draft" || t.status === "Waiting"
  ).length;
  
  return {
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    totalStockValue,
    pendingReceipts,
    pendingDeliveries,
    pendingTransfers,
  };
};

// Initialize sample data
export const initializeSampleData = () => {
  const products = getProducts();
  if (products.length === 0) {
    const sampleProducts: Product[] = [
      {
        id: generateId(),
        name: "Laptop Dell XPS 15",
        sku: "LAP-DELL-XPS15",
        category: "Electronics",
        unit: "PCS",
        currentStock: 25,
        minStock: 10,
        maxStock: 100,
        location: "Rack A",
        warehouse: "Main Warehouse",
        costPrice: 1200,
        sellingPrice: 1500,
        supplier: "Dell Inc.",
        description: "High-performance laptop for professionals",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: "Office Chair Ergonomic",
        sku: "FUR-CHAIR-ERG01",
        category: "Furniture",
        unit: "PCS",
        currentStock: 5,
        minStock: 10,
        maxStock: 50,
        location: "Zone 1",
        warehouse: "Warehouse 1",
        costPrice: 150,
        sellingPrice: 250,
        supplier: "Office Supplies Co.",
        description: "Comfortable ergonomic office chair",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: "Wireless Mouse",
        sku: "ACC-MOUSE-WRL01",
        category: "Accessories",
        unit: "PCS",
        currentStock: 0,
        minStock: 20,
        maxStock: 200,
        location: "Rack B",
        warehouse: "Main Warehouse",
        costPrice: 15,
        sellingPrice: 30,
        supplier: "Tech Accessories Ltd.",
        description: "Wireless optical mouse",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: "Monitor 27 inch 4K",
        sku: "MON-27-4K",
        category: "Electronics",
        unit: "PCS",
        currentStock: 15,
        minStock: 5,
        maxStock: 50,
        location: "Rack C",
        warehouse: "Main Warehouse",
        costPrice: 350,
        sellingPrice: 500,
        supplier: "Display Tech Co.",
        description: "27-inch 4K resolution monitor",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: "Desk Lamp LED",
        sku: "LGT-LAMP-LED01",
        category: "Lighting",
        unit: "PCS",
        currentStock: 8,
        minStock: 15,
        maxStock: 100,
        location: "Shelf 1",
        warehouse: "Warehouse 2",
        costPrice: 25,
        sellingPrice: 45,
        supplier: "Light Solutions",
        description: "Adjustable LED desk lamp",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    
    sampleProducts.forEach(saveProduct);
  }
};
