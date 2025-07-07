import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { removeFromWishlist } from '@/service/profile/wishlist';
import { addToCart } from '@/service/profile/cart'; 
import { getToken } from '@/hooks/cookieUtils';

const WishlistItem = ({ book, refreshWishlist,refreshCart }) => {
  const router = useRouter();
  const token = getToken();
  
  const imageUrl = book.imageUrl || book.coverImage || '/books/book1.jpg'; 
  
  const bookName = book.name || book.title || 'Название книги не указано';
  
  const handleRemoveFromWishlist = async () => {
    try {
      await removeFromWishlist(token, book.bookId);
      refreshWishlist();
    } catch (error) {
      console.error('Ошибка при удалении из вишлиста:', error);
    }
  };
  
  const handleAddToCart = async () => {
    try {
      console.log("Добавление книги в корзину с ID:", book.bookId);
      
      await addToCart(token, book.bookId, 1);
      console.log("✅ Успешно добавлено в корзину!");
      
      await refreshCart();
      
      const event = new CustomEvent('cartUpdated');
      window.dispatchEvent(event);
  
      alert("Китеп ийгиликтүү себетке кошулду!");
    } catch (error) {
      console.error('Ошибка при добавлении в корзину:', error);
      console.error('Детали ошибки:', error.response ? error.response.data : error.message);
      alert("Китеп себетке кошулбай калды. Кийинчерээк байкап көрүңүз.");
    }
  };
  
  const navigateToBookDetails = () => {
    router.push(`/books/${book.bookId}`);
  };
  
  const originalPrice = book.price || book.regularPrice || 0;
  const discountedPrice = book.discountPrice || book.salePrice || originalPrice;
  
  return (
    <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div
        className="bg-gray-100 w-full h-56 cursor-pointer relative"
        onClick={navigateToBookDetails}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={bookName}
            width={200}
            height={300}
            className="w-full h-full object-contain p-2"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Нет изображения
          </div>
        )}
      </div>
      
      <div className="p-3 flex flex-col">
        <h3 
          className="font-medium cursor-pointer text-gray-800 hover:text-blue-600 line-clamp-2" 
          onClick={navigateToBookDetails}
        >
          {bookName}
        </h3>
        
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="font-bold text-green-700">{discountedPrice}с</span>
            {discountedPrice < originalPrice && (
              <span className="text-gray-400 text-sm line-through ml-2">{originalPrice}с</span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleRemoveFromWishlist}
              className="p-1.5 text-red-500 hover:text-gray-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
            
            <button
              onClick={handleAddToCart}
              className="p-1.5 text-gray-700 hover:text-blue-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;