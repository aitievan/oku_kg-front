
import React, { useEffect, useState } from 'react';
import { getCartWithBookDetails, clearCart } from '@/service/profile/cart';
import { getToken } from '@/hooks/cookieUtils';
import CartItem from './CartItem';
import getStripe from '@/service/stripe';
import { api } from '@/service/axios';
import OrderHistory from './OrderHistory';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderData, setOrderData] = useState({
    selfPickup: false,
    phoneNumber: '',
    deliveryAddress: '',
    additionalNotes: ''
  });
  const [activeTab, setActiveTab] = useState('cart');
  
  const token = getToken();
  
  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const data = await getCartWithBookDetails(token);
      setCartItems(data || []);
      calculateTotal(data);
    } catch (error) {
      console.error('Себетти жүктөөдө ката кетти:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const calculateTotal = (items) => {
    const totalSum = items.reduce((sum, item) => {
      if (item.available === false) {
        return sum;
      }
      
      const itemTotal = item.totalPrice || (item.discountPrice || item.price) * item.quantity;
      return sum + itemTotal;
    }, 0);
    setTotal(totalSum);
  };
  
  useEffect(() => {
    if (token) {
      fetchCart();
      
      const handleCartUpdate = () => {
        console.log("🔄 Себетти жаңыртуу окуясы алынды");
        fetchCart();
      };
      
      window.addEventListener('cartUpdated', handleCartUpdate);
      
      return () => {
        window.removeEventListener('cartUpdated', handleCartUpdate);
      };
    }
  }, [token]);
  
  const handleClearCart = async () => {
    if (window.confirm('Чын эле сепет тизмеңизди толугу менен тазалагыңыз келеби?')) {
      try {
        await clearCart(token);
        setCartItems([]);
        setTotal(0);
      } catch (error) {
        console.error('Сепетти тазалоодо ката кетти:', error);
      }
    }
  };

  const handleCheckout = async () => {
    if (availableItems.length === 0 || isProcessing) return;
    
    setIsProcessing(true);
    try {
      if (!orderData.phoneNumber) {
        throw new Error('Телефон номуру керектүү');
      }
  
      if (!orderData.selfPickup && !orderData.deliveryAddress) {
        throw new Error('Жеткирүү дареги керектүү');
      }
  
      const { data } = await api.post('/user/orders/create', {
        selfPickup: orderData.selfPickup,
        phoneNumber: orderData.phoneNumber,
        deliveryAddress: orderData.deliveryAddress,
        additionalNotes: orderData.additionalNotes,
        orderItems: availableItems.map(item => ({
          bookId: item.bookId,
          quantity: item.quantity
        }))
      }, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        validateStatus: (status) => status < 500 
      });
  
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });
  
      if (error) throw error;
  
    } catch (error) {
      console.error('Буюртма катасы:', error);
      
      let errorMessage = 'Буюртма берүүдө ката кетти';
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = 'Кирүү мүмкүн эмес. Кайрадан авторизациядан өтүү керек';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      
      if (error.response?.status === 403) {
        if (confirm('Сессия мөөнөтү бүттү. Кайрадан кирүү керекпи?')) {
          window.location.href = '/auth/login';
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({ ...prev, [name]: value }));
  };
  
  const availableItems = cartItems.filter(item => item.available !== false);
  const unavailableItems = cartItems.filter(item => item.available === false);
  
  return (
    <div className="border border-gray-200 rounded-md shadow-sm">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('cart')}
          className={`flex-1 py-3 font-medium text-center ${
            activeTab === 'cart'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Себет
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 font-medium text-center ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Буюртмалардын тарыхы
        </button>
      </div>
      
      {activeTab === 'cart' ? (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
            <h2 className="text-xl font-semibold">Себет</h2>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Тизмекти тазалоо
              </button>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Сиздин себетиңиз бош
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-4">
                {availableItems.map((item) => (
                  <CartItem
                    key={item.cartItemId}
                    item={item}
                    refreshCart={fetchCart}
                  />
                ))}
              </div>
              
              {unavailableItems.length > 0 && (
                <div className="my-4 border-t border-gray-200 pt-4">
                  <h3 className="text-md font-medium text-red-500 mb-2">Жеткиликсиз товарлар</h3>
                  <div className="space-y-4">
                    {unavailableItems.map((item) => (
                      <CartItem
                        key={item.cartItemId}
                        item={item}
                        refreshCart={fetchCart}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-3">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="selfPickup"
                      checked={orderData.selfPickup}
                      onChange={(e) => setOrderData(prev => ({ ...prev, selfPickup: e.target.checked }))}
                      className="mr-2"
                    />
                    Өзүм алып кетем
                  </label>
                </div>

                {!orderData.selfPickup && (
                  <div>
                    <input
                      type="text"
                      name="deliveryAddress"
                      value={orderData.deliveryAddress}
                      onChange={handleInputChange}
                      placeholder="Жеткирүү дареги"
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                )}

                <div>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={orderData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Телефон номери"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <textarea
                    name="additionalNotes"
                    value={orderData.additionalNotes}
                    onChange={handleInputChange}
                    placeholder="Кошумча маалымат"
                    className="w-full p-2 border rounded"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Жалпысы:</span>
                  <span className="font-bold text-lg">{total}с</span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  disabled={availableItems.length === 0 || isProcessing}
                  className={`w-full py-2 ${
                    availableItems.length === 0 || isProcessing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  } rounded-md transition-colors`}
                >
                  {isProcessing ? 'Иштелүүдө...' : 'Буюртма берүү'}
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">Буюртмалардын тарыхы</h2>
          <OrderHistory token={token} />
        </div>
      )}
    </div>
  );
};

export default Cart;