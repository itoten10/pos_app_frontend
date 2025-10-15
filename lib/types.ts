/**
 * 型定義ファイル
 */

export interface Product {
  product_code: string;
  product_name: string;
  price_with_tax: number;
  description?: string;
  category?: string;
  stock_quantity: number;
  is_active: boolean;
}

export interface PurchaseItem {
  product_code: string;
  product_name: string;
  unit_price: number;
  quantity: number;
}

export interface PurchaseRequest {
  items: PurchaseItem[];
  cashier_code: string;
  customer_id?: string;
  store_code?: string;
}

export interface PurchaseResponse {
  purchase_id: number;
  total_amount: number;
  purchase_datetime: string;
  cashier_code: string;
  items: PurchaseItem[];
}
