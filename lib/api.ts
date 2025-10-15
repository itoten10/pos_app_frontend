/**
 * API通信用ユーティリティ
 */

import { Product, PurchaseRequest, PurchaseResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * 全商品取得
 */
export async function getAllProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/api/products`);
  if (!response.ok) {
    throw new Error('商品の取得に失敗しました');
  }
  return response.json();
}

/**
 * 商品コードで検索
 */
export async function getProductByCode(productCode: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/api/products/${productCode}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('商品が見つかりません');
    }
    throw new Error('商品の取得に失敗しました');
  }
  return response.json();
}

/**
 * 商品検索（キーワード）
 */
export async function searchProducts(keyword: string): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/api/products/search/${encodeURIComponent(keyword)}`);
  if (!response.ok) {
    throw new Error('商品の検索に失敗しました');
  }
  return response.json();
}

/**
 * 購買データ保存
 */
export async function createPurchase(purchaseData: PurchaseRequest): Promise<PurchaseResponse> {
  const response = await fetch(`${API_BASE_URL}/api/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(purchaseData),
  });

  if (!response.ok) {
    throw new Error('購買データの保存に失敗しました');
  }

  return response.json();
}

/**
 * 購買履歴取得
 */
export async function getPurchaseById(purchaseId: number): Promise<PurchaseResponse> {
  const response = await fetch(`${API_BASE_URL}/api/purchase/${purchaseId}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('購買履歴が見つかりません');
    }
    throw new Error('購買履歴の取得に失敗しました');
  }
  return response.json();
}
