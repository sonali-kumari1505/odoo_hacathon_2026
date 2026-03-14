export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  location: string;
  warehouse: string;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  date: string;
  supplier: string;
  warehouse: string;
  status: "Draft" | "Waiting" | "Ready" | "Done";
  items: ReceiptItem[];
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReceiptItem {
  productId: string;
  productName: string;
  quantity: number;
  costPrice: number;
  total: number;
}

export interface Delivery {
  id: string;
  deliveryNumber: string;
  date: string;
  customer: string;
  warehouse: string;
  status: "Draft" | "Waiting" | "Ready" | "Done";
  items: DeliveryItem[];
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryItem {
  productId: string;
  productName: string;
  quantity: number;
  sellingPrice: number;
  total: number;
}

export interface Transfer {
  id: string;
  transferNumber: string;
  date: string;
  fromWarehouse: string;
  toWarehouse: string;
  fromLocation: string;
  toLocation: string;
  status: "Draft" | "Waiting" | "Ready" | "Done";
  items: TransferItem[];
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransferItem {
  productId: string;
  productName: string;
  quantity: number;
}

export interface Adjustment {
  id: string;
  adjustmentNumber: string;
  date: string;
  productId: string;
  productName: string;
  warehouse: string;
  location: string;
  currentStock: number;
  adjustedStock: number;
  difference: number;
  reason: string;
  notes: string;
  createdBy: string;
  createdAt: string;
}

export interface Movement {
  id: string;
  date: string;
  type: "Receipt" | "Delivery" | "Transfer" | "Adjustment";
  documentNumber: string;
  productId: string;
  productName: string;
  warehouse: string;
  location: string;
  quantityIn: number;
  quantityOut: number;
  balance: number;
  reference: string;
  createdBy: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  locations: Location[];
}

export interface Location {
  id: string;
  name: string;
  code: string;
}
