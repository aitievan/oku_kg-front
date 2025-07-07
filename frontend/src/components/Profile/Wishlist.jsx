import React, { useEffect, useState } from 'react';
import { getWishlistWithBookDetails, clearWishlist } from '@/service/profile/wishlist';
import { getToken } from '@/hooks/cookieUtils';
import { getCartWithBookDetails } from '@/service/profile/cart'; 
import WishlistItem from './WishlistItem';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const token = getToken();
  
  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const data = await getWishlistWithBookDetails(token);
      setWishlistItems(data || []);
    } catch (error) {
      console.error('Ошибка при загрузке вишлиста:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const data = await getCartWithBookDetails(token);
      console.log("📦 Данные из API перед setCartItems:", data);
      setCartItems(data || []);
      console.log("✅ Вызван setCartItems с:", data || []);
    } catch (error) {
      console.error("Ошибка при загрузке корзины:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWishlist();
      fetchCart(); 
    }
  }, [token]);
  
  const handleClearWishlist = async () => {
    if (window.confirm('Чын эле вишлист тизмеңизди толугу менен тазалагыңыз келеби?')) {
      try {
        await clearWishlist(token);
        console.log('Вишлист тазаланды!'); 
        
        fetchWishlist(); 
      } catch (error) {
        console.error('Вишлистти тазалоодо ката кетти:', error);
      }
    }
  };
  console.log("🔄 Перед рендером Wishlist:", cartItems);
  return (
    <div className="border border-blue-500 p-4 rounded-md">
      <div className="flex justify-between items-center mb-4 border-b border-blue-300 pb-2">
        <h2 className="text-xl font-semibold">Вишлист</h2>
        {wishlistItems.length > 0 && (
          <button 
            onClick={handleClearWishlist}
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
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
         Сиздин вишлист тизмеңиз бош
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wishlistItems.map((item) => (
            <WishlistItem 
              key={item.wishlistId || item.bookId} 
              book={item} 
              refreshWishlist={fetchWishlist} 
              refreshCart={fetchCart} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
