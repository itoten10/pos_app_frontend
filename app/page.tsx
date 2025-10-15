'use client';

import { useState } from 'react';
import { Product, PurchaseItem } from '@/lib/types';
import { getProductByCode, createPurchase } from '@/lib/api';

export default function POSPage() {
  // 状態管理
  const [productCode, setProductCode] = useState('');
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<PurchaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // 商品コード読み込み
  const handleLoadProduct = async () => {
    if (!productCode.trim()) {
      setError('商品コードを入力してください');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const product = await getProductByCode(productCode.trim());
      setCurrentProduct(product);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '商品の取得に失敗しました');
      setCurrentProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  // カートに追加
  const handleAddToCart = () => {
    if (!currentProduct) {
      setError('商品を読み込んでください');
      return;
    }

    // 既にカートにある場合は数量を増やす
    const existingItemIndex = cartItems.findIndex(
      item => item.product_code === currentProduct.product_code
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
    } else {
      // 新規追加
      const newItem: PurchaseItem = {
        product_code: currentProduct.product_code,
        product_name: currentProduct.product_name,
        unit_price: currentProduct.price_with_tax,
        quantity: 1,
      };
      setCartItems([...cartItems, newItem]);
    }

    // リセット
    setCurrentProduct(null);
    setProductCode('');
    setError(null);
  };

  // カートから削除
  const handleRemoveFromCart = (index: number) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
  };

  // 数量変更
  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = newQuantity;
    setCartItems(updatedItems);
  };

  // 合計金額計算
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  };

  // 購入処理
  const handlePurchase = async () => {
    if (cartItems.length === 0) {
      setError('カートが空です');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const purchaseData = {
        items: cartItems,
        cashier_code: '9999999999', // セルフレジ固定値
      };

      const result = await createPurchase(purchaseData);
      setTotalAmount(result.total_amount);
      setShowSuccessModal(true);

      // カートをクリア
      setCartItems([]);
      setCurrentProduct(null);
      setProductCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '購入処理に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 成功モーダルを閉じる
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    setTotalAmount(0);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <header className="bg-blue-600 text-white p-6 rounded-lg shadow-lg mb-6">
          <h1 className="text-3xl font-bold text-center">POSセルフレジシステム</h1>
          <p className="text-center mt-2 text-blue-100">テクワン株式会社 ポップアップストア</p>
        </header>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* 商品コード読み込みセクション */}
        <section className="card mb-6">
          <h2 className="text-xl font-bold mb-4">商品コード読み込み</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLoadProduct()}
              placeholder="商品コードを入力（例: 4901681517305）"
              className="input-field flex-1"
              disabled={isLoading}
            />
            <button
              onClick={handleLoadProduct}
              disabled={isLoading}
              className="btn-primary min-w-[120px]"
            >
              {isLoading ? '読込中...' : '読み込み'}
            </button>
          </div>

          {/* 商品情報表示 */}
          {currentProduct && (
            <div className="bg-green-50 border border-green-300 p-4 rounded">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-bold text-lg">{currentProduct.product_name}</p>
                  <p className="text-gray-600 text-sm">コード: {currentProduct.product_code}</p>
                  {currentProduct.category && (
                    <p className="text-gray-600 text-sm">カテゴリ: {currentProduct.category}</p>
                  )}
                </div>
                <p className="text-2xl font-bold text-blue-600">¥{currentProduct.price_with_tax.toLocaleString()}</p>
              </div>
              <button
                onClick={handleAddToCart}
                className="btn-success w-full mt-3"
              >
                カートに追加
              </button>
            </div>
          )}
        </section>

        {/* 購入リストセクション */}
        <section className="card mb-6">
          <h2 className="text-xl font-bold mb-4">購入リスト</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">カートは空です</p>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-bold">{item.product_name}</p>
                      <p className="text-sm text-gray-600">¥{item.unit_price.toLocaleString()} × {item.quantity}</p>
                    </div>
                    <p className="font-bold text-lg">¥{(item.unit_price * item.quantity).toLocaleString()}</p>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleQuantityChange(index, item.quantity - 1)}
                      className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
                    >
                      －
                    </button>
                    <span className="px-3 py-1 bg-white border border-gray-300 rounded min-w-[50px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(index, item.quantity + 1)}
                      className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
                    >
                      ＋
                    </button>
                    <button
                      onClick={() => handleRemoveFromCart(index)}
                      className="btn-danger ml-auto"
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 合計金額表示 */}
          {cartItems.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold">合計金額</span>
                <span className="text-3xl font-bold text-blue-600">¥{calculateTotal().toLocaleString()}</span>
              </div>

              <button
                onClick={handlePurchase}
                disabled={isLoading}
                className="btn-success w-full text-xl py-4"
              >
                {isLoading ? '処理中...' : '購入'}
              </button>
            </div>
          )}
        </section>

        {/* 成功モーダル */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="text-6xl mb-4">✓</div>
                <h3 className="text-2xl font-bold mb-4">購入完了</h3>
                <p className="text-gray-600 mb-2">ご購入ありがとうございました</p>
                <p className="text-3xl font-bold text-blue-600 mb-6">¥{totalAmount.toLocaleString()}</p>
                <button
                  onClick={closeSuccessModal}
                  className="btn-primary w-full text-lg py-3"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
