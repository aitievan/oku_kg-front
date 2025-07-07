import React, { useState } from "react";
import {
  increaseCartItem,
  decreaseCartItem,
  removeFromCart,
} from "@/service/profile/cart";
import { getToken } from "@/hooks/cookieUtils";

const CartItem = ({ item, refreshCart }) => {
  const token = getToken();
  const [notification, setNotification] = useState("");

  const imageUrl = item.imageUrl || item.coverImage || "/books/placeholder.jpg";

  const bookName = item.name || item.title || "Название книги не указано";

  const isAvailable = item.available !== false; 

  const handleIncrease = async () => {
    if (!isAvailable) {
      handleUnavailableIncrease();
      return;
    }

    try {
      await increaseCartItem(token, item.cartItemId);
      refreshCart();
    } catch (error) {
      console.error("Ошибка при увеличении количества книги в корзине:", error);
      setNotification("Азыркы учурда бул китеп сатыкта жок ");
      setTimeout(() => {
        setNotification("");
      }, 3000);
    }
  };

  const handleUnavailableIncrease = () => {
    setNotification("Азырку учурда сатыкта жок");
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const handleDecrease = async () => {
    try {
      if (item.quantity > 1) {
        await decreaseCartItem(token, item.cartItemId);
        refreshCart();
      }
    } catch (error) {
      console.error("Ошибка при уменьшении количества книги в корзине:", error);
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(token, item.cartItemId);
      refreshCart();
    } catch (error) {
      console.error("Ошибка при удалении книги из корзины:", error);
    }
  };

  const price = item.discountPrice || item.price || 0;
  const totalPrice = item.totalPrice || price * item.quantity;

  return (
    <div className={`flex items-center border ${!isAvailable ? 'border-red-200 bg-red-50' : 'border-gray-200'} rounded-lg p-4 shadow-sm relative`}>
      <div className="w-16 h-24 flex-shrink-0 bg-gray-100 mr-4">
        <img
          src={imageUrl}
          alt={bookName}
          width={64}
          height={96}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex-grow">
        <h3 className="font-medium text-gray-800 line-clamp-2 mb-1">
          {bookName}
        </h3>
        
        {!isAvailable && (
          <p className="text-red-500 text-sm mb-1">Сатыкта жок</p>
        )}
        
        {notification && (
          <p className="text-red-500 text-sm font-medium mb-2 animate-pulse">
            {notification}
          </p>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className={`w-8 h-8 flex items-center justify-center border rounded ${
                item.quantity <= 1
                  ? "text-gray-300 border-gray-200"
                  : "text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              -
            </button>
            <span className="w-8 text-center">{item.quantity}</span>
            
            <button
              onClick={handleIncrease}
              disabled={!isAvailable}
              className={`w-8 h-8 flex items-center justify-center border rounded ${
                !isAvailable
                  ? "text-gray-300 border-gray-200"
                  : "text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              +
            </button>
          </div>

          <div className="font-bold ml-4">
            {price}с
          </div>
        </div>
      </div>

      <div className="ml-4 flex flex-col items-end">
        <button
          onClick={handleRemove}
          className="text-gray-400 hover:text-red-500 mb-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;